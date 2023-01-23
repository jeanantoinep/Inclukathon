import {PartialType} from '@nestjs/mapped-types';
import {TeamArborescenceDb} from '../entities/teamArborescence.entity';

export class SaveTeamArborescenceDto extends PartialType(TeamArborescenceDb) {
	id?: string;
	companyId: string;
}
