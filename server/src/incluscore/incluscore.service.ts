import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {INCLUSCORE_COLLECTION_NAME, THEMES_SCR_COLLECTION_NAME} from '../provider/collections.provider';
import {Model} from 'mongoose';
import {IncluscoreDb, IncluscoreDocument} from './entities/incluscore.entity';
import {ThemesIncluscoreDb, ThemesIncluscoreDocument} from './entities/themes.entity';
import {ThemeDto} from './dto/theme.dto';
import {QuestionDto} from './dto/question.dto';
import {PropositionDto} from './dto/proposition.dto';
import {ThemeIncluscoreService} from './theme/theme.service';
import {SaveIncluscoreDto} from './dto/creation/save.incluscore.dto';

@Injectable()
export class IncluscoreService {
	constructor(
		@InjectModel(INCLUSCORE_COLLECTION_NAME)
		private readonly incluscoreDb: Model<IncluscoreDocument>,
		@InjectModel(THEMES_SCR_COLLECTION_NAME)
		private readonly themesDb: Model<ThemesIncluscoreDocument>,
		private readonly themeService: ThemeIncluscoreService,
	) {}

	async save(update: SaveIncluscoreDto, forceCreation = false): Promise<IncluscoreDb> {
		if (update._id && !forceCreation) {
			await this.incluscoreDb.updateOne({_id: update._id}, update as IncluscoreDb);
			return this.findOne(update._id);
		}
		const newIncluscore = new this.incluscoreDb(update);
		return await (newIncluscore as IncluscoreDocument).save();
	}

	async addTheme(id: string, theme: ThemesIncluscoreDb) {
		const incluscore = await this.findOne(id);
		incluscore.themes.push(theme);
		await (incluscore as IncluscoreDocument).save();
	}

	async findOne(id: string): Promise<IncluscoreDb> {
		return this.incluscoreDb.findById(id).populate({
			path: 'themes',
			populate: {
				path: 'questions',
				populate: {path: 'propositions'},
			},
		});
	}

	async findAll(light = false): Promise<IncluscoreDb[]> {
		if (light) {
			return this.incluscoreDb.find({}, {_id: 1, name: 1});
		}
		return this.incluscoreDb.find().populate({
			path: 'themes',
			populate: {
				path: 'questions',
				populate: {path: 'propositions'},
			},
		});
	}

	async findThemesByIncluscoreId(incluscoreId: string): Promise<ThemeDto[]> {
		const incluscore = await this.incluscoreDb.findById(incluscoreId).populate('themes').exec();
		return incluscore.themes.map((t) => new ThemeDto(t));
	}

	async findSpecificQuestions(incluscoreId: string, themeId: string): Promise<QuestionDto[]> {
		const incluscore = await this.incluscoreDb
			.findById(incluscoreId)
			.populate({
				path: 'themes',
				match: {_id: themeId},
				populate: {path: 'questions', populate: 'propositions'},
				select: 'questions',
			})
			.exec();
		return incluscore.themes[0].questions.map((q) => new QuestionDto(q));
	}

	async findSpecificPropositions(
		incluscoreId: string,
		themeId: string,
		questionId: string,
	): Promise<PropositionDto[]> {
		const incluscore = await this.incluscoreDb
			.findById(incluscoreId)
			.populate({
				path: 'themes',
				match: {_id: themeId},
				populate: {
					path: 'questions',
					match: {_id: questionId},
					populate: 'propositions',
					select: 'propositions',
				},
				select: 'questions',
			})
			.exec();
		return incluscore.themes[0].questions[0].propositions.map((p) => new PropositionDto(p));
	}

	async deleteOne(id: string) {
		const incluscore = await this.findOne(id);
		for (const t of incluscore.themes) {
			await this.themeService.deleteOne(t._id);
		}
		await this.incluscoreDb.findByIdAndDelete(id);
	}

	async removeIdThemeFromIncluscore(id: string, idTheme: string) {
		const incluscore = await this.incluscoreDb.findById(id);
		incluscore.themes = incluscore.themes.filter((t) => !(t as ThemesIncluscoreDocument)._id.equals(idTheme));
		await incluscore.save();
		return incluscore.themes;
	}
}
