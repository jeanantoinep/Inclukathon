import {LaunchInclukathonDb} from '../launch.inclukathon.entity';
import {InclukathonDto} from './inclukathon.dto';
import {CompanyDto} from '../../../company/dto/company.dto';
import {TeamDto} from '../../../team/dto/team.dto';

export class LaunchInclukathonDto {
	constructor(launchKthDb: LaunchInclukathonDb) {
		if (!launchKthDb) {
			return;
		}
		this.id = launchKthDb._id;
		if (launchKthDb.idInclukathon?._id) {
			this.idInclukathon = new InclukathonDto(launchKthDb.idInclukathon);
		}
		this.idCompany = new CompanyDto(launchKthDb.idCompany);
		this.idTeam = new TeamDto(launchKthDb.idTeam);
	}

	id?: string;
	idInclukathon: InclukathonDto;
	idCompany: CompanyDto;
	idTeam: TeamDto;
}
