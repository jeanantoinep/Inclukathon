import {PartialType} from '@nestjs/mapped-types';
import {ThemesIncluscoreDb} from '../../entities/themes.entity';

export class SaveThemeDto extends PartialType(ThemesIncluscoreDb) {
	id?: string;
	incluscoreId: string;
}
