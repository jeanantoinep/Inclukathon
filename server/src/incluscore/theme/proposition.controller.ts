import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {PropositionIncluscoreService} from './proposition.service';
import {PropositionDto} from '../dto/proposition.dto';
import {QuestionIncluscoreService} from './question.service';
import {SavePropositionDto} from '../dto/creation/save.proposition.dto';
import {PROPOSITION_SCR_CTRL} from '../../provider/routes.helper';

@Controller(PROPOSITION_SCR_CTRL)
export class PropositionController {
	constructor(
		private readonly propositionService: PropositionIncluscoreService,
		private readonly questionService: QuestionIncluscoreService,
	) {}

	@Post()
	async save(@Body() p: SavePropositionDto): Promise<PropositionDto> {
		p._id = p.id;
		const isCreation = !p._id;
		const proposition = await this.propositionService.save(p);
		if (isCreation) {
			await this.questionService.addProposition(
				p.incluscoreQuestionId,
				proposition,
			);
		}
		return new PropositionDto(proposition);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<PropositionDto> {
		const p = await this.propositionService.findOne(id);
		return new PropositionDto(p);
	}

	@Get()
	async findAll(): Promise<PropositionDto[]> {
		const propositions = await this.propositionService.find();
		return propositions.map((p) => new PropositionDto(p));
	}
}
