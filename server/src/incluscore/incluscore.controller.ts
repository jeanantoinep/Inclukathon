import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {IncluscoreService} from './incluscore.service';
import {IncluscoreDto} from './dto/incluscore.dto';
import {ThemeDto} from './dto/theme.dto';
import {QuestionDto} from './dto/question.dto';
import {PropositionDto} from './dto/proposition.dto';
import {SaveIncluscoreDto} from './dto/creation/save.incluscore.dto';
import {INCLUSCORE_CTRL} from '../provider/routes.helper';
import {PropositionsIncluscoreDb} from './entities/propositions.entity';
import {PropositionIncluscoreService} from './theme/proposition.service';
import {SavePropositionDto} from './dto/creation/save.proposition.dto';
import {QuestionsIncluscoreDb, QuestionsIncluscoreDocument} from './entities/questions.entity';
import {QuestionIncluscoreService} from './theme/question.service';
import {SaveQuestionDto} from './dto/creation/save.question.dto';
import {SaveThemeDto} from './dto/creation/save.theme.dto';
import {ThemeIncluscoreService} from './theme/theme.service';
import {ThemesIncluscoreDb, ThemesIncluscoreDocument} from './entities/themes.entity';
import * as mongoose from 'mongoose';

@Controller(INCLUSCORE_CTRL)
export class IncluscoreController {
	constructor(
		private readonly incluscoreService: IncluscoreService,
		private readonly themeService: ThemeIncluscoreService,
		private readonly questionService: QuestionIncluscoreService,
		private readonly propositionService: PropositionIncluscoreService,
	) {}

	@Get('copy/:id')
	async copyThisIncluscore(@Param('id') idIncluscore: string) {
		const incluscore = await this.incluscoreService.findOne(idIncluscore);
		incluscore._id = new mongoose.Types.ObjectId() as any as string;
		(incluscore as any).isNew = true;
		incluscore.name = '(copy) ' + incluscore.name;
		const newIncluscore = await this.incluscoreService.save(incluscore, true);
		const incluscoresThemes = [...incluscore.themes];
		newIncluscore.themes = [];
		for (const t of incluscoresThemes) {
			t._id = new mongoose.Types.ObjectId() as any as string;
			(t as any).isNew = true;
			const questionsToLoop = [...t.questions];
			t.questions = [];
			const savedNewTheme = await this.themeService.save(t as SaveThemeDto, true);
			for (const q of questionsToLoop) {
				q._id = new mongoose.Types.ObjectId() as any as string;
				(q as any).isNew = true;
				const propositionsToLoop = [...q.propositions];
				q.propositions = [];
				const savedNewQuestion = await this.questionService.save(q as SaveQuestionDto, true);
				for (const p of propositionsToLoop) {
					p._id = new mongoose.Types.ObjectId() as any as string;
					(p as any).isNew = true;
					const savedProposition = await this.propositionService.save(p as SavePropositionDto, true);
					savedNewQuestion.propositions.push(savedProposition._id as any as PropositionsIncluscoreDb);
				}
				await (savedNewQuestion as QuestionsIncluscoreDocument).save();
				savedNewTheme.questions.push(q._id as any as QuestionsIncluscoreDb);
			}
			await (savedNewTheme as ThemesIncluscoreDocument).save();
			newIncluscore.themes.push(savedNewTheme._id as any as ThemesIncluscoreDb);
		}
		return new IncluscoreDto(await this.incluscoreService.save(newIncluscore));
	}

	@Post()
	async save(@Body() incluscore: SaveIncluscoreDto): Promise<IncluscoreDto> {
		incluscore._id = incluscore.id;
		delete incluscore.themes;
		const incluscoreDb = await this.incluscoreService.save(incluscore);
		return new IncluscoreDto(incluscoreDb);
	}

	@Get('for-company-association')
	async findAllForCompanyAssociation(): Promise<IncluscoreDto[]> {
		const incluscores = await this.incluscoreService.findAll(true);
		return incluscores.map((i) => new IncluscoreDto(i));
	}

	@Get(':id')
	async findOne(@Param('id') idIncluscore: string): Promise<IncluscoreDto> {
		const incluscore = await this.incluscoreService.findOne(idIncluscore);
		return new IncluscoreDto(incluscore);
	}

	@Get()
	async findAll(): Promise<IncluscoreDto[]> {
		const incluscores = await this.incluscoreService.findAll();
		return incluscores.map((i) => new IncluscoreDto(i));
	}

	@Get(':id/theme')
	async findSpecificThemes(@Param('id') idIncluscore: string): Promise<ThemeDto[]> {
		return this.incluscoreService.findThemesByIncluscoreId(idIncluscore);
	}

	@Get(':id/theme/:idTheme/question')
	async findSpecificQuestions(
		@Param('id') idIncluscore: string,
		@Param('idTheme') idTheme: string,
	): Promise<QuestionDto[]> {
		return this.incluscoreService.findSpecificQuestions(idIncluscore, idTheme);
	}

	@Get(':id/theme/:idTheme/question/:idQuestion/proposition')
	async findSpecificPropositions(
		@Param('id') idIncluscore: string,
		@Param('idTheme') idTheme: string,
		@Param('idQuestion') idQuestion: string,
	): Promise<PropositionDto[]> {
		return this.incluscoreService.findSpecificPropositions(idIncluscore, idTheme, idQuestion);
	}

	@Delete()
	async deleteOne(@Body('idIncluscore') idIncluscore: string): Promise<IncluscoreDto[]> {
		await this.incluscoreService.deleteOne(idIncluscore);
		const incluscores = await this.incluscoreService.findAll();
		return incluscores.map((incluscoreDb) => new IncluscoreDto(incluscoreDb));
	}
}
