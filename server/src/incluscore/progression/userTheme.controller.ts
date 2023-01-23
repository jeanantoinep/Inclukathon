import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserThemeService} from './userTheme.service';
import {UserThemeDto} from '../dto/user-theme.dto';
import {SaveUserThemeDto} from '../dto/creation/save.user-theme.dto';
import {LaunchIncluscoreService} from './launch.incluscore.service';
import {USER_THEME_SCR_CTRL} from '../../provider/routes.helper';

@Controller(USER_THEME_SCR_CTRL)
export class UserThemeController {
	constructor(
		private readonly userThemeService: UserThemeService,
		private readonly launchService: LaunchIncluscoreService,
	) {}

	@Post()
	async save(@Body() update: SaveUserThemeDto) {
		update._id = update.id;
		const updatedUserTheme = await this.userThemeService.saveUserAnswerAndUserTheme(update);
		await this.launchService.addUserThemeIfNotExist(updatedUserTheme);
		return new UserThemeDto(updatedUserTheme);
	}

	@Get('populate-ut')
	async populateUt() {
		this.userThemeService.populateUT().then();
	}

	@Get()
	async findAll(): Promise<UserThemeDto[]> {
		return await this.userThemeService.findAll();
	}

	@Get('user/:id')
	async findByUserId(@Param('id') userId: string): Promise<UserThemeDto[]> {
		return await this.userThemeService.findByUserId(userId);
	}

	@Delete(':id')
	async deleteOne(@Param('id') id: string): Promise<UserThemeDto[]> {
		return await this.userThemeService.deleteOne(id);
	}
}
