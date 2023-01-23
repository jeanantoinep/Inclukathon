import {PartialType} from '@nestjs/mapped-types';
import {UserDb} from '../entity/user.entity';

export class SaveUserDto extends PartialType(UserDb) {
	id?: string;
}
