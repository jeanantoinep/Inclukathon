import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserDto} from '../dto/user.dto';
import {UserService} from '../service/user.service';
import {SaveUserDto} from '../dto/save.user.dto';
import {CompanyService} from '../../company/company.service';
import {LoginService} from '../../login/login.service';
import {ConnectDto} from '../../login/dto/connect.dto';
import {HAS_A_CHOSEN_PASSWORD_ENDPOINT, USER_CTRL} from '../../provider/routes.helper';
import {LoggedUserDto} from '../dto/logged.user.dto';
import {LoginDb} from '../../login/entities/login.entity';
import {ILang} from '../../translations/LangUtils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Controller(USER_CTRL)
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly companyService: CompanyService,
		private readonly loginService: LoginService,
	) {}

	@Post()
	async save(@Body() saveUserDto: SaveUserDto): Promise<LoggedUserDto | {error: boolean; reason: string}> {
		saveUserDto._id = saveUserDto.id;
		saveUserDto.email = saveUserDto.email.toLowerCase();
		if (!saveUserDto.id && !saveUserDto.pwd) {
			saveUserDto.hasAPassword = false;
			const tmpHashedPwd = await bcrypt.hash('qÏé5kQ5', LoginService.SALT);
			saveUserDto.pwd = tmpHashedPwd + new Date().getTime();
		}
		delete saveUserDto.avatarImgPath;
		delete saveUserDto.presentationVideoPath;
		delete saveUserDto.juryOfTeams;
		delete saveUserDto.manageTeams;
		const isCreation = !saveUserDto._id;
		const companyId = saveUserDto.companyId;
		if (!isCreation) {
			const updatedUserDb = await this.userService.save(saveUserDto);
			return new UserDto(updatedUserDb);
		}
		const existingUser = await this.userService.findByEmail(saveUserDto.email);
		if (!existingUser) {
			const newUserDb = await this.userService.save(saveUserDto);
			await this.companyService.addUser(companyId, newUserDb);
		}
		// todo redirect before connexion if its not account page
		// because this part is when a user update is own profil
		const userTry = {
			email: saveUserDto.email,
			pwd: saveUserDto.pwd,
		} as ConnectDto;
		const userTried = await this.loginService.getAuthenticatedUser(userTry);
		if ((userTried as any).error) {
			return userTried as any;
		}
		const loginDb = await this.loginService.connect(userTry);
		if ((loginDb as any).error) {
			return loginDb;
		}
		const loginUser = loginDb as LoginDb;
		const userDb = await this.userService.findOne(loginUser.userId);
		const userDto = new UserDto(userDb, loginUser.token);
		return userDto as LoggedUserDto;
	}

	@Post('set-lang')
	async setLang(@Body('userId') userId: string, @Body('lang') lang: ILang) {
		await this.userService.setLang(userId, lang);
	}

	@Post('add-jury')
	async addJury(@Body('userId') userId: string, @Body('teamId') teamId: string) {
		const user = await this.userService.findOne(userId);
		if (!user) {
			return null;
		}
		user.juryOfTeams = user.juryOfTeams.push(teamId);
		return await this.userService.save(user);
	}

	@Post('add-manager')
	async addManager(@Body('userId') userId: string, @Body('teamId') teamId: string) {
		const user = await this.userService.findOne(userId);
		if (!user) {
			return null;
		}
		user.manageTeams = user.manageTeams.push(teamId);
		return await this.userService.save(user);
	}

	@Get('/migration-teams')
	async migrateTeams() {
		this.userService.teamsIdsToTeam().then();
	}

	@Get(`/${HAS_A_CHOSEN_PASSWORD_ENDPOINT}/:email`)
	async hasAChosenPassword(@Param('email') email: string): Promise<UserDto> {
		const userDb = await this.userService.findByEmail(email);
		return !userDb ? null : new UserDto(userDb);
	}

	@Get()
	async findAll(): Promise<UserDto[]> {
		const usersDbs = await this.userService.findAll();
		return usersDbs.map((u) => new UserDto(u));
	}

	@Delete()
	async deleteAndCleanRefs(@Body('userId') id: string): Promise<UserDto[]> {
		const uDbs = await this.userService.deleteAndCleanRefs(id);
		return uDbs.map((u) => new UserDto(u));
	}

	@Delete('remove-jury')
	async removeJury(@Body('userId') userId: string, @Body('teamId') teamId: string) {
		const user = await this.userService.findOne(userId);
		if (!user) {
			return null;
		}
		user.juryOfTeams = user.juryOfTeams.filter((team) => teamId !== team.id.toString('hex'));
		return await this.userService.save(user);
	}

	@Delete('remove-manager')
	async removeManager(@Body('userId') userId: string, @Body('teamId') teamId: string) {
		const user = await this.userService.findOne(userId);
		if (!user) {
			return null;
		}
		user.manageTeams = user.manageTeams.filter((team) => teamId !== team.id.toString('hex'));
		return await this.userService.save(user);
	}

	@Post('/nps')
	async updateNps(
		@Body('current-user-id') userId: string,
		@Body('notation') notation: number,
		@Body('comment') comment: string,
		@Body('step') step: number,
	) {
		if (step === 1) {
			return this.userService.updateNpsNotation(userId, notation);
		}
		return this.userService.updateNpsComment(userId, comment);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<UserDto> {
		const userDb = await this.userService.findOne(id);
		return new UserDto(userDb);
	}
}
