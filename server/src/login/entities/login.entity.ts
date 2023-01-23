import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {LOGIN_TOKENS_COLLECTION_NAME} from '../../provider/collections.provider';

export type LoginDocument = LoginDb & Document;

@Schema({collection: LOGIN_TOKENS_COLLECTION_NAME})
export class LoginDb {
	@Prop()
	userId: string;

	@Prop()
	token: string;
}

export const LoginEntity = SchemaFactory.createForClass(LoginDb);
