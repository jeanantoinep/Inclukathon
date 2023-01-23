import {PartialType} from '@nestjs/mapped-types';
import {InclukathonDto} from '../../inclukathon-program/models/dto/inclukathon.dto';
import {UserDto} from './user.dto';
import {TeamDto} from '../../team/dto/team.dto';

export class LoggedUserDto extends PartialType(UserDto) {
	id?: string;
	currentInclukathon?: InclukathonDto;
	teamsToManage?: TeamDto[];
}
