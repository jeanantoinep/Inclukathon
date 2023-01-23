import {PartialType} from '@nestjs/mapped-types';
import {LaunchInclukathonDb} from '../../launch.inclukathon.entity';

export class SaveLaunchInclukathonDto extends PartialType(LaunchInclukathonDb) {
	id?: string;
}
