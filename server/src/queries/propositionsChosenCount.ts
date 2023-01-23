import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const propositionsChosenCount = (idProposition: string, idTeam: string) => {
	const $match = {
		userAnswer: new mongoose.Types.ObjectId(idProposition),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{
			$match, // this proposition, this team
		},
		...countRows,
	];
};
