import {USER_COLLECTION_NAME} from '../provider/collections.provider';

export const lookupUserFromUT = [
	{
		$lookup: {
			from: USER_COLLECTION_NAME,
			localField: 'userId',
			foreignField: '_id',
			as: 'user',
		},
	},
	{
		$unwind: '$user',
	},
];

export const countRows = [
	{
		$group: {
			_id: '',
			items: {$sum: 1},
		},
	},
];
