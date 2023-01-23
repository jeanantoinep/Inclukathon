import {PartialType} from '@nestjs/mapped-types';
import {TeamDb} from '../entities/team.entity';

export class SaveTeamDto extends PartialType(TeamDb) {
	id?: string;
	companyId?: string;
}
