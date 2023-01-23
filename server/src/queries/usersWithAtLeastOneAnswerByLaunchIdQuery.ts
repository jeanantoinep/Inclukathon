import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const usersWithAtLeastOneAnswerByLaunchIdQuery = (idLaunch: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match, // this launch, this team
		},
		{
			$group: {
				_id: {
					userId: '$userId', // how many distinct user match this query
				},
			},
		},
		...countRows,
	];
};
