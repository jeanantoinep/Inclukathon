import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {LaunchIncluscoreDto} from '../dto/launch.incluscore.dto';
import {LaunchIncluscoreService} from './launch.incluscore.service';
import {SaveLaunchIncluscoreDto} from '../dto/creation/save.launch.incluscore.dto';
import {LAUNCH_SCR_CTRL} from '../../provider/routes.helper';
import {LaunchIncluscoreDb} from '../entities/launch.incluscore.entity';
import {IncluscoreDb} from '../entities/incluscore.entity';
import {LScrStatService, StatsMainObject} from './launch.incluscore.stats.service';
import {BasicFacetStatsDto} from '../dto/basic.facet.stats.dto';
import {UserThemeService} from './userTheme.service';
import {TeamDb} from '../../team/entities/team.entity';
import {TeamService} from '../../team/team.service';
import {TeamDto} from '../../team/dto/team.dto';
import {CompanyDb} from '../../company/entities/company.entity';

@Controller(LAUNCH_SCR_CTRL)
export class LaunchScrController {
	constructor(
		private readonly launchScrService: LaunchIncluscoreService,
		private readonly userThemeService: UserThemeService,
		private readonly launchIncluscoreStatsService: LScrStatService,
		private readonly teamService: TeamService,
	) {}

	@Post()
	async save(@Body() launch: SaveLaunchIncluscoreDto): Promise<LaunchIncluscoreDto[]> {
		launch._id = launch.id;
		await this.launchScrService.save(launch);
		const launches = await this.launchScrService.findAllByCompanyId(launch.idCompany);
		return launches.map((l) => new LaunchIncluscoreDto(l));
	}

	@Get(':id')
	async findLaunchForIncluscoreApp(
		@Param('id') id: string,
		@Query('current-user-id') currentUserId: string,
	): Promise<LaunchIncluscoreDto> {
		const launch: LaunchIncluscoreDb = await this.launchScrService.findOneLight(id, currentUserId);
		if (!launch || !launch?.idIncluscore?.enabled) {
			return null;
		}
		const company: CompanyDb = launch.idCompany;
		if (company.teamArborescence) {
			company.teamArborescence = company.teamArborescence.filter((ta) => {
				return company.teams.find(
					(team) =>
						(team as TeamDb).level1?._id?.toString('hex') === ta.id?.toString('hex') ||
						(team as TeamDb).level2?._id?.toString('hex') === ta.id?.toString('hex') ||
						(team as TeamDb).level3?._id?.toString('hex') === ta.id?.toString('hex'),
				);
			});
		}
		return new LaunchIncluscoreDto(launch);
	}

	@Get('/company/:idCompany')
	async findAllForAdminCompanyEditionPage(@Param('idCompany') idCompany: string): Promise<LaunchIncluscoreDto[]> {
		const launches: LaunchIncluscoreDb[] = await this.launchScrService.findAllForAdminCompanyEditionPage(idCompany);
		const launchesDto = launches.map((l) => new LaunchIncluscoreDto(l));
		for (const launchDto of launchesDto) {
			if (!launchDto.userThemes?.length) {
				launchDto.userThemes = await this.userThemeService.findByLaunchId(launchDto.id);
			}
		}
		return launchesDto;
	}

	@Get('/single-launch-scr-stats/:idLaunch')
	async findStatsForLaunchStatPage(@Param('idLaunch') idLaunch: string): Promise<BasicFacetStatsDto> {
		const launch: LaunchIncluscoreDb = await this.launchScrService.findForStats(idLaunch, {idIncluscore: 1});
		const stat: StatsMainObject = await this.launchIncluscoreStatsService.getAdminCompanyIncluscoresStats(launch);
		return {
			stat: stat,
			launch: new LaunchIncluscoreDto(launch),
		} as BasicFacetStatsDto;
	}

	@Get('/single-team-scr-stats/:idLaunch')
	async findStatsForSingleTeamStatPage(
		@Param('idLaunch') idLaunch: string,
		@Query('idTeam') idTeam: string,
	): Promise<BasicFacetStatsDto> {
		const launch: LaunchIncluscoreDb = await this.launchScrService.findForStats(idLaunch, {idIncluscore: 1});
		const teamDb: TeamDb = await this.teamService.findOne(idTeam);
		const stat: StatsMainObject = await this.launchIncluscoreStatsService.getAdminCompanyIncluscoresStats(
			launch,
			idTeam,
		);
		return {
			stat,
			team: new TeamDto(teamDb),
			launch: new LaunchIncluscoreDto(launch),
		} as BasicFacetStatsDto;
	}

	@Get()
	async findAll(): Promise<LaunchIncluscoreDto[]> {
		const launches = await this.launchScrService.findAll();
		return launches.map((l) => new LaunchIncluscoreDto(l));
	}

	@Delete()
	async deleteOne(@Body('id') id: string, @Body('idCompany') idCompany: string) {
		const companyLaunches = await this.launchScrService.deleteOne(id, idCompany);
		return companyLaunches.map((l) => new LaunchIncluscoreDto(l));
	}

	// remove only duplicate, keep userTheme with more answers when found 2 of them
	// remove duplicate theme, answer and userTheme saved in launch
	@Get('/fix-duplicate/:id')
	async fixDuplicate(): Promise<string> {
		await this.launchScrService.fixDuplicate();
		console.debug('finished');
		return 'finished ' + Date.now().toString();
	}
}
