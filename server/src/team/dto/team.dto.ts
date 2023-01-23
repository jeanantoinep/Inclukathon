import {IsDefined, IsNotEmpty} from 'class-validator';
import {TeamDb, TeamDocument} from '../entities/team.entity';
import {TeamDeliveryDto} from '../../inclukathon-program/models/dto/team-delivery.dto';
import {TeamArborescenceDto} from '../../company/dto/teamArborescence.dto';

export class TeamDto {
	constructor(teamDb?: TeamDb) {
		if (!teamDb) {
			return;
		}
		this.id = (teamDb as TeamDocument)._id;
		this.name = teamDb.name;
		this.enabled = teamDb.enabled;
		if (teamDb.teamDelivery?.length > 0 && teamDb.teamDelivery[0]?._id) {
			this.teamDelivery = teamDb.teamDelivery.map((t) => new TeamDeliveryDto(t));
		}
		this.projectDescription = teamDb.projectDescription;
		this.level1 = teamDb.level1 && new TeamArborescenceDto(teamDb.level1);
		this.level2 = teamDb.level2 && new TeamArborescenceDto(teamDb.level2);
		this.level3 = teamDb.level3 && new TeamArborescenceDto(teamDb.level3);
		this.arborescence = '';
		if (this.level1) {
			this.arborescence += `${this.level1?.name} / `;
		}
		if (this.level2) {
			this.arborescence += `${this.level2?.name} / `;
		}
		if (this.level3) {
			this.arborescence += `${this.level3?.name} / `;
		}
		this.arborescence += `${this.name}`;
	}

	@IsDefined()
	@IsNotEmpty({message: `Erreur d'identifiant team`})
	id!: string;

	@IsDefined()
	@IsNotEmpty({message: 'Aucun nom team'})
	name: string;
	enabled: boolean;

	teamDelivery?: TeamDeliveryDto[];

	projectDescription: string;
	level1: TeamArborescenceDto;
	level2: TeamArborescenceDto;
	level3: TeamArborescenceDto;
	arborescence: string;
}
