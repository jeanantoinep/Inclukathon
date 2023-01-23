import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {PROPOSITIONS_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {PropositionsIncluscoreDb, PropositionsIncluscoreDocument} from '../entities/propositions.entity';
import {SavePropositionDto} from '../dto/creation/save.proposition.dto';

@Injectable()
export class PropositionIncluscoreService {
	constructor(
		@InjectModel(PROPOSITIONS_SCR_COLLECTION_NAME)
		private readonly propositionsDb: Model<PropositionsIncluscoreDocument>,
	) {}

	async save(update: SavePropositionDto, forceCreation = false): Promise<PropositionsIncluscoreDb> {
		if (update._id && !forceCreation) {
			await this.propositionsDb.updateOne({_id: update._id}, update);
			return this.findOne(update._id);
		}
		const newObj = new this.propositionsDb(update);
		return await (newObj as PropositionsIncluscoreDocument).save();
	}

	async findOne(id: string): Promise<PropositionsIncluscoreDb> {
		return await this.propositionsDb.findById(id).exec();
	}

	async find(): Promise<PropositionsIncluscoreDb[]> {
		return await this.propositionsDb.find().exec();
	}
}
