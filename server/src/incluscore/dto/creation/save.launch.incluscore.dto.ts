import {PartialType} from '@nestjs/mapped-types';
import {LaunchIncluscoreDb} from '../../entities/launch.incluscore.entity';

export class SaveLaunchIncluscoreDto extends PartialType(LaunchIncluscoreDb) {
	id?: string;
}
