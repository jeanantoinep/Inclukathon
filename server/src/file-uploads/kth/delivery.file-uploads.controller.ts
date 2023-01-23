import {DELIVERY_FILE_UPLOADS_CTRL, SINGLE_DELIVERY_ENDPOINT} from '../../provider/routes.helper';
import {Body, Controller, Delete, Get, Post, Query, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {DeliveryKthService} from '../../inclukathon-program/delivery/delivery-kth.service';
import * as fs from 'fs';
import {TeamService} from '../../team/team.service';
import {TeamDeliveryDb, TeamDeliveryDocument} from '../../inclukathon-program/models/team-delivery.entity';
import {TeamDocument} from '../../team/entities/team.entity';
import {InjectModel} from '@nestjs/mongoose';
import {TEAM_DELIVERY_COLLECTION_NAME} from '../../provider/collections.provider';
import {Model} from 'mongoose';

@Controller(DELIVERY_FILE_UPLOADS_CTRL)
export class DeliveryFileUploadsController {
	constructor(
		private readonly deliveryKthService: DeliveryKthService,
		private readonly teamService: TeamService,
		@InjectModel(TEAM_DELIVERY_COLLECTION_NAME)
		private readonly teamDeliveryDb: Model<TeamDeliveryDocument>,
	) {}

	private static readonly SINGLE_DELIVERY_PATH = './../uploaded_files/single-delivery/';

	public static getDeliverySinglePath = (idDelivery, idTeam) => `delivery-${idDelivery}/team-${idTeam}/`;

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idTeam, idDelivery, idUser, unixTime
	 */
	@Post(SINGLE_DELIVERY_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idTeam, idDelivery} = r.body;
					const storageFilePath =
						DeliveryFileUploadsController.SINGLE_DELIVERY_PATH +
						DeliveryFileUploadsController.getDeliverySinglePath(idDelivery, idTeam);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadSingleDelivery(@UploadedFile() file: Express.Multer.File, @Body() body) {
		// todo delete old file BEFORE, for now all files are kept, really bad for disk usage
		const {idTeam, idDelivery, idUser, unixTime} = body;
		const specificFilePath = DeliveryFileUploadsController.getDeliverySinglePath(idDelivery, idTeam);
		const dbFilePath = specificFilePath + file.originalname;
		const teamDb = await this.teamService.findOne(idTeam);
		if (teamDb.teamDelivery.length > 0) {
			const currentDelivery = teamDb.teamDelivery.find((t) => t.delivery.toString() === idDelivery);
			if (currentDelivery) {
				const filenameHasToBeSaved =
					currentDelivery.filesPath.length < 1 || !currentDelivery.filesPath.find((p) => p === dbFilePath);
				if (filenameHasToBeSaved) {
					currentDelivery.filesPath.push(dbFilePath);
				}
				currentDelivery.lastUploaderUserId = idUser;
				currentDelivery.lastUpdateUnixTime = unixTime;
				await (currentDelivery as TeamDeliveryDocument).save();
				await (teamDb as TeamDocument).save();
				return;
			}
		}
		const teamDeliveryDb = new this.teamDeliveryDb({
			delivery: idDelivery,
			filesPath: [dbFilePath],
			lastUploaderUserId: idUser,
			lastUpdateUnixTime: unixTime,
		} as TeamDeliveryDb);
		await (teamDeliveryDb as TeamDeliveryDocument).save();
		teamDb.teamDelivery.push(teamDeliveryDb);
		await (teamDb as TeamDocument).save();
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(SINGLE_DELIVERY_ENDPOINT)
	async seeDeliveryFiles(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: DeliveryFileUploadsController.SINGLE_DELIVERY_PATH,
		});
	}

	/**
	 * @param body => idTeam, idDelivery, filename
	 */
	@Delete(SINGLE_DELIVERY_ENDPOINT)
	async deleteOne(@Body() body: any) {
		const {idTeam, idDelivery, filename} = body;
		const uploadPath = DeliveryFileUploadsController.getDeliverySinglePath(idDelivery, idTeam);
		const storageFilePath = DeliveryFileUploadsController.SINGLE_DELIVERY_PATH + uploadPath + filename;
		const dbFilePath = uploadPath + filename;
		fs.unlinkSync(storageFilePath);
		const teamDb = await this.teamService.findOne(idTeam);
		const currentDelivery = teamDb.teamDelivery.find((t) => t.delivery.toString() === idDelivery);
		currentDelivery.filesPath = [...currentDelivery.filesPath.filter((path) => path !== dbFilePath)];
		await (currentDelivery as TeamDeliveryDocument).save();
		await (teamDb as TeamDocument).save();
		return;
	}
}
