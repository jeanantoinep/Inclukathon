import {ADMIN_KTH_FILE_UPLOADS_CTRL, BANNER_KTH_ENDPOINT, PROGRAM_KTH_ENDPOINT} from '../../provider/routes.helper';
import {Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {InclukathonProgramService} from '../../inclukathon-program/inclukathon-program.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import * as fs from 'fs';

@Controller(ADMIN_KTH_FILE_UPLOADS_CTRL)
export class AdminKthFileUploadsController {
	constructor(private readonly inclukathonProgramService: InclukathonProgramService) {}

	private static readonly KTH_BANNER_PATH = './../uploaded_files/inclukathon-banner/';
	private static readonly KTH_PROGRAM_IMG_PATH = './../uploaded_files/inclukathon-program-img/';
	public static getKthIdDirectoryPath = (idKth: string) => `kth-${idKth}/`;

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idKth
	 */
	@Post(BANNER_KTH_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idKth} = r.body;
					const storageFilePath =
						AdminKthFileUploadsController.KTH_BANNER_PATH +
						AdminKthFileUploadsController.getKthIdDirectoryPath(idKth);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadBanner(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idKth} = body;
		const specificFilePath = AdminKthFileUploadsController.getKthIdDirectoryPath(idKth);
		const dbFilePath = specificFilePath + file.originalname;
		const inclukathonProgramDb = await this.inclukathonProgramService.findOne(idKth);
		const oldPath = inclukathonProgramDb.bannerImgPath;
		inclukathonProgramDb.bannerImgPath = dbFilePath;
		await this.inclukathonProgramService.save(inclukathonProgramDb);
		const hasToBeRemoved = fs.existsSync(AdminKthFileUploadsController.KTH_BANNER_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(AdminKthFileUploadsController.KTH_BANNER_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(BANNER_KTH_ENDPOINT)
	async seeBanner(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: AdminKthFileUploadsController.KTH_BANNER_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idKth
	 */
	@Post(PROGRAM_KTH_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idKth} = r.body;
					const storageFilePath =
						AdminKthFileUploadsController.KTH_PROGRAM_IMG_PATH +
						AdminKthFileUploadsController.getKthIdDirectoryPath(idKth);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadProgramImg(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idKth} = body;
		const specificFilePath = AdminKthFileUploadsController.getKthIdDirectoryPath(idKth);
		const dbFilePath = specificFilePath + file.originalname;
		const inclukathonProgramDb = await this.inclukathonProgramService.findOne(idKth);
		const oldPath = inclukathonProgramDb.programImgPath;
		inclukathonProgramDb.programImgPath = dbFilePath;
		await this.inclukathonProgramService.save(inclukathonProgramDb);
		const hasToBeRemoved = fs.existsSync(AdminKthFileUploadsController.KTH_PROGRAM_IMG_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(AdminKthFileUploadsController.KTH_PROGRAM_IMG_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(PROGRAM_KTH_ENDPOINT)
	async seeProgramImg(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: AdminKthFileUploadsController.KTH_PROGRAM_IMG_PATH,
		});
	}
}
