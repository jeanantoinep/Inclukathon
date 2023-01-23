import {PartialType} from '@nestjs/mapped-types';
import {BaiDb} from '../../bai.entity';

export class SaveBaiDto extends PartialType(BaiDb) {
	id?: string;
	idKth?: string;
}
