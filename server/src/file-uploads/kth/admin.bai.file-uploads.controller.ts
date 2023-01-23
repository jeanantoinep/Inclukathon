import {ADMIN_BAI_FILE_UPLOADS_CTRL, COVER_ENDPOINT, FILES_EXEMPLES_BAI_ENDPOINT} from '../../provider/routes.helper';
import {Body, Controller, Delete, Get, Post, Query, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {BaiKthService} from '../../inclukathon-program/bai/bai-kth.service';
import * as fs from 'fs';
import {BaiDocument} from '../../inclukathon-program/models/bai.entity';

@Controller(ADMIN_BAI_FILE_UPLOADS_CTRL)
export class AdminBaiFileUploadsController {
	constructor(private readonly baiKthService: BaiKthService) {}

	private static readonly BAI_COVER_PATH = './../uploaded_files/bai-cover/';
	private static readonly BAI_FILES_PATH = './../uploaded_files/bai-files/';
	public static getBaiIdDirectoryPath = (idBai: string) => `bai-${idBai}/`;

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idBai
	 */
	@Post(COVER_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idBai} = r.body;
					const storageFilePath =
						AdminBaiFileUploadsController.BAI_COVER_PATH +
						AdminBaiFileUploadsController.getBaiIdDirectoryPath(idBai);
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
		const {idBai} = body;
		const specificFilePath = AdminBaiFileUploadsController.getBaiIdDirectoryPath(idBai);
		const dbFilePath = specificFilePath + file.originalname;
		const baiDb = await this.baiKthService.findOne(idBai);
		const oldPath = baiDb.imgCoverPath;
		baiDb.imgCoverPath = dbFilePath;
		await this.baiKthService.save(baiDb);
		const hasToBeRemoved = fs.existsSync(AdminBaiFileUploadsController.BAI_COVER_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(AdminBaiFileUploadsController.BAI_COVER_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(COVER_ENDPOINT)
	async seeBanner(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: AdminBaiFileUploadsController.BAI_COVER_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idBai
	 */
	@Post(FILES_EXEMPLES_BAI_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idBai} = r.body;
					const storageFilePath =
						AdminBaiFileUploadsController.BAI_FILES_PATH +
						AdminBaiFileUploadsController.getBaiIdDirectoryPath(idBai);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadSingleBai(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idBai} = body;
		const specificFilePath = AdminBaiFileUploadsController.getBaiIdDirectoryPath(idBai);
		const dbFilePath = specificFilePath + file.originalname;
		const baiDb = await this.baiKthService.findOne(idBai);
		const filenameHasToBeSaved = baiDb.filesPath.length < 1 || !baiDb.filesPath.find((p) => p === dbFilePath);
		if (filenameHasToBeSaved) {
			baiDb.filesPath.push(dbFilePath);
		}
		await (baiDb as BaiDocument).save();
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(FILES_EXEMPLES_BAI_ENDPOINT)
	async seeOneBaiFile(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: AdminBaiFileUploadsController.BAI_FILES_PATH,
		});
	}

	/**
	 * @param body => idBai, filename
	 */
	@Delete(FILES_EXEMPLES_BAI_ENDPOINT)
	async deleteOneBaiFile(@Body() body: any) {
		const {idBai, filename} = body;
		const uploadPath = AdminBaiFileUploadsController.getBaiIdDirectoryPath(idBai);
		const storageFilePath = AdminBaiFileUploadsController.BAI_FILES_PATH + uploadPath + filename;
		const dbFilePath = uploadPath + filename;
		fs.unlinkSync(storageFilePath);
		const baiDb = await this.baiKthService.findOne(idBai);
		baiDb.filesPath = [...baiDb.filesPath.filter((path) => path !== dbFilePath)];
		await (baiDb as BaiDocument).save();
		return;
	}
}
