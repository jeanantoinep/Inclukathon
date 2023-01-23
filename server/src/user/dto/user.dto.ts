import {IsDefined, IsNotEmpty} from 'class-validator';
import {UserDb} from '../entity/user.entity';
import {TeamDto} from '../../team/dto/team.dto';
import {CompanyDto} from '../../company/dto/company.dto';
import {TeamDb} from '../../team/entities/team.entity';
import {ILang} from '../../translations/LangUtils';
import {WebinarDto} from '../../webinar/dto/webinar.dto';
import {AvailableRegionDto} from '../../company/dto/availableRegion.dto';

export class UserDto {
	constructor(user: UserDb, token?: string) {
		if (!user) {
			return;
		}
		this.id = user._id;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.email = user.email;
		this.createdFromIncluscore = user.createdFromIncluscore;
		this.enabled = user.enabled;
		this.isSuperAdmin = user.superAdmin;
		this.isCompanyAdmin = user.companyAdmin;
		this.avatarImgPath = user.avatarImgPath;
		this.jobName = user.jobName;
		this.squadName = user.squadName;
		if (user.juryOfTeams?.length > 0 && user.juryOfTeams[0]?._id) {
			this.juryOfTeams = (user.juryOfTeams as TeamDb[]).map((t) => new TeamDto(t));
		}
		if (user.manageTeams?.length > 0 && user.manageTeams[0]?._id) {
			this.manageTeams = (user.manageTeams as TeamDb[]).map((t) => new TeamDto(t));
		}
		if (user.companyId?._id) {
			this.company = new CompanyDto(user.companyId);
		}
		if (user.teamId?._id) {
			this.team = new TeamDto(user.teamId);
		}
		if (token) {
			this.token = token;
		}
		this.studentNumber = user.studentNumber;
		this.presentationVideoPath = user.presentationVideoPath;
		this.hasAPassword = user.hasAPassword;
		this.lang = user.lang;
		this.npsNotation = user.npsNotation;
		this.npsComment = user.npsComment;
		this.region = user.region;
		if (user.webinars?.length > 0 && user.webinars[0]?._id) {
			this.webinars = user.webinars.map((w) => new WebinarDto(w));
		}
	}

	@IsDefined()
	@IsNotEmpty({message: `Erreur d'identifiant utilisateur`})
	id!: string;

	@IsDefined()
	@IsNotEmpty({message: 'Aucun prénom utilisateur'})
	firstName: string;

	@IsDefined()
	@IsNotEmpty({message: 'Aucun nom utilisateur'})
	lastName: string;

	team: TeamDto | any;
	email: string;
	company: CompanyDto;
	manageTeams?: TeamDb[] | any;
	juryOfTeams?: TeamDb[] | any;

	createdFromIncluscore?: boolean;
	enabled?: boolean;
	token?: string; // if user is logged
	isSuperAdmin?: boolean;
	isCompanyAdmin?: boolean;
	avatarImgPath?: string;

	studentNumber?: string;

	presentationVideoPath?: string;
	jobName?: string;
	squadName?: string;
	hasAPassword?: boolean;
	lang?: ILang;
	npsNotation?: number;
	npsComment?: string;
	webinars?: WebinarDto[];
	region?: AvailableRegionDto;
}
