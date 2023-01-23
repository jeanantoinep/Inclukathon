import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ThemeIncluscoreService} from './theme.service';
import {ThemeDto} from '../dto/theme.dto';
import {IncluscoreService} from '../incluscore.service';
import {SaveThemeDto} from '../dto/creation/save.theme.dto';
import {THEME_SCR_CTRL} from '../../provider/routes.helper';

@Controller(THEME_SCR_CTRL)
export class ThemeController {
	constructor(
		private readonly themeService: ThemeIncluscoreService,
		private readonly incluscoreService: IncluscoreService,
	) {}

	@Post()
	async save(@Body() t: SaveThemeDto): Promise<ThemeDto> {
		t._id = t.id;
		const isCreation = !t._id;
		delete t.questions;
		delete t.imgPath;
		const theme = await this.themeService.save(t);
		if (isCreation) {
			await this.incluscoreService.addTheme(t.incluscoreId, theme);
		}
		return new ThemeDto(theme);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ThemeDto> {
		const themeDb = await this.themeService.findOne(id);
		return new ThemeDto(themeDb);
	}

	@Get()
	async findAll(): Promise<ThemeDto[]> {
		return this.themeService.find();
	}

	@Delete()
	async deleteOne(
		@Body('idTheme') idTheme: string,
		@Body('idIncluscore') idIncluscore: string,
	): Promise<ThemeDto[]> {
		await this.incluscoreService.removeIdThemeFromIncluscore(
			idIncluscore,
			idTheme,
		);
		await this.themeService.deleteOne(idTheme);
		const incluscore = await this.incluscoreService.findOne(idIncluscore);
		return incluscore.themes.map((t) => new ThemeDto(t));
	}
}
