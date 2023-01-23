import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const userThemesFinishedByThemeIdQuery = (idTheme: string, idTeam: string) => {
	const $match = {
		themeId: new mongoose.Types.ObjectId(idTheme),
		answeredAll: true,
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match, // this theme, this team, only ended theme
		},
		{
			$group: {
				// distinct user
				_id: {
					userId: '$userId',
				},
			},
		},
		...countRows,
	];
};

export const userThemesFinishedByThemeIdWithMaybeSomeUsersDuplicateQuery = (idTheme: string, idTeam: string) => {
	const $match = {
		themeId: new mongoose.Types.ObjectId(idTheme),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{$match}, // this theme, this team
		...countRows,
	];
};
