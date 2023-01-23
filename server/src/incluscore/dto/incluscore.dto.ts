import {IncluscoreDb, IncluscoreDocument} from '../entities/incluscore.entity';
import {IsDefined, IsNotEmpty} from 'class-validator';
import {ThemeDto} from './theme.dto';

export class IncluscoreDto {
	constructor(incluscoreDb: IncluscoreDb) {
		this.id = (incluscoreDb as IncluscoreDocument)._id;
		this.name = incluscoreDb.name;
		this['name-en'] = incluscoreDb['name-en'];
		this['name-es'] = incluscoreDb['name-es'];
		this.smallName = incluscoreDb.smallName;
		this['smallName-en'] = incluscoreDb['smallName-en'];
		this['smallName-es'] = incluscoreDb['smallName-es'];
		this.enabled = incluscoreDb.enabled;
		this.canBePublic = incluscoreDb.canBePublic;
		this.description = incluscoreDb.description;
		this['description-en'] = incluscoreDb['description-en'];
		this['description-es'] = incluscoreDb['description-es'];
		if (incluscoreDb.themes?.length > 0) {
			this.themes = incluscoreDb.themes.map((t) => new ThemeDto(t));
		}
		this.isInclucard = incluscoreDb.isInclucard;
		this.inclucardColor = incluscoreDb.inclucardColor;
		this.incluscoreColor = incluscoreDb.incluscoreColor;
		this.secondIncluscoreColor = incluscoreDb.secondIncluscoreColor;
		this.displayNewStudentNumber = incluscoreDb.displayNewStudentNumber;
	}

	_id?: string; // to update data only
	id: string;
	@IsDefined()
	@IsNotEmpty()
	name: string;
	'name-en': string;
	'name-es': string;
	smallName: string;
	'smallName-en': string;
	'smallName-es': string;
	enabled: boolean;
	canBePublic: boolean;
	description: string;
	'description-en': string;
	'description-es': string;
	themes: ThemeDto[];

	/* Inclucard */
	isInclucard: boolean;
	inclucardColor: string;
	incluscoreColor: string;
	secondIncluscoreColor: string;

	// business purpose
	displayNewStudentNumber?: boolean;

	companyImgPath?: string; //
}
