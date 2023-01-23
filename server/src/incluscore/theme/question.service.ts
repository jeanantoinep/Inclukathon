import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {PROPOSITIONS_SCR_COLLECTION_NAME, QUESTIONS_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {QuestionsIncluscoreDb, QuestionsIncluscoreDocument} from '../entities/questions.entity';
import {PropositionsIncluscoreDb, PropositionsIncluscoreDocument} from '../entities/propositions.entity';
import {SaveQuestionDto} from '../dto/creation/save.question.dto';

@Injectable()
export class QuestionIncluscoreService {
	constructor(
		@InjectModel(QUESTIONS_SCR_COLLECTION_NAME)
		private readonly questionsDb: Model<QuestionsIncluscoreDocument>,
		@InjectModel(PROPOSITIONS_SCR_COLLECTION_NAME)
		private readonly propositionsDb: Model<PropositionsIncluscoreDocument>,
	) {}

	async save(update: SaveQuestionDto, forceCreation = false): Promise<QuestionsIncluscoreDb> {
		if (update._id && !forceCreation) {
			await this.questionsDb.updateOne({_id: update._id}, update);
			return this.findOne(update._id);
		}
		const newObj = new this.questionsDb(update);
		return await (newObj as QuestionsIncluscoreDocument).save();
	}

	async addProposition(idQuestion: string, proposition: PropositionsIncluscoreDb) {
		const question = await this.findOne(idQuestion);
		question.propositions.push(proposition);
		await (question as QuestionsIncluscoreDocument).save();
	}

	async findOne(idQuestion: string): Promise<QuestionsIncluscoreDb> {
		return await this.questionsDb.findById(idQuestion).populate('propositions').exec();
	}

	async find(): Promise<QuestionsIncluscoreDb[]> {
		return await this.questionsDb.find().populate('propositions').exec();
	}

	async deleteOne(id: string) {
		const q = await this.findOne(id);
		for (const p of q.propositions) {
			await this.propositionsDb.findByIdAndDelete(p._id);
		}
		await this.questionsDb.findByIdAndDelete(id);
	}
}
