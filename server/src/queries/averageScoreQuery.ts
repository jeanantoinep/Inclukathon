import * as mongoose from 'mongoose';

// to add a query like this, just duplicate one of those file and follow the same logic
export const averageScoreQuery = (idLaunch: string, idTheme: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
		answeredAll: true,
	};
	if (idTheme) {
		$match['themeId'] = new mongoose.Types.ObjectId(idTheme);
	}
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{$match}, // only ended specific theme for this launch for this team
		{
			$group: {
				// distinct user total score
				_id: '$userId',
				totalScore: {$sum: '$score'},
			},
		},
		{
			$group: {
				// average of all users total score
				_id: '',
				items: {$avg: '$totalScore'},
			},
		},
	];
};
