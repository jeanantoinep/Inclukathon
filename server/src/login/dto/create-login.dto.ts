import {IsDefined, IsNotEmpty} from 'class-validator';

export class CreateLoginDto {
	@IsDefined()
	@IsNotEmpty()
	userId: string;
	@IsDefined()
	@IsNotEmpty()
	token: string;
}
