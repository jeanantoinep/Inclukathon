import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
	DELIVERIES_COLLECTION_NAME,
	INCLUKATHON_PROGRAM_COLLECTION_NAME,
	KTH_SCR_ASSOCIATION_COLLECTION_NAME,
} from '../provider/collections.provider';
import {Model} from 'mongoose';
import {InclukathonProgramDb, InclukathonProgramDocument} from './models/inclukathon-program.entity';
import {KthScrAssociationDb, KthScrAssociationDocument} from './models/kth-scr-association.entity';
import {DeliveriesDb, DeliveriesDocument} from './models/deliveries.entity';
import {SaveInclukathonDto} from './models/dto/creation/save.inclukathon.dto';
import {BaiKthService} from './bai/bai-kth.service';
import {BaiDto} from './models/dto/bai.dto';
import {SaveBaiDto} from './models/dto/creation/save.bai.dto';
import {BaiDb} from './models/bai.entity';
import {DeliveriesDto} from './models/dto/deliveries.dto';

@Injectable()
export class InclukathonProgramService {
	constructor(
		@InjectModel(INCLUKATHON_PROGRAM_COLLECTION_NAME)
		private readonly inclukathonDb: Model<InclukathonProgramDocument>,
		@InjectModel(KTH_SCR_ASSOCIATION_COLLECTION_NAME)
		private readonly kthScrAssociationDb: Model<KthScrAssociationDocument>,
		@InjectModel(DELIVERIES_COLLECTION_NAME)
		private readonly deliveriesDb: Model<DeliveriesDocument>,
		private readonly baiKthService: BaiKthService,
	) {}

	async save(update: SaveInclukathonDto): Promise<InclukathonProgramDb> {
		if (update._id) {
			await this.inclukathonDb.updateOne({_id: update._id}, update as InclukathonProgramDb);
			return this.findOne(update._id);
		}
		const newInclukathon = new this.inclukathonDb(update);
		return await (newInclukathon as InclukathonProgramDocument).save();
	}

	async saveBaiToKth(id: string, bai: BaiDb) {
		const kth = await this.findOne(id);
		kth.bai.push(bai);
		return await (kth as InclukathonProgramDocument).save();
	}

	async saveDeliveryToKth(id: string, delivery: DeliveriesDb) {
		const kth = await this.findOne(id);
		kth.deliveries.push(delivery);
		return await (kth as InclukathonProgramDocument).save();
	}

	async saveKthScrAssociationToKth(id: string, kthScrAssociation: KthScrAssociationDb) {
		const kth = await this.findOne(id);
		kth.kthScrAssociation.push(kthScrAssociation);
		return await (kth as InclukathonProgramDocument).save();
	}

	async findOne(id: string): Promise<InclukathonProgramDb> {
		return this.inclukathonDb
			.findById(id)
			.populate('bai')
			.populate({path: 'kthScrAssociation', populate: 'incluscore'})
			.populate({path: 'deliveries', populate: 'notation'});
	}

	async findAll(light = false): Promise<InclukathonProgramDb[]> {
		if (light) {
			return this.inclukathonDb.find({}, {_id: 1, name: 1});
		}
		return this.inclukathonDb
			.find()
			.populate('bai')
			.populate({path: 'kthScrAssociation', populate: 'incluscore'})
			.populate({path: 'deliveries', populate: 'notation'});
	}

	async deleteOne(id: string) {
		const inclukathon = await this.findOne(id);
		for (const b of inclukathon.bai) {
			await this.baiKthService.deleteOne(b._id);
		}
		for (const k of inclukathon.kthScrAssociation) {
			await this.kthScrAssociationDb.findByIdAndDelete(k._id);
		}
		for (const d of inclukathon.deliveries) {
			await this.deliveriesDb.findByIdAndDelete(d._id);
		}
		await this.inclukathonDb.findByIdAndDelete(id);
	}
}
