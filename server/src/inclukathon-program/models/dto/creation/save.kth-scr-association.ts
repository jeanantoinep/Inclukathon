import {PartialType} from '@nestjs/mapped-types';
import {KthScrAssociationDb} from '../../kth-scr-association.entity';

export class SaveKthScrAssociationDto extends PartialType(KthScrAssociationDb) {
	id?: string;
	idKth?: string;
}
