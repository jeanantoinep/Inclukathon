import {BaiDb, BaiDocument} from '../bai.entity';

export class BaiDto {
	constructor(baiDb: BaiDb) {
		this.id = (baiDb as BaiDocument)._id;
		this.rubrique = baiDb.rubrique;
		this.name = baiDb.name;
		this.imgCoverPath = baiDb.imgCoverPath;
		this.filesPath = baiDb.filesPath;
	}

	_id?: string; // to update data only
	id: string;
	rubrique: string;
	name: string;
	imgCoverPath: string;
	filesPath: string[];
}
