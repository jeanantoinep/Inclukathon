import {PartialType} from '@nestjs/mapped-types';
import {WebinarDb} from '../entities/webinar.entity';

export class SaveWebinarDto extends PartialType(WebinarDb) {
	id?: string;
	companyId?: string;
}
