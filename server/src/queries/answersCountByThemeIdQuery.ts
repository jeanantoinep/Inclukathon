import * as mongoose from 'mongoose';
import {countRows} from './commonFacetFilter';

export const finishedThemesCount = (idLaunch: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
		answeredAll: true,
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{$match}, // launch, team, only ended theme
		...countRows,
	];
};

export const begunThemesCount = (idLaunch: string, idTeam: string) => {
	const $match = {
		launchId: new mongoose.Types.ObjectId(idLaunch),
	};
	if (idTeam) {
		$match['teamId'] = new mongoose.Types.ObjectId(idTeam);
	}
	return [
		{$match}, // launch, team
		...countRows,
	];
};
