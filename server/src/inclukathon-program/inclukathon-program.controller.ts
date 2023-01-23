import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {InclukathonProgramService} from './inclukathon-program.service';
import {InclukathonDto} from './models/dto/inclukathon.dto';
import {SaveInclukathonDto} from './models/dto/creation/save.inclukathon.dto';
import {SaveBaiDto} from './models/dto/creation/save.bai.dto';
import {BaiDto} from './models/dto/bai.dto';
import {BaiKthService} from './bai/bai-kth.service';
import {KthScrAssociationDto} from './models/dto/kth-scr-association.dto';
import {KthScrAssociationService} from './kthScrAssociation/kth-scr-association.service';
import {SaveKthScrAssociationDto} from './models/dto/creation/save.kth-scr-association';
import {DeliveryKthService} from './delivery/delivery-kth.service';
import {DeliveriesDto} from './models/dto/deliveries.dto';
import {INCLUKATHON_CTRL} from '../provider/routes.helper';
import {SaveDeliveriesDto} from './models/dto/creation/save.deliveries.dto';
import {SaveNotationDeliveryDto} from './models/dto/creation/save.notation-delivery.dto';
import {NotationDeliveryDto} from './models/dto/notation-delivery.dto';

@Controller(INCLUKATHON_CTRL)
export class InclukathonProgramController {
	constructor(
		private readonly inclukathonProgramService: InclukathonProgramService,
		private readonly baiProgramService: BaiKthService,
		private readonly kthScrAssociationService: KthScrAssociationService,
		private readonly deliveryKthService: DeliveryKthService,
	) {}

	@Get('for-company-association')
	async findForCompanyAssociations(): Promise<InclukathonDto[]> {
		const incluscores = await this.inclukathonProgramService.findAll(true);
		return incluscores.map((i) => new InclukathonDto(i));
	}

	@Post('delivery')
	async saveDelivery(@Body() delivery: SaveDeliveriesDto): Promise<DeliveriesDto> {
		delivery._id = delivery.id;
		delete delivery.notation;
		const isCreation = !delivery._id;
		const deliveryDb = await this.deliveryKthService.save(delivery);
		if (isCreation) {
			await this.inclukathonProgramService.saveDeliveryToKth(delivery.idKth, deliveryDb);
		}
		return new DeliveriesDto(deliveryDb);
	}

	@Post('notation')
	async saveNotationDelivery(@Body() notationToSaveDto: SaveNotationDeliveryDto): Promise<NotationDeliveryDto> {
		notationToSaveDto._id = notationToSaveDto.id;
		const isCreation = !notationToSaveDto._id;
		const notationDeliveryDb = await this.deliveryKthService.saveNotationDelivery(notationToSaveDto);
		if (isCreation) {
			await this.deliveryKthService.pushNewNotationToDelivery(notationToSaveDto.idDelivery, notationDeliveryDb);
		}
		return new NotationDeliveryDto(notationDeliveryDb);
	}

	@Post('bai')
	async saveBai(@Body() bai: SaveBaiDto): Promise<BaiDto> {
		bai._id = bai.id;
		delete bai.imgCoverPath;
		delete bai.filesPath;
		const isCreation = !bai._id;
		const baiDb = await this.baiProgramService.save(bai);
		if (isCreation) {
			await this.inclukathonProgramService.saveBaiToKth(bai.idKth, baiDb);
		}
		return new BaiDto(baiDb);
	}

	@Post('kth-scr-association')
	async saveKthScrAssociation(@Body() kthScrAssociation: SaveKthScrAssociationDto): Promise<KthScrAssociationDto> {
		delete kthScrAssociation.launchIncluscore; // create when
		kthScrAssociation._id = kthScrAssociation.id;
		const isCreation = !kthScrAssociation._id;
		const kthScrAssociationDb = await this.kthScrAssociationService.save(kthScrAssociation);
		if (isCreation) {
			await this.inclukathonProgramService.saveKthScrAssociationToKth(
				kthScrAssociation.idKth,
				kthScrAssociationDb,
			);
		}
		return new KthScrAssociationDto(kthScrAssociationDb);
	}

	@Post()
	async save(@Body() inclukathon: SaveInclukathonDto): Promise<InclukathonDto> {
		inclukathon._id = inclukathon.id;
		delete inclukathon.bai;
		delete inclukathon.kthScrAssociation;
		delete inclukathon.deliveries;
		delete inclukathon.bannerImgPath;
		delete inclukathon.programImgPath;
		const inclukathonDb = await this.inclukathonProgramService.save(inclukathon);
		return new InclukathonDto(inclukathonDb);
	}

	@Get('kth-scr-association/:id')
	async findOneScrAssociation(@Param('id') idKthScr: string): Promise<KthScrAssociationDto> {
		const scr = await this.kthScrAssociationService.findOne(idKthScr);
		return new KthScrAssociationDto(scr);
	}

	@Get('bai/:id')
	async findOneBai(@Param('id') idBai: string): Promise<BaiDto> {
		const bai = await this.baiProgramService.findOne(idBai);
		return new BaiDto(bai);
	}

	@Get('delivery/:id')
	async findOneDelivery(@Param('id') idDelivery: string): Promise<DeliveriesDto> {
		const delivery = await this.deliveryKthService.findOne(idDelivery);
		return new DeliveriesDto(delivery);
	}

	@Get(':id')
	async findOne(@Param('id') idInclukathon: string): Promise<InclukathonDto> {
		const incluscore = await this.inclukathonProgramService.findOne(idInclukathon);
		return new InclukathonDto(incluscore);
	}

	@Get()
	async findAll(): Promise<InclukathonDto[]> {
		const incluscores = await this.inclukathonProgramService.findAll();
		return incluscores.map((i) => new InclukathonDto(i));
	}

	@Delete()
	async deleteOne(@Body('idInclukathon') idInclukathon: string): Promise<InclukathonDto[]> {
		await this.inclukathonProgramService.deleteOne(idInclukathon);
		const inclukathons = await this.inclukathonProgramService.findAll();
		return inclukathons.map((inclukathonDb) => new InclukathonDto(inclukathonDb));
	}
}
