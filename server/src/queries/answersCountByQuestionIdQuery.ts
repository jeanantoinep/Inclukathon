import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

// to add a query like this, just duplicate one of those file and follow the same logic
export const answersCountByQuestionIdQuery = (
	idQuestion: string,
	idTheme: string,
	idLaunch: string,
	goodAnswer: boolean,
	idTeam: string,
) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
		themeId: new mongoose.Types.ObjectId(idTheme),
		isAGoodAnswer: goodAnswer,
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	if (idQuestion) {
		$match['questionId'] = new mongoose.Types.ObjectId(idQuestion);
	}
	return [
		{
			$match,
		},
		...countRows,
	];
};
