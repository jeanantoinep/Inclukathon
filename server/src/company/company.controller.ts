import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CompanyDto} from './dto/company.dto';
import {SaveCompanyDto} from './dto/save.company.dto';
import {COMPANY_CTRL} from '../provider/routes.helper';
import {AvailableRegionDto} from './dto/availableRegion.dto';
import {SaveAvailableRegionDto} from './dto/saveAvailableRegion.dto';

@Controller(COMPANY_CTRL)
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post('available-region')
	async saveArborescence(@Body() saveAvailableRegionDto: SaveAvailableRegionDto): Promise<AvailableRegionDto> {
		saveAvailableRegionDto._id = saveAvailableRegionDto.id;
		const isCreation = !saveAvailableRegionDto._id;
		const updatedRegionDb = await this.companyService.saveAvailableRegion(saveAvailableRegionDto);
		if (isCreation) {
			await this.companyService.addAvailableRegion(saveAvailableRegionDto.companyId, updatedRegionDb);
		}
		return new AvailableRegionDto(updatedRegionDb);
	}

	@Post()
	async save(@Body() saveCompanyDto: SaveCompanyDto): Promise<CompanyDto> {
		saveCompanyDto._id = saveCompanyDto.id;
		delete saveCompanyDto.teams;
		delete saveCompanyDto.teamArborescence;
		delete saveCompanyDto.availableRegions;
		delete saveCompanyDto.users;
		delete saveCompanyDto.imgPath;
		const saveCompanyDb = await this.companyService.save(saveCompanyDto);
		const companyPopulatedDb = await this.companyService.findOne(saveCompanyDb._id);
		return new CompanyDto(companyPopulatedDb);
	}

	@Get('light')
	async findAllLight(): Promise<CompanyDto[]> {
		const companyDbs = await this.companyService.findAll(true);
		return companyDbs?.map((c) => new CompanyDto(c));
	}

	@Get(':id')
	async findOne(@Param('id') companyId: string): Promise<CompanyDto> {
		const companyDb = await this.companyService.findOne(companyId);
		return new CompanyDto(companyDb);
	}

	@Get()
	async findAll(): Promise<CompanyDto[]> {
		const companyDbs = await this.companyService.findAll();
		return companyDbs?.map((c) => new CompanyDto(c));
	}

	@Delete('available-region')
	async deleteOneAvailableRegion(
		@Body('idAvailableRegion') idAvailableRegion: string,
		@Body('idCompany') idCompany: string,
	): Promise<AvailableRegionDto[]> {
		const teams = await this.companyService.updateAvailableRegionList(idCompany, idAvailableRegion);
		await this.companyService.deleteOneAvailableRegion(idAvailableRegion);
		return teams.map((t) => new AvailableRegionDto(t));
	}
}
