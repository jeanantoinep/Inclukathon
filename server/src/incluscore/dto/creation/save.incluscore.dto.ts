import {PartialType} from '@nestjs/mapped-types';
import {IncluscoreDb} from '../../entities/incluscore.entity';

export class SaveIncluscoreDto extends PartialType(IncluscoreDb) {
	id?: string;
}
