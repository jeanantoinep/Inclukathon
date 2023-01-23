import {PartialType} from '@nestjs/mapped-types';
import {InclukathonProgramDb} from '../../inclukathon-program.entity';

export class SaveInclukathonDto extends PartialType(InclukathonProgramDb) {
	id?: string;
}
