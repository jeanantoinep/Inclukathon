import {PartialType} from '@nestjs/mapped-types';
import {CompanyDb} from '../entities/company.entity';

export class SaveCompanyDto extends PartialType(CompanyDb) {
	id?: string;
}
