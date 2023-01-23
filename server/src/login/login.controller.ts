import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {ConnectDto} from './dto/connect.dto';
import {LoginService} from './login.service';
import {LoggedUserDto} from '../user/dto/logged.user.dto';
import {LaunchInclukathonService} from '../inclukathon-program/launch/launch.inclukathon.service';
import {UserService} from '../user/service/user.service';
import {UserDto} from '../user/dto/user.dto';
import {CONNECT_LOGIN_ENDPOINT, LOGIN_CTRL} from '../provider/routes.helper';
import {LoginDb} from './entities/login.entity';

@Controller(LOGIN_CTRL)
export class LoginController {
	constructor(
		private readonly loginService: LoginService,
		private readonly launchInclukathonService: LaunchInclukathonService,
		private readonly userService: UserService,
	) {}

	@Get()
	async checkConnexion(
		@Query('current-user-id') userId: string,
		@Query('token') token: string,
		@Query('very-light-user') isVeryLightUserQuery: boolean,
	): Promise<LoggedUserDto | null> {
		if (!(await this.loginService.checkConnexion(userId, token))) {
			return null;
		}
		const userDb = await this.userService.findOne(userId, isVeryLightUserQuery);
		const userDto = new UserDto(userDb, token);
		return {
			...userDto,
			currentInclukathon: isVeryLightUserQuery
				? {}
				: await this.launchInclukathonService.retrieveLastInProgressInclukathon(userDto),
			teamsToManage: isVeryLightUserQuery ? {} : await this.userService.getTeamsToManage(userDto),
		} as LoggedUserDto;
	}

	@Post(CONNECT_LOGIN_ENDPOINT)
	async connect(@Body() connectDto: ConnectDto): Promise<LoggedUserDto | {error: boolean; reason: string}> {
		const loginDb = await this.loginService.connect(connectDto);
		if ((loginDb as any).error) {
			return loginDb;
		}
		const loginUser = loginDb as LoginDb;
		const userDb = await this.userService.findOne(loginUser.userId);
		const userDto = new UserDto(userDb, loginUser.token);
		return {
			...userDto,
			currentInclukathon: await this.launchInclukathonService.retrieveLastInProgressInclukathon(userDto),
			teamsToManage: await this.userService.getTeamsToManage(userDto),
		} as LoggedUserDto;
	}
}
