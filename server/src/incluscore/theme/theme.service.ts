import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {THEMES_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {ThemesIncluscoreDb, ThemesIncluscoreDocument} from '../entities/themes.entity';
import {ThemeDto} from '../dto/theme.dto';
import {QuestionsIncluscoreDb, QuestionsIncluscoreDocument} from '../entities/questions.entity';
import {QuestionIncluscoreService} from './question.service';
import {SaveThemeDto} from '../dto/creation/save.theme.dto';

@Injectable()
export class ThemeIncluscoreService {
	constructor(
		@InjectModel(THEMES_SCR_COLLECTION_NAME)
		private readonly themesDb: Model<ThemesIncluscoreDocument>,
		private readonly questionService: QuestionIncluscoreService,
	) {}

	async save(update: SaveThemeDto, forceCreation = false): Promise<ThemesIncluscoreDb> {
		if (update._id && !forceCreation) {
			await this.themesDb.updateOne({_id: update._id}, update);
			return this.findOne(update._id);
		}
		const newObj = new this.themesDb(update);
		return await (newObj as ThemesIncluscoreDocument).save();
	}

	async addQuestion(idTheme: string, question: QuestionsIncluscoreDb) {
		const theme = await this.findOne(idTheme);
		theme.questions.push(question);
		await (theme as ThemesIncluscoreDocument).save();
	}

	async getNbQuestions(idTheme: string): Promise<number> {
		return (await this.findOne(idTheme, {questions: 1})).questions.length;
	}

	async findOne(id: string, selectOnly = {}): Promise<ThemesIncluscoreDb> {
		return await this.themesDb
			.findById(id, selectOnly)
			.populate({
				path: 'questions',
				populate: {
					path: 'propositions',
				},
			})
			.exec();
	}

	async find(): Promise<ThemeDto[]> {
		const themeDbs = await this.themesDb
			.find()
			.populate({
				path: 'questions',
				populate: {
					path: 'propositions',
				},
			})
			.exec();
		return themeDbs.map((t) => new ThemeDto(t));
	}

	async removeIdQuestionFromTheme(id: string, idQuestion: string) {
		const themeDb = await this.themesDb.findById(id);
		themeDb.questions = themeDb.questions.filter((q) => !(q as QuestionsIncluscoreDocument)._id.equals(idQuestion));
		await themeDb.save();
		return themeDb.questions;
	}

	async deleteOne(id: string) {
		const themeDb = await this.findOne(id);
		for (const q of themeDb.questions) {
			await this.questionService.deleteOne(q._id);
		}
		await this.themesDb.findByIdAndDelete(id);
	}
}
