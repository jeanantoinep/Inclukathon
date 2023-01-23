import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {CompanyDb, CompanyDocument} from './entities/company.entity';
import {Model} from 'mongoose';
import {UserDb, UserDocument} from '../user/entity/user.entity';
import {TeamDb, TeamDocument} from '../team/entities/team.entity';
import {
	AVAILABLE_REGION_COLLECTION_NAME,
	COMPANY_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	USER_COLLECTION_NAME,
} from '../provider/collections.provider';
import {SaveCompanyDto} from './dto/save.company.dto';
import {TeamArborescenceDb, TeamArborescenceDocument} from './entities/teamArborescence.entity';
import {AvailableRegionDb, AvailableRegionDocument} from './entities/availableRegion.entity';
import {SaveAvailableRegionDto} from './dto/saveAvailableRegion.dto';

@Injectable()
export class CompanyService {
	constructor(
		@InjectModel(COMPANY_COLLECTION_NAME)
		private readonly companyDb: Model<CompanyDocument>,
		@InjectModel(USER_COLLECTION_NAME)
		private readonly userDb: Model<UserDocument>,
		@InjectModel(TEAM_COLLECTION_NAME)
		private readonly teamDb: Model<UserDocument>,
		@InjectModel(AVAILABLE_REGION_COLLECTION_NAME)
		private readonly availableRegionDb: Model<AvailableRegionDocument>,
	) {}

	async save(saveCompanyDto: SaveCompanyDto): Promise<CompanyDb> {
		if (saveCompanyDto._id) {
			await this.companyDb.updateOne({_id: saveCompanyDto._id}, saveCompanyDto);
			return this.findOne(saveCompanyDto._id);
		}
		const companyUpdated = new this.companyDb(saveCompanyDto);
		return await (companyUpdated as CompanyDocument).save();
	}

	async addUser(id: string, user: UserDb): Promise<CompanyDb> {
		const companyDb = await this.findOne(id);
		companyDb.users.push(user);
		return await (companyDb as CompanyDocument).save();
	}

	async addTeam(id: string, team: TeamDb): Promise<CompanyDb> {
		const companyDb = await this.findOne(id);
		companyDb.teams.push(team);
		return await (companyDb as CompanyDocument).save();
	}

	async addTeamArborescence(id: string, teamArborescence: TeamArborescenceDb): Promise<CompanyDb> {
		const companyDb = await this.findOne(id);
		companyDb.teamArborescence.push(teamArborescence);
		return await (companyDb as CompanyDocument).save();
	}

	async findAllArborescenceForTeamForm(idCompany: string) {
		const company = await this.companyDb.findById(idCompany).populate('teamArborescence');
		return company.teamArborescence;
	}

	async addAvailableRegion(id: string, availableRegion: AvailableRegionDb): Promise<CompanyDb> {
		const companyDb = await this.findOne(id);
		companyDb.availableRegions.push(availableRegion);
		return await (companyDb as CompanyDocument).save();
	}

	async saveAvailableRegion(newRegion: SaveAvailableRegionDto): Promise<AvailableRegionDb> {
		if (newRegion._id) {
			await this.availableRegionDb.updateOne({_id: newRegion._id}, newRegion);
			return this.availableRegionDb.findById(newRegion._id);
		}
		const updated = new this.availableRegionDb(newRegion);
		return await (updated as AvailableRegionDocument).save();
	}

	async deleteOneAvailableRegion(id: string) {
		await this.availableRegionDb.findByIdAndDelete(id);
	}

	async updateAvailableRegionList(id: string, idAvailableRegion: string) {
		const company = await this.companyDb.findById(id);
		company.availableRegions = company.availableRegions.filter(
			(t) => !(t as AvailableRegionDocument)._id.equals(idAvailableRegion),
		);
		await company.save();
		const companyDb = await this.findOne(id);
		return companyDb.availableRegions;
	}

	async findOne(companyId: string): Promise<CompanyDb> {
		return this.companyDb
			.findById(companyId)
			.populate({
				path: 'users',
				populate: [
					{path: 'webinars'},
					{path: 'juryOfTeams'},
					{path: 'manageTeams'},
					{path: 'teamId', populate: [{path: 'level1'}, {path: 'level2'}, {path: 'level3'}]},
				],
			})
			.populate({
				path: 'teams',
				populate: [{path: 'level1'}, {path: 'level2'}, {path: 'level3'}],
			})
			.populate('teamArborescence')
			.populate('availableRegions')
			.exec();
	}

	async findAll(light?: true): Promise<CompanyDb[]> {
		if (light) {
			return this.companyDb.find();
		}
		return this.companyDb
			.find()
			.populate({path: 'users', populate: 'teamId'})
			.populate('teams')
			.populate('teamArborescence')
			.populate('availableRegions')
			.exec();
	}

	async updateUserList(companyId: string, userId: string): Promise<UserDb[]> {
		const company = await this.companyDb.findById(companyId);
		company.users = company.users.filter((u) => !(u as UserDocument)._id.equals(userId));
		await company.save();
		return company.users;
	}

	async updateTeamList(id: string, idTeam: string) {
		const company = await this.companyDb.findById(id);
		company.teams = company.teams.filter((t) => !(t as TeamDocument)._id.equals(idTeam));
		await company.save();
		const companyDb = await this.findOne(id);
		return companyDb.teams;
	}

	async updateTeamArborescenceList(id: string, idTeamArborescence: string) {
		const company = await this.companyDb.findById(id);
		company.teamArborescence = company.teamArborescence.filter(
			(t) => !(t as TeamArborescenceDocument)._id.equals(idTeamArborescence),
		);
		await company.save();
		const companyDb = await this.findOne(id);
		return companyDb.teamArborescence;
	}
}
