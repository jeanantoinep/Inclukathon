import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {INCLUSCORE_COLLECTION_NAME, THEMES_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {ThemesIncluscoreDb} from './themes.entity';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';

export type IncluscoreDocument = IncluscoreDb & Document;

@Schema({collection: INCLUSCORE_COLLECTION_NAME})
export class IncluscoreDb {
	_id!: string;

	@Prop()
	name: string;
	@Prop()
	'name-en': string;
	@Prop()
	'name-es': string;

	@Prop()
	smallName: string; // generally "#name"
	@Prop()
	'smallName-en': string;
	@Prop()
	'smallName-es': string;

	@Prop()
	enabled: boolean;

	@Prop()
	canBePublic: boolean;

	@Prop()
	description: string;
	@Prop()
	'description-en': string;
	@Prop()
	'description-es': string;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: THEMES_SCR_COLLECTION_NAME,
			},
		],
	})
	@Type(() => ThemesIncluscoreDb)
	themes: ThemesIncluscoreDb[];

	/* Inclucard */
	@Prop()
	isInclucard: boolean;

	@Prop()
	inclucardColor: string;

	@Prop()
	incluscoreColor: string;

	@Prop()
	secondIncluscoreColor: string;

	@Prop()
	displayNewStudentNumber: boolean;
}

export const IncluscoreEntity = SchemaFactory.createForClass(IncluscoreDb);
