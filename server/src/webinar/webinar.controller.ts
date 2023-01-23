import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {WebinarService} from './webinar.service';
import {WebinarDto} from './dto/webinar.dto';
import {SaveWebinarDto} from './dto/save.webinar.dto';
import {WEBINAR_CTRL} from '../provider/routes.helper';
import {UserService} from '../user/service/user.service';
import {CompanyService} from '../company/company.service';

@Controller(WEBINAR_CTRL)
export class WebinarController {
	constructor(
		private readonly webinarService: WebinarService,
		private readonly userService: UserService,
		private readonly companyService: CompanyService,
	) {}

	@Post('seen')
	async seen(@Body() seenWebinar: any) {
		const {idWebinar, idUser} = seenWebinar;
		await this.userService.saveWebinarSeen(idWebinar, idUser);
	}

	@Post()
	async save(@Body() saveWebinarDto: SaveWebinarDto): Promise<WebinarDto> {
		saveWebinarDto._id = saveWebinarDto.id;
		delete saveWebinarDto.path;
		delete saveWebinarDto.company;
		saveWebinarDto.company = await this.companyService.findOne(saveWebinarDto.companyId);
		const saveWebinarDb = await this.webinarService.save(saveWebinarDto);
		const webinarPopulatedDb = await this.webinarService.findOne(saveWebinarDb._id);
		return new WebinarDto(webinarPopulatedDb);
	}

	@Get('home/:id')
	async findOneForFront(@Param('id') webinarId: string): Promise<WebinarDto> {
		const webinarDb = await this.webinarService.findOne(webinarId);
		const dto = new WebinarDto(webinarDb);
		if (dto.enabled && dto.isInProgress) {
			return dto;
		}
		return null;
	}

	@Get(':id')
	async findOne(@Param('id') webinarId: string): Promise<WebinarDto> {
		const webinarDb = await this.webinarService.findOne(webinarId);
		return new WebinarDto(webinarDb);
	}

	@Get()
	async findAll(): Promise<WebinarDto[]> {
		const webinarDbs = await this.webinarService.findAll();
		return webinarDbs?.map((c) => new WebinarDto(c));
	}
}
