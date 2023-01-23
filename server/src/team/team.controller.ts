import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {TeamService} from './team.service';
import {TeamDto} from './dto/team.dto';
import {SaveTeamDto} from './dto/save.team.dto';
import {CompanyService} from '../company/company.service';
import {ThemeDto} from '../incluscore/dto/theme.dto';
import {TeamDb, TeamDocument} from './entities/team.entity';
import {UserService} from '../user/service/user.service';
import {LaunchIncluscoreService} from '../incluscore/progression/launch.incluscore.service';
import {TEAM_CTRL} from '../provider/routes.helper';
import {NotationDeliveryDto} from '../inclukathon-program/models/dto/notation-delivery.dto';
import {DeliveryKthService} from '../inclukathon-program/delivery/delivery-kth.service';
import {SaveNotationDeliveryDto} from '../inclukathon-program/models/dto/creation/save.notation-delivery.dto';
import {TeamArborescenceDto} from '../company/dto/teamArborescence.dto';
import {SaveTeamArborescenceDto} from '../company/dto/saveTeamArborescence.dto';

@Controller(TEAM_CTRL)
export class TeamController {
	constructor(
		private readonly teamService: TeamService,
		private readonly companyService: CompanyService,
		private readonly userService: UserService,
		private readonly launchService: LaunchIncluscoreService,
		private readonly deliveryService: DeliveryKthService,
	) {}

	@Post('project-description')
	async saveProjectDescription(
		@Body('idTeam') idTeam: string,
		@Body('projectDescription') projectDescription: string,
	): Promise<TeamDto> {
		const team: TeamDb = await this.teamService.findOne(idTeam);
		team.projectDescription = projectDescription;
		await (team as TeamDocument).save();
		return new TeamDto(team);
	}

	@Post()
	async save(@Body() saveTeamDto: SaveTeamDto): Promise<TeamDto> {
		saveTeamDto._id = saveTeamDto.id;
		const isCreation = !saveTeamDto._id;
		const updatedTeamDb = await this.teamService.save(saveTeamDto);
		if (isCreation) {
			await this.companyService.addTeam(saveTeamDto.companyId, updatedTeamDb);
		}
		const populatedTeam = await this.teamService.findOne(updatedTeamDb._id);
		return new TeamDto(populatedTeam);
	}

	@Post('new-arborescence')
	async saveArborescence(@Body() saveTeamArborescenceDto: SaveTeamArborescenceDto): Promise<TeamArborescenceDto> {
		saveTeamArborescenceDto._id = saveTeamArborescenceDto.id;
		const isCreation = !saveTeamArborescenceDto._id;
		const updatedTeamArborescenceDb = await this.teamService.saveArborescence(saveTeamArborescenceDto);
		if (isCreation) {
			await this.companyService.addTeamArborescence(saveTeamArborescenceDto.companyId, updatedTeamArborescenceDb);
		}
		return new TeamArborescenceDto(updatedTeamArborescenceDb);
	}

	@Post('save-notation')
	async saveNotation(@Body() saveNotationDto: SaveNotationDeliveryDto): Promise<NotationDeliveryDto> {
		const team: TeamDb = await this.teamService.findOne(saveNotationDto.idTeam);
		const teamDelivery = team.teamDelivery.find((d) => saveNotationDto.idDelivery === d.delivery._id.toString());
		if (!teamDelivery.notation.find((n) => saveNotationDto.id === n._id.toString())) {
			// new notation, delete id so it can create a fresh instance
			saveNotationDto.idNotationEvaluated = saveNotationDto.id;
			delete saveNotationDto.id;
		}
		delete saveNotationDto.idTeam;
		delete saveNotationDto.idDelivery;
		saveNotationDto._id = saveNotationDto.id;
		const isCreation = !saveNotationDto._id;
		const updatedNotationDb = await this.deliveryService.saveNotationDelivery(saveNotationDto);
		if (isCreation) {
			await this.teamService.saveNotationForTeamDelivery(updatedNotationDb, teamDelivery);
		}
		return new NotationDeliveryDto(updatedNotationDb);
	}

	@Get('arborescence')
	async findAllArborescence(): Promise<TeamArborescenceDto[]> {
		const teamDbs = await this.teamService.findAllArborescence();
		return teamDbs.map((t) => new TeamArborescenceDto(t));
	}

	@Get('arborescence-available/:idCompany')
	async findAllArborescenceForTeamForm(@Param('idCompany') idCompany): Promise<TeamArborescenceDto[]> {
		const teamDbs = await this.companyService.findAllArborescenceForTeamForm(idCompany);
		return teamDbs.map((t) => new TeamArborescenceDto(t));
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<TeamDto> {
		const teamDb = await this.teamService.findOne(id);
		return new TeamDto(teamDb);
	}

	@Get('arborescence/:id')
	async findOneArborescence(@Param('id') id: string): Promise<TeamArborescenceDto> {
		const t = await this.teamService.findOneArborescence(id);
		return new TeamArborescenceDto(t);
	}

	@Get()
	async findAll(): Promise<TeamDto[]> {
		const teamDbs = await this.teamService.findAll();
		return teamDbs.map((t) => new TeamDto(t));
	}

	@Delete()
	async deleteOne(@Body('idTeam') idTeam: string, @Body('idCompany') idCompany: string): Promise<TeamDb[]> {
		const teams = await this.companyService.updateTeamList(idCompany, idTeam);
		await this.userService.removeTeamForAllUsers(idTeam);
		await this.teamService.deleteOne(idTeam);
		return teams.map((t) => new TeamDto(t));
	}

	@Delete('arborescence')
	async deleteOneArborescence(
		@Body('idTeamArborescence') idTeamArborescence: string,
		@Body('idCompany') idCompany: string,
	): Promise<TeamArborescenceDto[]> {
		const teams = await this.companyService.updateTeamArborescenceList(idCompany, idTeamArborescence);
		await this.teamService.deleteOneArborescence(idTeamArborescence);
		return teams.map((t) => new TeamArborescenceDto(t));
	}
}
