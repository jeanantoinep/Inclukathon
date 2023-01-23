import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {PROPOSITIONS_SCR_COLLECTION_NAME} from '../../provider/collections.provider';

export type PropositionsIncluscoreDocument = PropositionsIncluscoreDb & Document;

@Schema({collection: PROPOSITIONS_SCR_COLLECTION_NAME})
export class PropositionsIncluscoreDb {
	_id?: string;

	@Prop()
	title: string;
	@Prop()
	'title-en': string;
	@Prop()
	'title-es': string;

	@Prop()
	enabled: boolean;

	@Prop()
	isAGoodAnswer: boolean;
}

export const PropositionsIncluscoreEntity = SchemaFactory.createForClass(PropositionsIncluscoreDb);
