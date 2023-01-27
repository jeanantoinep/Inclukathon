import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileUploadsService } from "./file-uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UserService } from "../user/service/user.service";
import { CompanyService } from "../company/company.service";
import { ThemeIncluscoreService } from "../incluscore/theme/theme.service";
import { QuestionIncluscoreService } from "src/incluscore/theme/question.service";
import { SaveThemeDto } from "../incluscore/dto/creation/save.theme.dto";
import {
  COMPANY_LOGO_ENDPOINT,
  FILE_UPLOADS_CTRL,
  PROPOSITION_IMG_ENDPOINT,
  QUESTION_IMG_ENDPOINT,
  THEME_LOGO_ENDPOINT,
  USER_AVATAR_ENDPOINT,
  USER_PRESENTATION_VIDEO_ENDPOINT,
  WEBINAR_VIDEO_ENDPOINT,
} from "../provider/routes.helper";
import * as fs from "fs";
import { WebinarService } from "../webinar/webinar.service";
import { PropositionIncluscoreService } from "src/incluscore/theme/proposition.service";
import { SavePropositionDto } from "src/incluscore/dto/creation/save.proposition.dto";
import { SaveQuestionDto } from "src/incluscore/dto/creation/save.question.dto";

@Controller(FILE_UPLOADS_CTRL)
export class FileUploadsController {
  constructor(
    private readonly fileUploadsService: FileUploadsService,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly themeService: ThemeIncluscoreService,
    private readonly webinarService: WebinarService,
    private readonly propositionService: PropositionIncluscoreService,
    private readonly questionService: QuestionIncluscoreService
  ) {}

  private static readonly USER_AVATAR_PATH =
    "./../uploaded_files/users-avatar/";
  private static readonly USER_PRESENTATION_VIDEO_PATH =
    "./../uploaded_files/users-presentation-video/";
  private static readonly COMPANY_LOGO_PATH =
    "./../uploaded_files/company-logo/";
  private static readonly THEMES_LOGO_PATH = "./../uploaded_files/themes-logo/";
  private static readonly QUESTION_IMG_PATH =
    "./../uploaded_files/question-img/";
  private static readonly WEBINAR_VIDEO_PATH =
    "./../uploaded_files/webinar-video/";
  private static readonly PROPOSITION_IMG_PATH =
    "./../uploaded_files/proposition-img/";
  public static getUserIdDirectoryPath = (idUser: string) => `user-${idUser}/`;
  public static getCompanyDirectoryPath = (idCompany: string) =>
    `company-${idCompany}/`;
  public static getThemeDirectoryPath = (idTheme: string) =>
    `theme-${idTheme}/`;
  public static getWebinarIdDirectoryPath = (id: string) => `webinar-${id}/`;
  public static getPropositionDiretoryPath = (id: string) =>
    `proposition-${id}/`;

  public static getQuestionDirectoryPath = (id: string) => `question-${id}/`;

  /**
   * Save file in disk storage and save filepath in DB
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), idUser
   */
  @Post(USER_AVATAR_ENDPOINT)
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idUser } = r.body;
          const storageFilePath =
            FileUploadsController.USER_AVATAR_PATH +
            FileUploadsController.getUserIdDirectoryPath(idUser);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idUser } = body;
    const specificFilePath =
      FileUploadsController.getUserIdDirectoryPath(idUser);
    const dbFilePath = specificFilePath + file.originalname;
    const user = await this.userService.findOne(idUser);
    const oldPath = user.avatarImgPath;
    user.avatarImgPath = dbFilePath;
    await this.userService.save(user);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.USER_AVATAR_PATH + oldPath
    );
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
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idWebinar } = r.body;
          const storageFilePath =
            FileUploadsController.WEBINAR_VIDEO_PATH +
            FileUploadsController.getWebinarIdDirectoryPath(idWebinar);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadWebinarVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idWebinar } = body;
    const specificFilePath =
      FileUploadsController.getWebinarIdDirectoryPath(idWebinar);
    const dbFilePath = specificFilePath + file.originalname;
    const webinarDb = await this.webinarService.findOne(idWebinar);
    const oldPath = webinarDb.path;
    webinarDb.path = dbFilePath;
    await this.webinarService.save(webinarDb);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.WEBINAR_VIDEO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(FileUploadsController.WEBINAR_VIDEO_PATH + oldPath);
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(WEBINAR_VIDEO_ENDPOINT)
  async seeWebinarVideo(@Query("load") load, @Res() res) {
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
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idUser } = r.body;
          const storageFilePath =
            FileUploadsController.USER_PRESENTATION_VIDEO_PATH +
            FileUploadsController.getUserIdDirectoryPath(idUser);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadUserPresentationVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idUser } = body;
    const specificFilePath =
      FileUploadsController.getUserIdDirectoryPath(idUser);
    const dbFilePath = specificFilePath + file.originalname;
    const user = await this.userService.findOne(idUser);
    const oldPath = user.presentationVideoPath;
    user.presentationVideoPath = dbFilePath;
    await this.userService.save(user);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.USER_PRESENTATION_VIDEO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(
        FileUploadsController.USER_PRESENTATION_VIDEO_PATH + oldPath
      );
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(USER_AVATAR_ENDPOINT)
  async seeUserAvatar(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.USER_AVATAR_PATH,
    });
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(USER_PRESENTATION_VIDEO_ENDPOINT)
  async seeUserPresentationVideo(@Query("load") load, @Res() res) {
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
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idCompany } = r.body;
          const storageFilePath =
            FileUploadsController.COMPANY_LOGO_PATH +
            FileUploadsController.getCompanyDirectoryPath(idCompany);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadCompanyLogo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idCompany } = body;
    const specificFilePath =
      FileUploadsController.getCompanyDirectoryPath(idCompany);
    const dbFilePath = specificFilePath + file.originalname;
    const company = await this.companyService.findOne(idCompany);
    const oldPath = company.imgPath;
    company.imgPath = dbFilePath;
    await this.companyService.save(company);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.COMPANY_LOGO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(FileUploadsController.COMPANY_LOGO_PATH + oldPath);
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(COMPANY_LOGO_ENDPOINT)
  async seeCompanyLogo(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.COMPANY_LOGO_PATH,
    });
  }

  /**
   * Save file in disk storage and save filepath in DB
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), idTheme
   */
  @Post(THEME_LOGO_ENDPOINT + "1")
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idTheme } = r.body;
          const storageFilePath =
            FileUploadsController.THEMES_LOGO_PATH +
            FileUploadsController.getThemeDirectoryPath(idTheme);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadThemeLogo1(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idTheme } = body;
    const specificFilePath =
      FileUploadsController.getThemeDirectoryPath(idTheme);
    const dbFilePath = specificFilePath + file.originalname;
    const theme = await this.themeService.findOne(idTheme);
    const oldPath = theme.imgPath;
    theme.imgPath = dbFilePath;
    await this.themeService.save(theme as SaveThemeDto);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.THEMES_LOGO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(THEME_LOGO_ENDPOINT + "1")
  async seeThemeLogo1(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.THEMES_LOGO_PATH,
    });
  }

  /**
   * Save file in disk storage and save filepath in DB
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), idTheme
   */
  @Post(THEME_LOGO_ENDPOINT + "2")
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idTheme } = r.body;
          const storageFilePath =
            FileUploadsController.THEMES_LOGO_PATH +
            FileUploadsController.getThemeDirectoryPath(idTheme);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadThemeLogo2(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idTheme } = body;
    const specificFilePath =
      FileUploadsController.getThemeDirectoryPath(idTheme);
    const dbFilePath = specificFilePath + file.originalname;
    const theme = await this.themeService.findOne(idTheme);
    const oldPath = theme.imgPath2;
    theme.imgPath2 = dbFilePath;
    await this.themeService.save(theme as SaveThemeDto);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.THEMES_LOGO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(THEME_LOGO_ENDPOINT + "2")
  async seeThemeLogo2(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.THEMES_LOGO_PATH,
    });
  }

  /**
   * Save file in disk storage and save filepath in DB
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), idTheme
   */
  @Post(THEME_LOGO_ENDPOINT + "3")
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idTheme } = r.body;
          const storageFilePath =
            FileUploadsController.THEMES_LOGO_PATH +
            FileUploadsController.getThemeDirectoryPath(idTheme);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadThemeLogo3(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idTheme } = body;
    const specificFilePath =
      FileUploadsController.getThemeDirectoryPath(idTheme);
    const dbFilePath = specificFilePath + file.originalname;
    const theme = await this.themeService.findOne(idTheme);
    const oldPath = theme.imgPath3;
    theme.imgPath3 = dbFilePath;
    await this.themeService.save(theme as SaveThemeDto);
    const hasToBeRemoved = fs.existsSync(
      FileUploadsController.THEMES_LOGO_PATH + oldPath
    );
    if (hasToBeRemoved) {
      fs.unlinkSync(FileUploadsController.THEMES_LOGO_PATH + oldPath);
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(THEME_LOGO_ENDPOINT + "3")
  async seeThemeLogo3(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.THEMES_LOGO_PATH,
    });
  }

  /**
   * Save file in disk storage and save filepath in DB
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), idUser
   */
  @Post(PROPOSITION_IMG_ENDPOINT)
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idProposition } = r.body;
          const storageFilePath =
            FileUploadsController.PROPOSITION_IMG_PATH +
            FileUploadsController.getPropositionDiretoryPath(idProposition);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  /**
   * @param file => file to be saved, fileNamed is not changed in this method
   * @param body => filepond (contain file), questionId
   */
  @Post(QUESTION_IMG_ENDPOINT)
  @UseInterceptors(
    FileInterceptor("filepond", {
      storage: diskStorage({
        destination: (r, f, cb) => {
          const { idQuestion } = r.body;
          const storageFilePath =
            FileUploadsController.QUESTION_IMG_PATH +
            FileUploadsController.getQuestionDirectoryPath(idQuestion);
          fs.mkdirSync(storageFilePath, { recursive: true }); // create if not exist
          cb(null, storageFilePath);
        },
        filename(r, f, cb) {
          cb(null, f.originalname);
        },
      }),
    })
  )
  async uploadPropositionImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idProposition } = body;
    const specificFilePath =
      FileUploadsController.getPropositionDiretoryPath(idProposition);
    const dbFilePath = specificFilePath + file.originalname;
    const proposition = await this.propositionService.findOne(idProposition);
    console.log(proposition);
    const oldPath = proposition.imgPath;
    proposition.imgPath = dbFilePath;
    await this.propositionService.save(proposition as SavePropositionDto);
    if (oldPath) {
      const hasToBeRemoved = fs.existsSync(
        FileUploadsController.PROPOSITION_IMG_PATH + oldPath
      );
      if (hasToBeRemoved) {
        fs.unlinkSync(FileUploadsController.PROPOSITION_IMG_PATH + oldPath);
      }
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(PROPOSITION_IMG_ENDPOINT)
  async seeAnswerImg(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.PROPOSITION_IMG_PATH,
    });
  }

  /**
   * @param body => idProposition, filename
   */
  @Delete(PROPOSITION_IMG_ENDPOINT)
  async deleteOneProposition(@Body() body: any) {
    const { idProposition, filename } = body;
    const specificFilePath =
      FileUploadsController.getPropositionDiretoryPath(idProposition);
    const dbFilePath = specificFilePath + filename;
    const storageFilePath =
      FileUploadsController.PROPOSITION_IMG_PATH + dbFilePath;
    fs.unlinkSync(storageFilePath);
    const proposition = await this.propositionService.findOne(idProposition);
    proposition.imgPath = "";
    await this.propositionService.save(proposition as SavePropositionDto);
    return;
  }

  async uploadQuestionImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() body
  ) {
    const { idQuestion } = body;
    const specificFilePath =
      FileUploadsController.getQuestionDirectoryPath(idQuestion);
    const dbFilePath = specificFilePath + file.originalname;
    const question = await this.questionService.findOne(idQuestion);
    const oldPath = question.imgPath;
    question.imgPath = dbFilePath;
    await this.questionService.save(question as SaveQuestionDto);
    if (oldPath) {
      const hasToBeRemoved = fs.existsSync(
        FileUploadsController.QUESTION_IMG_PATH + oldPath
      );
      if (hasToBeRemoved) {
        fs.unlinkSync(FileUploadsController.QUESTION_IMG_PATH + oldPath);
      }
    }
  }

  /**
   * @param load query parameter = filename
   * @param res
   */
  @Get(QUESTION_IMG_ENDPOINT)
  async seeQuestionImg(@Query("load") load, @Res() res) {
    return res.sendFile(load, {
      root: FileUploadsController.QUESTION_IMG_PATH,
    });
  }

  /**
   * @param body => idQuestion, filename
   */
  @Delete(QUESTION_IMG_ENDPOINT)
  async deleteOneQuestion(@Body() body: any) {
    const { idQuestion, filename } = body;
    const specificFilePath =
      FileUploadsController.getQuestionDirectoryPath(idQuestion);
    const dbFilePath = specificFilePath + filename;
    const storageFilePath =
      FileUploadsController.QUESTION_IMG_PATH + dbFilePath;
    fs.unlinkSync(storageFilePath);
    const question = await this.questionService.findOne(idQuestion);
    question.imgPath = "";
    await this.questionService.save(question as SaveQuestionDto);
    return;
  }
}
