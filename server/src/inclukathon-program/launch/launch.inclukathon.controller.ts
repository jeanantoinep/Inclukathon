import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {LaunchInclukathonService} from './launch.inclukathon.service';
import {SaveLaunchInclukathonDto} from '../models/dto/creation/save.launch.inclukathon.dto';
import {LaunchInclukathonDto} from '../models/dto/launch.inclukathon.dto';
import {LAUNCH_KTH_CTRL} from '../../provider/routes.helper';
import {LaunchIncluscoreService} from '../../incluscore/progression/launch.incluscore.service';
import {SaveLaunchIncluscoreDto} from '../../incluscore/dto/creation/save.launch.incluscore.dto';
import {InclukathonProgramService} from '../inclukathon-program.service';
import {KthScrAssociationService} from '../kthScrAssociation/kth-scr-association.service';
import {SaveKthScrAssociationDto} from '../models/dto/creation/save.kth-scr-association';

@Controller(LAUNCH_KTH_CTRL)
export class LaunchKthController {
	constructor(
		private readonly launchKthService: LaunchInclukathonService,
		private readonly launchIncluscoreService: LaunchIncluscoreService,
		private readonly inclukathonProgramService: InclukathonProgramService,
		private readonly kthScrAssociationService: KthScrAssociationService,
	) {}

	@Post()
	async save(@Body() launch: SaveLaunchInclukathonDto): Promise<LaunchInclukathonDto[]> {
		launch._id = launch.id;
		await this.launchKthService.save(launch);
		const kth = await this.inclukathonProgramService.findOne(launch.idInclukathon);
		if (kth.kthScrAssociation) {
			for (const association of kth.kthScrAssociation) {
				const saveAssociationDto = {
					_id: association._id,
				} as SaveKthScrAssociationDto;
				saveAssociationDto.launchIncluscore = await this.launchIncluscoreService.save({
					...launch,
					idIncluscore: association?.incluscore?._id,
				} as SaveLaunchIncluscoreDto);
				await this.kthScrAssociationService.save(saveAssociationDto);
			}
		}
		const launches = await this.launchKthService.findAllByCompanyId(launch.idCompany);
		return launches.length > 0 ? launches.map((l) => new LaunchInclukathonDto(l)) : [];
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<LaunchInclukathonDto> {
		const launch = await this.launchKthService.findOne(id);
		return launch ? new LaunchInclukathonDto(launch) : null;
	}

	@Get('/company/:idCompany')
	async findAllByCompanyId(@Param('idCompany') idCompany: string): Promise<LaunchInclukathonDto[]> {
		const launches = await this.launchKthService.findAllByCompanyId(idCompany);
		return launches.length > 0 ? launches.map((l) => new LaunchInclukathonDto(l)) : [];
	}

	@Get()
	async findAll(): Promise<LaunchInclukathonDto[]> {
		const launches = await this.launchKthService.findAll();
		return launches.map((l) => new LaunchInclukathonDto(l));
	}

	@Delete()
	async deleteOne(@Body('id') id: string, @Body('idCompany') idCompany: string) {
		const companyLaunches = await this.launchKthService.deleteOne(id, idCompany);
		return companyLaunches.map((l) => new LaunchInclukathonDto(l));
	}
}
