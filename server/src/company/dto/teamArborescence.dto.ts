import {TeamArborescenceDb, TeamArborescenceDocument} from '../entities/teamArborescence.entity';

export class TeamArborescenceDto {
	constructor(teamArborescenceDb: TeamArborescenceDb) {
		this.id = (teamArborescenceDb as TeamArborescenceDocument)._id;
		this.name = teamArborescenceDb.name;
		this.level = teamArborescenceDb.level;
	}
	id!: string;
	name: string;
	level: number;
}
