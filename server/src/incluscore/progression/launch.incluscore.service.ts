import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
	LAUNCH_SCR_COLLECTION,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Model} from 'mongoose';
import {LaunchIncluscoreDb, LaunchIncluscoreDocument} from '../entities/launch.incluscore.entity';
import {SaveLaunchIncluscoreDto} from '../dto/creation/save.launch.incluscore.dto';
import {UserThemeIncluscoreDb, UserThemeIncluscoreDocument} from '../entities/userTheme.entity';
import * as mongoose from 'mongoose';
import {UserAnswerIncluscoreDb, UserAnswerIncluscoreDocument} from '../entities/userAnswer.entity';
import {UserThemeService} from './userTheme.service';

@Injectable()
export class LaunchIncluscoreService {
	constructor(
		@InjectModel(LAUNCH_SCR_COLLECTION)
		private readonly launchScrDb: Model<LaunchIncluscoreDocument>,
		@InjectModel(USER_THEME_SCR_COLLECTION_NAME)
		private readonly userThemeIncluscoreDb: Model<UserThemeIncluscoreDocument>,
		@InjectModel(USER_ANSWER_SCR_COLLECTION_NAME)
		private readonly userAnswerIncluscoreDb: Model<UserAnswerIncluscoreDocument>,
	) {}

	async save(update: SaveLaunchIncluscoreDto): Promise<LaunchIncluscoreDb> {
		if (update._id) {
			await this.launchScrDb.updateOne({_id: update._id}, update as LaunchIncluscoreDb);
			return this.findOne(update._id);
		}
		const newLaunch = new this.launchScrDb(update);
		return await (newLaunch as LaunchIncluscoreDocument).save();
	}

	async findOneLight(id: string, currentUserId: string): Promise<LaunchIncluscoreDb> {
		return this.launchScrDb
			.findById(id, {idTeam: 0})
			.populate({
				path: 'idIncluscore',
				populate: [
					{
						path: 'themes',
						populate: {
							path: 'questions',
							populate: {path: 'propositions'},
						},
					},
				],
			})
			.populate({
				path: 'idCompany',
				select: ['teams', 'imgPath', 'teamArborescence', 'availableRegions', 'displayRegions', 'name'],
				populate: [
					{
						path: 'teams',
						select: ['name', 'level1', 'level2', 'level3'],
						populate: ['level1', 'level2', 'level3'],
					},
					{path: 'teamArborescence'},
					{path: 'availableRegions'},
				],
			})
			.populate({
				path: 'userThemes',
				select: ['answeredAll', 'score', 'themeId'],
				match: {userId: currentUserId !== 'null' ? new mongoose.Types.ObjectId(currentUserId) : undefined},
				populate: [
					{
						path: 'answers',
						populate: [{path: 'userAnswer', select: 'isAGoodAnswer'}],
					},
					{path: 'userId', select: '_id'},
				],
			});
	}

	async isInclucardLaunch(id: string): Promise<boolean> {
		const launch = await this.launchScrDb.findById(id, {idIncluscore: 1}).populate({
			path: 'idIncluscore',
			select: 'isInclucard',
		});
		return launch.idIncluscore.isInclucard;
	}

	async findOne(id: string, selectOnly = {}): Promise<LaunchIncluscoreDb> {
		return this.launchScrDb
			.findById(id, selectOnly)
			.populate({
				path: 'idIncluscore',
				populate: [
					{
						path: 'themes',
						populate: {
							path: 'questions',
							populate: {path: 'propositions'},
						},
					},
				],
			})
			.populate({
				path: 'idCompany',
				populate: ['users', 'teams'],
			})
			.populate({
				path: 'userThemes',
				populate: [
					{
						path: 'answers',
						populate: [{path: 'userAnswer'}, {path: 'questionId'}],
					},
					{path: 'userId'},
				],
			});
	}

	async findForStats(id: string, selectOnly = {}): Promise<LaunchIncluscoreDb> {
		return this.launchScrDb.findById(id, selectOnly).populate({
			path: 'idIncluscore',
			select: 'displayNewStudentNumber isInclucard name',
			populate: [
				{
					path: 'themes',
					select: 'name',
					populate: {
						path: 'questions',
						select: 'title',
						populate: {path: 'propositions', select: 'title isAGoodAnswer'},
					},
				},
			],
		});
	}

	async findAllForAdminCompanyEditionPage(idCompany: string): Promise<LaunchIncluscoreDb[]> {
		return this.launchScrDb
			.find({idCompany: idCompany}, {idTeam: 1, idIncluscore: 1, userThemes: 1})
			.populate({
				path: 'idIncluscore',
				select: 'enabled name canBePublic themes',
				populate: {path: 'themes', select: 'name', populate: {path: 'questions', select: '_id title'}},
			})
			.populate({
				path: 'userThemes',
				select: 'score themeId userId',
				populate: {path: 'themeId', select: 'name'},
			});
	}

	async findAllByCompanyId(idCompany: string): Promise<LaunchIncluscoreDb[]> {
		return this.launchScrDb
			.find({idCompany: idCompany})
			.populate({
				path: 'idIncluscore',
				populate: [{path: 'themes'}],
			})
			.populate({
				path: 'userThemes',
				populate: [
					{
						path: 'answers',
						populate: [{path: 'userAnswer'}, {path: 'questionId'}],
					},
					{path: 'userId'},
					{path: 'themeId'},
				],
			});
	}

	async findAll(): Promise<LaunchIncluscoreDb[]> {
		return this.launchScrDb
			.find()
			.populate({
				path: 'idIncluscore',
				populate: [{path: 'themes'}],
			})
			.populate({
				path: 'userThemes',
				populate: [
					{
						path: 'answers',
						populate: [{path: 'userAnswer'}, {path: 'questionId'}],
					},
					{path: 'userId'},
					{path: 'themeId'},
				],
			});
	}

	async addUserThemeIfNotExist(userTheme: UserThemeIncluscoreDb): Promise<void> {
		const launch: LaunchIncluscoreDb = await this.launchScrDb
			.findById(userTheme.launchId, {userThemes: 1})
			.populate({
				path: 'userThemes',
				select: {userId: 1, themeId: 1, launchId: 1},
				match: {
					userId: new mongoose.Types.ObjectId(userTheme.userId.id),
					themeId: new mongoose.Types.ObjectId(userTheme.themeId.id),
					launchId: new mongoose.Types.ObjectId(userTheme.launchId.id),
				},
			});
		if (launch?.userThemes && launch?.userThemes.length < 1) {
			await this.launchScrDb.updateOne(
				{
					_id: userTheme.launchId,
				},
				{
					$push: {
						userThemes: userTheme,
					},
				},
			);
		}
	}

	async deleteOne(id: string, idCompany: string): Promise<LaunchIncluscoreDb[]> {
		await this.launchScrDb.findByIdAndDelete(id);
		return await this.findAllByCompanyId(idCompany);
	}

	async fixDuplicateThemes(): Promise<string[]> {
		const result = await this.userThemeIncluscoreDb.aggregate([
			{
				$facet: {
					query: [
						{
							$group: {
								_id: {
									userId: '$userId',
									idUserTheme: '$themeId',
								},
								userThemeId: {$push: '$_id'},
								items: {$sum: 1},
							},
						},
						{
							$match: {
								items: {$gt: 1},
							},
						},
						{$unwind: '$userThemeId'},
					],
				},
			},
		]);
		const usersThemesPossiblyWrong: UserThemeIncluscoreDb[] = await this.userThemeIncluscoreDb
			.find({_id: {$in: result[0].query.map((q) => q.userThemeId)}})
			.populate({
				path: 'answers',
				populate: 'userAnswer',
			});
		let fixedUserThemes: UserThemeIncluscoreDb[] = [];
		for (const userTheme of usersThemesPossiblyWrong) {
			const firstDuplicate = fixedUserThemes.find(
				(ut: UserThemeIncluscoreDb) =>
					ut.launchId._id.equals(userTheme?.launchId._id) &&
					ut.userId._id.equals(userTheme?.userId._id) &&
					ut.themeId._id.equals(userTheme?.themeId._id),
			);

			if (!firstDuplicate) {
				fixedUserThemes.push(userTheme);
			} else {
				console.debug('fixing duplicate');
				if (firstDuplicate?.answers?.length > userTheme?.answers?.length) {
					continue;
				}
				fixedUserThemes = fixedUserThemes.map((newU: UserThemeIncluscoreDb) =>
					(newU as UserThemeIncluscoreDocument)._id.equals(firstDuplicate?._id) ? userTheme : newU,
				);
			}
		}

		const userThemesWrongsIds = usersThemesPossiblyWrong
			.filter((u) => !fixedUserThemes.find((f) => (f as UserThemeIncluscoreDocument)._id.equals(u._id)))
			.map((ut) => ut._id);

		await this.userThemeIncluscoreDb.remove({
			_id: {
				$in: userThemesWrongsIds,
			},
		});
		return userThemesWrongsIds;
	}

	async fixDuplicateAnswers(launch: LaunchIncluscoreDb) {
		const result = await this.userThemeIncluscoreDb.aggregate([
			{
				$facet: {
					query: [
						{
							$lookup: {
								from: USER_ANSWER_SCR_COLLECTION_NAME,
								localField: 'answers',
								foreignField: '_id',
								as: 'answersAA',
							},
						},
						{$unwind: '$answersAA'},
						{
							$group: {
								_id: {
									userId: '$userId',
									answersAA: '$answersAA.questionId',
								},
								userThemeId: {$first: '$_id'},
								userId: {$first: '$userId'},
								test: {$push: '$answersAA'},
								items: {$sum: 1},
							},
						},
						{
							$match: {
								items: {$gt: 1},
							},
						},
					],
				},
			},
		]);
		const userThemesWithDuplicateQuestion: UserThemeIncluscoreDb[] = await this.userThemeIncluscoreDb
			.find({_id: {$in: result[0].query.map((q) => q.userThemeId)}})
			.populate({
				path: 'answers',
				populate: 'userAnswer',
			});
		for (const userThemeWithDuplicateQuestion of userThemesWithDuplicateQuestion) {
			const fixedAnswers: UserAnswerIncluscoreDb[] = [];
			userThemeWithDuplicateQuestion.score = 0;
			for (const a of userThemeWithDuplicateQuestion.answers) {
				if (fixedAnswers.find((newA) => newA.questionId._id.equals(a.questionId._id))) {
					console.debug('remove duplicate answer');
					await this.userAnswerIncluscoreDb.remove({_id: a._id});
					continue;
				}
				fixedAnswers.push(a);
				if (a?.userAnswer?.isAGoodAnswer) {
					userThemeWithDuplicateQuestion.score += launch.idIncluscore.isInclucard
						? UserThemeService.SCORE_FOR_INCLUCARD
						: UserThemeService.SCORE_FOR_INCLUSCORE;
				}
			}
			await (userThemeWithDuplicateQuestion as UserThemeIncluscoreDocument).update({
				$set: {answers: fixedAnswers, score: userThemeWithDuplicateQuestion.score},
			});
		}
	}

	async fixDuplicate() {
		const launches: LaunchIncluscoreDb[] = await this.findAll();
		for (const launch of launches) {
			const userThemesWrongsIds = await this.fixDuplicateThemes();
			await this.fixDuplicateAnswers(launch);
			await this.launchScrDb.updateOne(
				{_id: launch._id},
				{
					$set: {
						userThemes: launch.userThemes.filter(
							(ut) =>
								!userThemesWrongsIds.find((id) => (ut as UserThemeIncluscoreDocument)._id.equals(id)),
						),
					},
				},
			);
		}
	}
}
