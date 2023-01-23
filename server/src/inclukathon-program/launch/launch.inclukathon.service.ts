import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {LAUNCH_KTH_COLLECTION} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {LaunchInclukathonDb, LaunchInclukathonDocument} from '../models/launch.inclukathon.entity';
import {SaveLaunchInclukathonDto} from '../models/dto/creation/save.launch.inclukathon.dto';
import {UserDto} from '../../user/dto/user.dto';
import {DateTimeHelper} from '../../helper/DateTimeHelper';
import {InclukathonDto} from '../models/dto/inclukathon.dto';
import {DateTime} from 'luxon';
import {LaunchInclukathonDto} from '../models/dto/launch.inclukathon.dto';

@Injectable()
export class LaunchInclukathonService {
	constructor(
		@InjectModel(LAUNCH_KTH_COLLECTION)
		private readonly launchKthDb: Model<LaunchInclukathonDocument>,
	) {}

	async retrieveLastInProgressInclukathon(user: UserDto): Promise<InclukathonDto | null> {
		const now = DateTime.now();
		const launches: LaunchInclukathonDb[] = await this.findAllByCompanyId(user.company.id, false);
		const launchesDto = launches?.map((l) => new LaunchInclukathonDto(l)); // DateTime in dto
		if (launchesDto?.length > 0) {
			const inclukathonsInProgress = launchesDto.filter((launch) =>
				DateTimeHelper.isIn(now, launch.idInclukathon?.startDate, launch.idInclukathon?.endDate),
			);
			inclukathonsInProgress.sort((launchA, launchB) => {
				return DateTimeHelper.isBefore(launchA.idInclukathon.startDate, launchB.idInclukathon.startDate)
					? 1
					: -1;
			});
			return inclukathonsInProgress[0]?.idInclukathon ? inclukathonsInProgress[0]?.idInclukathon : null;
		}
		return null;
	}

	async save(update: SaveLaunchInclukathonDto): Promise<LaunchInclukathonDb> {
		if (update._id) {
			await this.launchKthDb.updateOne({_id: update._id}, update as LaunchInclukathonDb);
			return this.findOne(update._id);
		}
		const newLaunch = new this.launchKthDb(update);
		return await (newLaunch as LaunchInclukathonDocument).save();
	}

	async findOne(id: string): Promise<LaunchInclukathonDb> {
		return this.launchKthDb
			.findById(id)
			.populate('idTeam')
			.populate({
				path: 'idInclukathon',
				populate: [
					'bai',
					{path: 'deliveries', populate: 'notation'},
					{
						path: 'kthScrAssociation',
						populate: ['incluscore', 'launchIncluscore'],
					},
				],
			})
			.populate({
				path: 'idCompany',
				populate: ['users', 'teams'],
			});
	}

	async findAllByCompanyId(idCompany: string, light = true): Promise<LaunchInclukathonDb[]> {
		if (light) {
			return this.launchKthDb.find({idCompany: idCompany});
		}
		return this.launchKthDb
			.find({idCompany: idCompany})
			.populate('idTeam')
			.populate({
				path: 'idInclukathon',
				populate: [
					'bai',
					{path: 'deliveries', populate: 'notation'},
					{
						path: 'kthScrAssociation',
						populate: ['incluscore', {path: 'launchIncluscore', populate: 'userThemes'}],
					},
				],
			})
			.populate({
				path: 'idCompany',
				populate: ['users', 'teams'],
			});
	}

	async findAll(): Promise<LaunchInclukathonDb[]> {
		return this.launchKthDb.find();
	}

	async removeTeamLaunches(idTeam: string) {
		await this.launchKthDb.deleteMany({idTeam});
	}

	async deleteOne(id: string, idCompany: string): Promise<LaunchInclukathonDb[]> {
		await this.launchKthDb.findByIdAndDelete(id);
		return await this.findAllByCompanyId(idCompany);
	}
}
