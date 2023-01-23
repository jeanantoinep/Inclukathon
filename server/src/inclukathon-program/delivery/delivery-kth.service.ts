import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {DELIVERIES_COLLECTION_NAME, NOTATION_DELIVERY_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {DeliveriesDb, DeliveriesDocument} from '../models/deliveries.entity';
import {SaveDeliveriesDto} from '../models/dto/creation/save.deliveries.dto';
import {SaveNotationDeliveryDto} from '../models/dto/creation/save.notation-delivery.dto';
import {NotationDeliveryDb, NotationDeliveryDocument} from '../models/notation-delivery.entity';

@Injectable()
export class DeliveryKthService {
	constructor(
		@InjectModel(DELIVERIES_COLLECTION_NAME)
		private readonly deliveryDb: Model<DeliveriesDocument>,
		@InjectModel(NOTATION_DELIVERY_COLLECTION_NAME)
		private readonly notationDeliveryDb: Model<NotationDeliveryDocument>,
	) {}

	async save(update: SaveDeliveriesDto): Promise<DeliveriesDb> {
		if (update._id) {
			await this.deliveryDb.updateOne({_id: update._id}, update as DeliveriesDb);
			return this.findOne(update._id);
		}
		const delivery = new this.deliveryDb(update);
		return await (delivery as DeliveriesDocument).save();
	}

	async saveNotationDelivery(update: SaveNotationDeliveryDto): Promise<NotationDeliveryDb> {
		if (update._id) {
			await this.notationDeliveryDb.updateOne({_id: update._id}, update as NotationDeliveryDb);
			return this.notationDeliveryDb.findById(update._id);
		}
		const notationDb = new this.notationDeliveryDb(update);
		return await (notationDb as NotationDeliveryDocument).save();
	}

	async pushNewNotationToDelivery(id: string, notation: NotationDeliveryDb) {
		const delivery = await this.findOne(id);
		delivery.notation.push(notation);
		return await (delivery as DeliveriesDocument).save();
	}

	async findOne(id: string): Promise<DeliveriesDb> {
		return this.deliveryDb.findById(id).populate('notation');
	}

	async findAll(): Promise<DeliveriesDb[]> {
		return this.deliveryDb.find();
	}

	async deleteOne(id: string) {
		await this.deliveryDb.findByIdAndDelete(id);
	}
}
