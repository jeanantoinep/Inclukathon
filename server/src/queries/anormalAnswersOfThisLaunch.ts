import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const anormalAnswersOfThisLaunch = (idLaunch: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match,
		},
		{
			$group: {
				_id: {
					userId: '$userId',
					questionId: '$questionId',
				},
				items: {$sum: 1},
			},
		},
		{
			$match: {
				items: {$gt: 1},
			},
		},
		...countRows,
	];
};

export const allAnswersOfThisLaunchWithoutCondition = (idLaunch: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match, // launch, team
		},
		...countRows,
	];
};
