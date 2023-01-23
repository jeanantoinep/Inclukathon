import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {QuestionIncluscoreService} from './question.service';
import {QuestionDto} from '../dto/question.dto';
import {ThemeIncluscoreService} from './theme.service';
import {SaveQuestionDto} from '../dto/creation/save.question.dto';
import {QUESTION_SCR_CTRL} from '../../provider/routes.helper';

@Controller(QUESTION_SCR_CTRL)
export class QuestionController {
	constructor(
		private readonly questionService: QuestionIncluscoreService,
		private readonly themeService: ThemeIncluscoreService,
	) {}

	@Post()
	async save(@Body() q: SaveQuestionDto): Promise<QuestionDto> {
		q._id = q.id;
		const isCreation = !q._id;
		delete q.propositions;
		const question = await this.questionService.save(q);
		if (isCreation) {
			await this.themeService.addQuestion(q.incluscoreThemeId, question);
		}
		return new QuestionDto(question);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<QuestionDto> {
		const q = await this.questionService.findOne(id);
		return new QuestionDto(q);
	}

	@Get()
	async findAll(): Promise<QuestionDto[]> {
		const questions = await this.questionService.find();
		return questions.map((q) => new QuestionDto(q));
	}

	@Delete()
	async deleteOne(
		@Body('idQuestion') idQuestion: string,
		@Body('idTheme') idTheme: string,
	): Promise<QuestionDto[]> {
		await this.themeService.removeIdQuestionFromTheme(idTheme, idQuestion);
		await this.questionService.deleteOne(idQuestion);
		const theme = await this.themeService.findOne(idTheme);
		return theme.questions.map((q) => new QuestionDto(q));
	}
}
