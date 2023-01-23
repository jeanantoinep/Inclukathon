import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const userThemesByLaunchIdWithAnsweredAllTrueQuery = (idLaunch: string, nbThemesMax = 0, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
		answeredAll: true,
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match, // this launch, only ended theme
		},
		{
			$group: {
				// distinct user/launch couple
				_id: {
					userId: '$userId',
					launchId: '$launchId',
				},
				nbThemePerUser: {
					$sum: 1,
				},
			},
		},
		{
			$match: {
				// theme count for this result, greater or equal
				nbThemePerUser: {$gte: nbThemesMax},
			},
		},
		...countRows,
	];
};
