import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {UserDb, UserDocument} from '../entity/user.entity';
import {Model} from 'mongoose';
import {CompanyDocument} from '../../company/entities/company.entity';
import {TeamDocument} from '../../team/entities/team.entity';
import {COMPANY_COLLECTION_NAME, TEAM_COLLECTION_NAME, USER_COLLECTION_NAME} from '../../provider/collections.provider';
import {CompanyService} from '../../company/company.service';
import {UserThemeService} from '../../incluscore/progression/userTheme.service';
import {LoginService} from '../../login/login.service';
import {SaveUserDto} from '../dto/save.user.dto';
import {UserDto} from '../dto/user.dto';
import {ILang} from '../../translations/LangUtils';
import * as mongoose from 'mongoose';
import {WebinarDb} from '../../webinar/entities/webinar.entity';
import {WebinarService} from '../../webinar/webinar.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
	constructor(
		@InjectModel(USER_COLLECTION_NAME)
		private readonly userDb: Model<UserDocument>,
		@InjectModel(COMPANY_COLLECTION_NAME)
		private readonly companyDb: Model<CompanyDocument>,
		@InjectModel(TEAM_COLLECTION_NAME)
		private readonly teamDb: Model<TeamDocument>,
		private readonly companyService: CompanyService,
		private readonly userThemeService: UserThemeService,
		private readonly loginService: LoginService,
		private readonly webinarService: WebinarService,
	) {}

	readonly populateTeamDelivery = {
		path: 'teamDelivery',
		populate: [{path: 'delivery', populate: 'notation'}, 'notation'],
	};

	async save(saveUserDto: SaveUserDto): Promise<UserDb> {
		if (saveUserDto._id) {
			await this.userDb.updateOne({_id: saveUserDto._id}, saveUserDto);
			return this.findOne(saveUserDto._id);
		}
		const mailInsensitive = new RegExp(saveUserDto.email, 'i');
		const user = await this.userDb.findOne({
			email: mailInsensitive,
		});
		if (user) {
			throw 'User with this email already exist';
		}
		const userCreated = new this.userDb({
			...saveUserDto,
			pwd: await bcrypt.hash(saveUserDto.pwd, LoginService.SALT),
		});
		return await (userCreated as UserDocument).save();
	}

	async removeTeamForAllUsers(idTeam: string) {
		const users: UserDb[] = await this.userDb.find();
		for (const u of users.filter((u) => u.teamId === idTeam)) {
			u.teamId = null;
			await (u as UserDocument).save();
		}
	}

	async findOne(id: string, isVeryLightUserQuery = false): Promise<UserDb> {
		const userDb = this.userDb.findById(id).populate({
			path: 'teamId',
			populate: this.populateTeamDelivery,
		});
		if (!isVeryLightUserQuery) {
			userDb
				.populate({
					path: 'companyId',
					populate: [
						{path: 'users'},
						{
							path: 'teams',
							populate: this.populateTeamDelivery,
						},
					],
				})
				.populate({
					path: 'juryOfTeams',
					populate: this.populateTeamDelivery,
				})
				.populate({
					path: 'manageTeams',
					populate: this.populateTeamDelivery,
				});
		}
		return await userDb.exec();
	}

	async setLang(userId: string, lang: ILang) {
		await this.userDb.updateOne({_id: userId}, {$set: {lang}});
	}

	async findByEmail(email: string): Promise<UserDb> {
		return await this.userDb
			.findOne({email: email.toLowerCase()})
			.populate({path: 'teamId', populate: this.populateTeamDelivery})
			.populate({path: 'companyId', populate: 'users'})
			.exec();
	}

	async findAll(): Promise<UserDb[]> {
		return await this.userDb.find().exec();
	}

	async getTeamsToManage(user: UserDto) {
		if (user.isCompanyAdmin) {
			const company = await this.companyService.findOne(user.company.id);
			return company.teams;
		}
		const teamsToDisplay = user.juryOfTeams?.length > 0 ? [...user.juryOfTeams] : [];
		if (user.manageTeams?.length > 0) {
			const teamManagedOnly = user.manageTeams.filter((t) => !teamsToDisplay.find((team) => team.id === t.id));
			if (teamManagedOnly?.length > 0) {
				teamsToDisplay.concat(teamManagedOnly);
			}
		}
		return teamsToDisplay;
	}

	async delete(id: string) {
		await this.userDb.findByIdAndDelete(id);
	}

	async deleteAndCleanRefs(id: string): Promise<UserDb[]> {
		const user: UserDb = await this.userDb.findById(id);
		if (!user) {
			return null;
		}
		const otherCompanyUsers = await this.companyService.updateUserList(user.companyId as string, id);
		await this.userThemeService.removeUserAnswers(id);
		await this.loginService.deleteTokenOfUser(id);
		await this.delete(id);
		return otherCompanyUsers;
	}

	async updateNpsNotation(userId: string, notation: number) {
		const user = await this.userDb.findById(userId);
		user.npsNotation = notation;
		await user.save();
	}

	async updateNpsComment(userId: string, comment: string) {
		const user = await this.userDb.findById(userId);
		user.npsComment = comment;
		await user.save();
	}

	async teamsIdsToTeam() {
		const users = await this.userDb.find({teamIds: {$exists: true}});
		for (const user of users) {
			if (user.teamIds) {
				user.teamId = user.teamIds[0];
				console.debug(user.teamId);
			}
			// user.teamId = new mongoose.Types.ObjectId('61c996fb50750bfec5e528ab');
			user.teamIds = undefined;
			user.save();
		}
	}

	async saveWebinarSeen(idWebinar: string, idUser: string) {
		const user: UserDb = await this.userDb.findById(idUser);
		if (
			!user.webinars ||
			!user.webinars.find((wId) => {
				return wId.toString('hex') === idWebinar;
			})
		) {
			const webinar: WebinarDb = await this.webinarService.findOne(idWebinar);
			user.webinars.push(webinar);
			await (user as UserDocument).save();
		}
	}
}
