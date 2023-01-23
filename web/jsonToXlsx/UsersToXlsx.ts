import {UserDto} from '../../server/src/user/dto/user.dto';
import {UserThemeDto} from '../../server/src/incluscore/dto/user-theme.dto';
import {LaunchIncluscoreDto} from '../../server/src/incluscore/dto/launch.incluscore.dto';
import AdminCompanyUsers from '../pages/admin/company/AdminCompanyUsers';
import {TeamDto} from '../../server/src/team/dto/team.dto';
import {WebinarDto} from '../../server/src/webinar/dto/webinar.dto';

export interface IColumnsXlsx {
	label: string; // column name
	value: string | ((any) => string); // object field name
}

export interface XlsxFormat {
	sheet: string;
	columns: IColumnsXlsx[];
	content: any[]; // object to be transformed
}

export class UsersToXlsx {
	public static launchScrUsersToXlsx(
		content: UserDto[],
		hasStudentNumber,
		launchesScr: LaunchIncluscoreDto[],
		filteredUserThemes: UserThemeDto[],
		companyTeams: TeamDto[],
		webinarsSeen: WebinarDto[],
	): XlsxFormat[] {
		const columns: IColumnsXlsx[] = [];
		const firstNameColumn = {
			label: 'Prénom',
			value: (row: UserDto) => `${row.firstName}`,
		};
		const nameColumn = {
			label: 'Nom',
			value: (row: UserDto) => `${row.lastName}`,
		};
		const mailColumn = {
			label: 'Mail',
			value: (row: UserDto) => `${row.email}`,
		};
		const studentNumber = {
			label: 'Numéro d’étudiant',
			value: (row: UserDto) => `${row.studentNumber}`,
		};
		const score = {
			label: 'Score total',
			value: (row: UserDto) => {
				const ownUserThemes = filteredUserThemes.filter((ut) => ut.userId.id === row.id);
				return `${AdminCompanyUsers.retrieveScoreStatic(launchesScr, ownUserThemes, row, true)}`;
			},
		};
		const team = {
			label: 'Team',
			value: (row: UserDto) => companyTeams.find((t) => t.id === row.team?.id)?.arborescence || '',
		};
		if (hasStudentNumber) {
			columns.push(studentNumber);
		}
		columns.push(mailColumn);
		columns.push(firstNameColumn);
		columns.push(nameColumn);
		columns.push(team);
		columns.push(score);
		const themesToCalculScore = AdminCompanyUsers.getOneUserThemeForEachThemeIds(filteredUserThemes);
		for (const theme of themesToCalculScore) {
			const themeScore = {
				label: `Score ${theme.name}`,
				value: (row: UserDto) => {
					const ownUserThemes = filteredUserThemes.filter((ut) => ut.userId.id === row.id);
					return `${AdminCompanyUsers.retrieveScoreStatic(launchesScr, ownUserThemes, row, true, theme.id)}`;
				},
			};
			columns.push(themeScore);
		}
		for (const webinar of webinarsSeen) {
			const webinarScore = {
				label: `Webinar ${webinar.title}`,
				value: (row: UserDto) => {
					const score = row.webinars?.find((w) => webinar.id === w.id)?.score;
					return `${!isNaN(score) && score > 0 ? score : 0}`;
				},
			};
			columns.push(webinarScore);
		}
		return [
			{
				columns,
				content,
				sheet: 'Utilisateurs',
			},
		];
	}

	public static npsStats(content: UserDto[]): XlsxFormat[] {
		const columns: IColumnsXlsx[] = [];
		const firstNameColumn = {
			label: 'Prénom',
			value: (row: UserDto) => `${row.firstName}`,
		};
		const nameColumn = {
			label: 'Nom',
			value: (row: UserDto) => `${row.lastName}`,
		};
		const mailColumn = {
			label: 'Mail',
			value: (row: UserDto) => `${row.email}`,
		};
		const notationColumn = {
			label: 'Nps',
			value: (row: UserDto) => `${row.npsNotation}`,
		};
		const commentColumn = {
			label: 'Commentaire',
			value: (row: UserDto) => `${row.npsComment}`,
		};
		columns.push(firstNameColumn);
		columns.push(nameColumn);
		columns.push(mailColumn);
		columns.push(notationColumn);
		columns.push(commentColumn);
		return [
			{
				columns,
				content,
				sheet: 'Nps',
			},
		];
	}
}
