export class ContactMailDto {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	phone: string;
	message: string;
	'gestion-projet'?: boolean;
	'cellule-ecoute'?: boolean;
	sensibilisation?: boolean;
	'job-coaching'?: boolean;
	inclukathon?: boolean;
	incluscore?: boolean;
	inclucard?: boolean;
}
