import {IsDefined, IsNotEmpty} from 'class-validator';
import {CompanyDb, CompanyDocument} from '../entities/company.entity';
import {UserDto} from '../../user/dto/user.dto';
import {TeamDto} from '../../team/dto/team.dto';
import {TeamArborescenceDto} from './teamArborescence.dto';
import {AvailableRegionDto} from './availableRegion.dto';

export class CompanyDto {
	constructor(companyDb: CompanyDb) {
		this.id = (companyDb as CompanyDocument)._id;
		this.name = companyDb.name;
		this.imgPath = companyDb.imgPath;
		this.displayRegions = companyDb.displayRegions;
		if (companyDb.teamArborescence?.length > 0 && companyDb.teamArborescence[0]?._id) {
			this.teamArborescence = companyDb.teamArborescence?.map((t) => new TeamArborescenceDto(t));
		}
		if (companyDb.teams?.length > 0 && companyDb.teams[0]?._id) {
			this.teams = companyDb.teams?.map((t) => new TeamDto(t));
		}
		if (companyDb.users?.length > 0 && companyDb.users[0]?._id) {
			this.users = companyDb.users?.map((u) => new UserDto(u));
		}
		if (companyDb.availableRegions?.length > 0 && companyDb.availableRegions[0]?._id) {
			this.availableRegions = companyDb.availableRegions?.map((t) => new AvailableRegionDto(t));
		}
	}

	_id?: string;

	@IsDefined()
	@IsNotEmpty({message: `Erreur d'identifiant company`})
	id!: string;

	@IsDefined()
	@IsNotEmpty({message: 'Aucun nom company'})
	name: string;

	imgPath: string;

	users: UserDto[];
	teams: TeamDto[];
	teamArborescence: TeamArborescenceDto[];
	availableRegions: AvailableRegionDto[];
	displayRegions: boolean;
}
