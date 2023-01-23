import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {BAI_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {BaiDb, BaiDocument} from '../models/bai.entity';
import {SaveBaiDto} from '../models/dto/creation/save.bai.dto';

@Injectable()
export class BaiKthService {
	constructor(
		@InjectModel(BAI_COLLECTION_NAME)
		private readonly baiDb: Model<BaiDocument>,
	) {}

	async save(update: SaveBaiDto): Promise<BaiDb> {
		if (update._id) {
			await this.baiDb.updateOne({_id: update._id}, update as BaiDb);
			return this.findOne(update._id);
		}
		const bai = new this.baiDb(update);
		return await (bai as BaiDocument).save();
	}

	async findOne(id: string): Promise<BaiDb> {
		return this.baiDb.findById(id);
	}

	async findAll(): Promise<BaiDb[]> {
		return this.baiDb.find();
	}

	async deleteOne(id: string) {
		await this.baiDb.findByIdAndDelete(id);
	}
}
