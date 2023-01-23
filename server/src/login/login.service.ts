import {Injectable} from '@nestjs/common';
import {LOGIN_TOKENS_COLLECTION_NAME, USER_COLLECTION_NAME} from '../provider/collections.provider';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {LoginDb, LoginDocument} from './entities/login.entity';
import {UserDb, UserDocument} from '../user/entity/user.entity';
import {ConnectDto} from './dto/connect.dto';
import {CreateLoginDto} from './dto/create-login.dto';
import {DateTime} from 'luxon';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class LoginService {
	constructor(
		@InjectModel(USER_COLLECTION_NAME)
		private readonly userDb: Model<UserDocument>,
		@InjectModel(LOGIN_TOKENS_COLLECTION_NAME)
		private readonly loginDb: Model<LoginDocument>,
	) {}

	static readonly SALT = 10;

	async checkConnexion(userId: string, token: string): Promise<boolean> {
		return null != (await this.loginDb.findOne({userId, token}));
	}

	// todo add interface in case of error
	async getAuthenticatedUser(
		connectDto: ConnectDto,
		saveNewPwd = false,
	): Promise<UserDb | {error: boolean; reason: string}> {
		connectDto.email = connectDto.email.toLowerCase();
		const userVerification = await this.userDb.findOne({email: connectDto.email, enabled: true}).exec();
		if (!userVerification) {
			return {
				error: true,
				reason: 'Aucun utilisateur ne correspond a cet email',
			};
		}
		if (userVerification.hasAPassword) {
			const match = await bcrypt.compare(connectDto.pwd, userVerification.pwd);
			if (!match) {
				return {
					error: true,
					reason: 'Veuillez verifier votre adresse mail et votre mot de passe',
				};
			}
		} else if (saveNewPwd) {
			userVerification.pwd = await bcrypt.hash(connectDto.pwd, LoginService.SALT);
			userVerification.hasAPassword = true;
			await userVerification.save();
		}
		return userVerification;
	}

	async connect(connectDto: ConnectDto): Promise<LoginDb | {error: boolean; reason: string}> {
		const userVerification = await this.getAuthenticatedUser(connectDto, true);
		if ((userVerification as any).error) {
			return userVerification as {error: boolean; reason: string};
		}
		const newLoginTokenDto = new CreateLoginDto();
		newLoginTokenDto.userId = (userVerification as UserDb)._id;
		newLoginTokenDto.token = await bcrypt.hash(DateTime.now().toSeconds().toString(), LoginService.SALT);
		const loginToken = new this.loginDb(newLoginTokenDto);
		await loginToken.save();
		return loginToken;
	}

	async deleteTokenOfUser(idUser: string) {
		await this.loginDb.deleteMany({userId: idUser});
	}
}
