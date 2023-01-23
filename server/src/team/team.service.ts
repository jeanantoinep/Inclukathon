import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {TeamDb, TeamDocument} from './entities/team.entity';
import {TEAM_ARBORESCENCE_COLLECTION_NAME, TEAM_COLLECTION_NAME} from '../provider/collections.provider';
import {SaveTeamDto} from './dto/save.team.dto';
import {SaveNotationDeliveryDto} from '../inclukathon-program/models/dto/creation/save.notation-delivery.dto';
import {NotationDeliveryDb} from '../inclukathon-program/models/notation-delivery.entity';
import {TeamDeliveryDb, TeamDeliveryDocument} from '../inclukathon-program/models/team-delivery.entity';
import {TeamArborescenceDb, TeamArborescenceDocument} from '../company/entities/teamArborescence.entity';
import {SaveTeamArborescenceDto} from '../company/dto/saveTeamArborescence.dto';

@Injectable()
export class TeamService {
	constructor(
		@InjectModel(TEAM_COLLECTION_NAME)
		private readonly teamDb: Model<TeamDocument>,
		@InjectModel(TEAM_ARBORESCENCE_COLLECTION_NAME)
		private readonly teamArborescenceDb: Model<TeamArborescenceDocument>,
	) {}

	async save(saveTeamDto: SaveTeamDto): Promise<TeamDb> {
		[1, 2, 3].map((n) => {
			if (saveTeamDto[`level${n}`] === '-1') {
				saveTeamDto[`level${n}`] = null; // unselect
			}
			if (saveTeamDto[`level${n}`]?.id) {
				saveTeamDto[`level${n}`] = saveTeamDto[`level${n}`].id;
			}
		});
		if (saveTeamDto._id) {
			await this.teamDb.updateOne({_id: saveTeamDto._id}, saveTeamDto);
			return this.findOne(saveTeamDto._id);
		}
		const teamUpdated = new this.teamDb(saveTeamDto);
		return await (teamUpdated as TeamDocument).save();
	}

	async saveArborescence(saveTeamArborescenceDto: SaveTeamArborescenceDto): Promise<TeamArborescenceDb> {
		if (saveTeamArborescenceDto._id) {
			await this.teamArborescenceDb.updateOne({_id: saveTeamArborescenceDto._id}, saveTeamArborescenceDto);
			return this.teamArborescenceDb.findById(saveTeamArborescenceDto._id);
		}
		const updated = new this.teamArborescenceDb(saveTeamArborescenceDto);
		return await (updated as TeamArborescenceDocument).save();
	}

	async saveNotationForTeamDelivery(saveNotationDto: SaveNotationDeliveryDto, teamDeliveryDb: TeamDeliveryDb) {
		teamDeliveryDb.notation.push(saveNotationDto as NotationDeliveryDb);
		return await (teamDeliveryDb as TeamDeliveryDocument).save();
	}

	async populateTeamsFields(teams: TeamDb[]): Promise<TeamDb[]> {
		return await this.teamDb.populate(teams, [
			{path: 'level1'},
			{path: 'level2'},
			{path: 'level3'},
			{
				path: 'teamDelivery',
				populate: {path: 'notation'},
			},
		]);
	}

	async findOne(id: string): Promise<TeamDb> {
		const teamDb = await this.teamDb.findById(id);
		const populatedTeams = await this.populateTeamsFields([teamDb]);
		return populatedTeams[0] as TeamDb;
	}

	async findOneArborescence(id: string): Promise<TeamArborescenceDb> {
		return this.teamArborescenceDb.findById(id);
	}

	async findAll(): Promise<TeamDb[]> {
		const teamDbs = await this.teamDb.find();
		return await this.populateTeamsFields(teamDbs);
	}

	async findAllArborescence(): Promise<TeamArborescenceDb[]> {
		return this.teamArborescenceDb.find();
	}

	async findByIds(ids: string[]): Promise<TeamDb[]> {
		const teamDbs = await this.teamDb.find({_id: {$in: ids}});
		return await this.populateTeamsFields(teamDbs);
	}

	async deleteOne(id: string) {
		await this.teamDb.findByIdAndDelete(id);
	}

	async deleteOneArborescence(id: string) {
		await this.teamArborescenceDb.findByIdAndDelete(id);
	}
}
