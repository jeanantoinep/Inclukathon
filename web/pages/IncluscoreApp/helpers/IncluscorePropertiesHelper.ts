import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {UserThemeDto} from '../../../../server/src/incluscore/dto/user-theme.dto';

export class IncluscorePropertiesHelper {
	public static getUserThemeByIdThemeIdUser(launch: LaunchIncluscoreDto, themeId: string): UserThemeDto {
		if (launch.userThemes?.length > 0) {
			return launch.userThemes.find(
				(ut) => ut.userId.id === window.connectedUser.id && ut.themeId.id === themeId,
			);
		}
		return null;
	}
}
