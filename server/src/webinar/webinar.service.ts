import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {SaveWebinarDto} from './dto/save.webinar.dto';
import {WEBINAR_CTRL} from '../provider/routes.helper';
import {WebinarDb, WebinarDocument} from './entities/webinar.entity';

@Injectable()
export class WebinarService {
	constructor(
		@InjectModel(WEBINAR_CTRL)
		private readonly webinarDb: Model<WebinarDocument>,
	) {}

	async save(saveWebinarDto: SaveWebinarDto): Promise<WebinarDb> {
		if (saveWebinarDto._id) {
			await this.webinarDb.updateOne({_id: saveWebinarDto._id}, saveWebinarDto);
			return this.findOne(saveWebinarDto._id);
		}
		const webinarUpdated = new this.webinarDb(saveWebinarDto);
		return await (webinarUpdated as WebinarDocument).save();
	}

	async findOne(webinarId: string): Promise<WebinarDb> {
		return this.webinarDb.findById(webinarId).exec();
	}

	async findAll(): Promise<WebinarDb[]> {
		return this.webinarDb.find().exec();
	}
}
