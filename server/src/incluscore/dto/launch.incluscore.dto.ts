import {LaunchIncluscoreDb} from '../entities/launch.incluscore.entity';
import {IncluscoreDto} from './incluscore.dto';
import {CompanyDto} from '../../company/dto/company.dto';
import {TeamDto} from '../../team/dto/team.dto';
import {UserThemeDto} from './user-theme.dto';

export class LaunchIncluscoreDto {
	constructor(launchScrDb: LaunchIncluscoreDb) {
		if (!launchScrDb) {
			return;
		}
		this.id = launchScrDb._id;
		if (launchScrDb.idIncluscore?._id) {
			this.idIncluscore = new IncluscoreDto(launchScrDb.idIncluscore);
		}
		if (launchScrDb.idCompany?._id) {
			this.idCompany = new CompanyDto(launchScrDb.idCompany);
		}
		this.userThemes = launchScrDb.userThemes;
		if (launchScrDb.userThemes?.length > 0 && launchScrDb.userThemes[0]?._id) {
			this.userThemes = launchScrDb.userThemes?.map((l) => new UserThemeDto(l));
		}
	}

	id?: string;
	idIncluscore: IncluscoreDto;
	idCompany: CompanyDto;
	idTeam: TeamDto;
	userThemes: UserThemeDto[] | any;
}
