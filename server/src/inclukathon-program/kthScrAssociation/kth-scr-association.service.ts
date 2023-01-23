import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {KTH_SCR_ASSOCIATION_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {
	KthScrAssociationDb,
	KthScrAssociationDocument,
} from '../models/kth-scr-association.entity';
import {SaveKthScrAssociationDto} from '../models/dto/creation/save.kth-scr-association';

@Injectable()
export class KthScrAssociationService {
	constructor(
		@InjectModel(KTH_SCR_ASSOCIATION_COLLECTION_NAME)
		private readonly kthScrDb: Model<KthScrAssociationDocument>,
	) {}

	async save(update: SaveKthScrAssociationDto): Promise<KthScrAssociationDb> {
		if (update._id) {
			await this.kthScrDb.updateOne(
				{_id: update._id},
				update as KthScrAssociationDb,
			);
			return this.findOne(update._id);
		}
		const kthScr = new this.kthScrDb(update);
		return await (kthScr as KthScrAssociationDocument).save();
	}

	async findOne(id: string): Promise<KthScrAssociationDb> {
		return this.kthScrDb.findById(id);
	}

	async findAll(): Promise<KthScrAssociationDb[]> {
		return this.kthScrDb.find();
	}

	async deleteOne(id: string) {
		await this.kthScrDb.findByIdAndDelete(id);
	}
}
