import {Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileUploadsService} from './file-uploads.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {UserService} from '../user/service/user.service';
import {CompanyService} from '../company/company.service';
import {ThemeIncluscoreService} from '../incluscore/theme/theme.service';
import {SaveThemeDto} from '../incluscore/dto/creation/save.theme.dto';
import {
	COMPANY_LOGO_ENDPOINT,
	FILE_UPLOADS_CTRL,
	THEME_LOGO_ENDPOINT,
	USER_AVATAR_ENDPOINT,
	USER_PRESENTATION_VIDEO_ENDPOINT,
	WEBINAR_VIDEO_ENDPOINT,
} from '../provider/routes.helper';
import * as fs from 'fs';
import {WebinarService} from '../webinar/webinar.service';

@Controller(FILE_UPLOADS_CTRL)
export class FileUploadsController {
	constructor(
		private readonly fileUploadsService: FileUploadsService,
		private readonly userService: UserService,
		private readonly companyService: CompanyService,
		private readonly themeService: ThemeIncluscoreService,
		private readonly webinarService: WebinarService,
	) {}

	private static readonly USER_AVATAR_PATH = './../uploaded_files/users-avatar/';
	private static readonly USER_PRESENTATION_VIDEO_PATH = './../uploaded_files/users-presentation-video/';
	private static readonly COMPANY_LOGO_PATH = './../uploaded_files/company-logo/';
	private static readonly THEMES_LOGO_PATH = './../uploaded_files/themes-logo/';
	private static readonly WEBINAR_VIDEO_PATH = './../uploaded_files/webinar-video/';
	public static getUserIdDirectoryPath = (idUser: string) => `user-${idUser}/`;
	public static getCompanyDirectoryPath = (idCompany: string) => `company-${idCompany}/`;
	public static getThemeDirectoryPath = (idTheme: string) => `theme-${idTheme}/`;
	public static getWebinarIdDirectoryPath = (id: string) => `webinar-${id}/`;

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idUser
	 */
	@Post(USER_AVATAR_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idUser} = r.body;
					const storageFilePath =
						FileUploadsController.USER_AVATAR_PATH + FileUploadsController.getUserIdDirectoryPath(idUser);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadUserAvatar(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idUser} = body;
		const specificFilePath = FileUploadsController.getUserIdDirectoryPath(idUser);
		const dbFilePath = specificFilePath + file.originalname;
		const user = await this.userService.findOne(idUser);
		const oldPath = user.avatarImgPath;
		user.avatarImgPath = dbFilePath;
		await this.userService.save(user);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.USER_AVATAR_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.USER_AVATAR_PATH + oldPath);
		}
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileName is not changed in this method
	 * @param body => filepond (contain file), idWebinar
	 */
	@Post(WEBINAR_VIDEO_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idWebinar} = r.body;
					const storageFilePath =
						FileUploadsController.WEBINAR_VIDEO_PATH +
						FileUploadsController.getWebinarIdDirectoryPath(idWebinar);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadWebinarVideo(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idWebinar} = body;
		const specificFilePath = FileUploadsController.getWebinarIdDirectoryPath(idWebinar);
		const dbFilePath = specificFilePath + file.originalname;
		const webinarDb = await this.webinarService.findOne(idWebinar);
		const oldPath = webinarDb.path;
		webinarDb.path = dbFilePath;
		await this.webinarService.save(webinarDb);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.WEBINAR_VIDEO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.WEBINAR_VIDEO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(WEBINAR_VIDEO_ENDPOINT)
	async seeWebinarVideo(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.WEBINAR_VIDEO_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idUser
	 */
	@Post(USER_PRESENTATION_VIDEO_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idUser} = r.body;
					const storageFilePath =
						FileUploadsController.USER_PRESENTATION_VIDEO_PATH +
						FileUploadsController.getUserIdDirectoryPath(idUser);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadUserPresentationVideo(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idUser} = body;
		const specificFilePath = FileUploadsController.getUserIdDirectoryPath(idUser);
		const dbFilePath = specificFilePath + file.originalname;
		const user = await this.userService.findOne(idUser);
		const oldPath = user.presentationVideoPath;
		user.presentationVideoPath = dbFilePath;
		await this.userService.save(user);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.USER_PRESENTATION_VIDEO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.USER_PRESENTATION_VIDEO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(USER_AVATAR_ENDPOINT)
	async seeUserAvatar(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.USER_AVATAR_PATH,
		});
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(USER_PRESENTATION_VIDEO_ENDPOINT)
	async seeUserPresentationVideo(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.USER_PRESENTATION_VIDEO_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idCompany
	 */
	@Post(COMPANY_LOGO_ENDPOINT)
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idCompany} = r.body;
					const storageFilePath =
						FileUploadsController.COMPANY_LOGO_PATH +
						FileUploadsController.getCompanyDirectoryPath(idCompany);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadCompanyLogo(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idCompany} = body;
		const specificFilePath = FileUploadsController.getCompanyDirectoryPath(idCompany);
		const dbFilePath = specificFilePath + file.originalname;
		const company = await this.companyService.findOne(idCompany);
		const oldPath = company.imgPath;
		company.imgPath = dbFilePath;
		await this.companyService.save(company);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.COMPANY_LOGO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.COMPANY_LOGO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(COMPANY_LOGO_ENDPOINT)
	async seeCompanyLogo(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.COMPANY_LOGO_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idTheme
	 */
	@Post(THEME_LOGO_ENDPOINT + '1')
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idTheme} = r.body;
					const storageFilePath =
						FileUploadsController.THEMES_LOGO_PATH + FileUploadsController.getThemeDirectoryPath(idTheme);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadThemeLogo1(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idTheme} = body;
		const specificFilePath = FileUploadsController.getThemeDirectoryPath(idTheme);
		const dbFilePath = specificFilePath + file.originalname;
		const theme = await this.themeService.findOne(idTheme);
		const oldPath = theme.imgPath;
		theme.imgPath = dbFilePath;
		await this.themeService.save(theme as SaveThemeDto);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(THEME_LOGO_ENDPOINT + '1')
	async seeThemeLogo1(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.THEMES_LOGO_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idTheme
	 */
	@Post(THEME_LOGO_ENDPOINT + '2')
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idTheme} = r.body;
					const storageFilePath =
						FileUploadsController.THEMES_LOGO_PATH + FileUploadsController.getThemeDirectoryPath(idTheme);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadThemeLogo2(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idTheme} = body;
		const specificFilePath = FileUploadsController.getThemeDirectoryPath(idTheme);
		const dbFilePath = specificFilePath + file.originalname;
		const theme = await this.themeService.findOne(idTheme);
		const oldPath = theme.imgPath2;
		theme.imgPath2 = dbFilePath;
		await this.themeService.save(theme as SaveThemeDto);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(THEME_LOGO_ENDPOINT + '2')
	async seeThemeLogo2(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.THEMES_LOGO_PATH,
		});
	}

	/**
	 * Save file in disk storage and save filepath in DB
	 * @param file => file to be saved, fileNamed is not changed in this method
	 * @param body => filepond (contain file), idTheme
	 */
	@Post(THEME_LOGO_ENDPOINT + '3')
	@UseInterceptors(
		FileInterceptor('filepond', {
			storage: diskStorage({
				destination: (r, f, cb) => {
					const {idTheme} = r.body;
					const storageFilePath =
						FileUploadsController.THEMES_LOGO_PATH + FileUploadsController.getThemeDirectoryPath(idTheme);
					fs.mkdirSync(storageFilePath, {recursive: true}); // create if not exist
					cb(null, storageFilePath);
				},
				filename(r, f, cb) {
					cb(null, f.originalname);
				},
			}),
		}),
	)
	async uploadThemeLogo3(@UploadedFile() file: Express.Multer.File, @Body() body) {
		const {idTheme} = body;
		const specificFilePath = FileUploadsController.getThemeDirectoryPath(idTheme);
		const dbFilePath = specificFilePath + file.originalname;
		const theme = await this.themeService.findOne(idTheme);
		const oldPath = theme.imgPath3;
		theme.imgPath3 = dbFilePath;
		await this.themeService.save(theme as SaveThemeDto);
		const hasToBeRemoved = fs.existsSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		if (hasToBeRemoved) {
			fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
		}
	}

	/**
	 * @param load query parameter = filename
	 * @param res
	 */
	@Get(THEME_LOGO_ENDPOINT + '3')
	async seeThemeLogo3(@Query('load') load, @Res() res) {
		return res.sendFile(load, {
			root: FileUploadsController.THEMES_LOGO_PATH,
		});
	}
}
