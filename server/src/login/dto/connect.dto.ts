import {IsDefined, IsNotEmpty} from 'class-validator';

export class ConnectDto {
	@IsDefined()
	@IsNotEmpty({message: 'Aucun email'})
	email: string;

	@IsDefined()
	@IsNotEmpty({message: 'Aucun mot de passe'})
	pwd: string;
}
