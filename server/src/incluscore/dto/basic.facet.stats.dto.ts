import {LaunchIncluscoreDto} from './launch.incluscore.dto';
import {StatsMainObject} from '../progression/launch.incluscore.stats.service';
import {TeamDto} from '../../team/dto/team.dto';

export class BasicFacetStatsDto {
	stat: StatsMainObject;
	launch: LaunchIncluscoreDto;
	team?: TeamDto;
	companyUsersCount?: number;
}
