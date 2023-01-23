import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {EmailController} from './email/email.controller';
import {EmailService} from './email/email.service';
import {
	AVAILABLE_REGION_COLLECTION_NAME,
	BAI_COLLECTION_NAME,
	COMPANY_COLLECTION_NAME,
	DELIVERIES_COLLECTION_NAME,
	EMAIL_SENT_COLLECTION_NAME,
	INCLUKATHON_PROGRAM_COLLECTION_NAME,
	INCLUSCORE_COLLECTION_NAME,
	KTH_SCR_ASSOCIATION_COLLECTION_NAME,
	LAUNCH_KTH_COLLECTION,
	LAUNCH_SCR_COLLECTION,
	LOGIN_TOKENS_COLLECTION_NAME,
	NOTATION_DELIVERY_COLLECTION_NAME,
	PROPOSITIONS_SCR_COLLECTION_NAME,
	QUESTIONS_SCR_COLLECTION_NAME,
	TEAM_ARBORESCENCE_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	TEAM_DELIVERY_COLLECTION_NAME,
	THEMES_SCR_COLLECTION_NAME,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
	WEBINAR_COLLECTION_NAME,
} from './provider/collections.provider';
import {EmailEntity} from './email/sent-email.entity';
import {PropositionsIncluscoreEntity} from './incluscore/entities/propositions.entity';
import {QuestionsIncluscoreEntity} from './incluscore/entities/questions.entity';
import {ThemesIncluscoreEntity} from './incluscore/entities/themes.entity';
import {UserEntity} from './user/entity/user.entity';
import {CompanyEntity} from './company/entities/company.entity';
import {IncluscoreEntity} from './incluscore/entities/incluscore.entity';
import {TeamEntity} from './team/entities/team.entity';
import {LoginEntity} from './login/entities/login.entity';
import {LaunchIncluscoreEntity} from './incluscore/entities/launch.incluscore.entity';
import {UserThemeIncluscoreEntity} from './incluscore/entities/userTheme.entity';
import {UserAnswerIncluscoreEntity} from './incluscore/entities/userAnswer.entity';
import {FileUploadsController} from './file-uploads/file-uploads.controller';
import {AdminKthFileUploadsController} from './file-uploads/kth/admin.kth.file-uploads.controller';
import {BaiKthService} from './inclukathon-program/bai/bai-kth.service';
import {FileUploadsService} from './file-uploads/file-uploads.service';
import {UserService} from './user/service/user.service';
import {CompanyService} from './company/company.service';
import {IncluscoreService} from './incluscore/incluscore.service';
import {InclukathonProgramService} from './inclukathon-program/inclukathon-program.service';
import {UserThemeService} from './incluscore/progression/userTheme.service';
import {LoginService} from './login/login.service';
import {ThemeIncluscoreService} from './incluscore/theme/theme.service';
import {QuestionIncluscoreService} from './incluscore/theme/question.service';
import {PropositionIncluscoreService} from './incluscore/theme/proposition.service';
import {LaunchIncluscoreService} from './incluscore/progression/launch.incluscore.service';
import {BaiEntity} from './inclukathon-program/models/bai.entity';
import {InclukathonProgramEntity} from './inclukathon-program/models/inclukathon-program.entity';
import {KthScrAssociationEntity} from './inclukathon-program/models/kth-scr-association.entity';
import {DeliveriesEntity} from './inclukathon-program/models/deliveries.entity';
import {LoginController} from './login/login.controller';
import {CompanyController} from './company/company.controller';
import {TeamController} from './team/team.controller';
import {UserController} from './user/controller/user.controller';
import {IncluscoreController} from './incluscore/incluscore.controller';
import {UserThemeController} from './incluscore/progression/userTheme.controller';
import {ThemeController} from './incluscore/theme/theme.controller';
import {QuestionController} from './incluscore/theme/question.controller';
import {PropositionController} from './incluscore/theme/proposition.controller';
import {LaunchScrController} from './incluscore/progression/launch.incluscore.controller';
import {InclukathonProgramController} from './inclukathon-program/inclukathon-program.controller';
import {AdminBaiFileUploadsController} from './file-uploads/kth/admin.bai.file-uploads.controller';
import {TeamService} from './team/team.service';
import {KthScrAssociationService} from './inclukathon-program/kthScrAssociation/kth-scr-association.service';
import {DeliveryKthService} from './inclukathon-program/delivery/delivery-kth.service';
import {LaunchKthController} from './inclukathon-program/launch/launch.inclukathon.controller';
import {LaunchInclukathonService} from './inclukathon-program/launch/launch.inclukathon.service';
import {LaunchInclukathonEntity} from './inclukathon-program/models/launch.inclukathon.entity';
import {DeliveryFileUploadsController} from './file-uploads/kth/delivery.file-uploads.controller';
import {TeamDeliveryEntity} from './inclukathon-program/models/team-delivery.entity';
import {NotationDeliveryEntity} from './inclukathon-program/models/notation-delivery.entity';
import {LScrStatService} from './incluscore/progression/launch.incluscore.stats.service';
import {AllExceptionsFilter} from './errors/all-exceptions.filter';
import {APP_FILTER} from '@nestjs/core';
import {ChatModule} from './chatWebSocket/chat.module';
import {TeamArborescenceEntity} from './company/entities/teamArborescence.entity';
import {TranslationController} from './translations/translation.controller';
import {WebinarController} from './webinar/webinar.controller';
import {WebinarService} from './webinar/webinar.service';
import {WebinarEntity} from './webinar/entities/webinar.entity';
import {AvailableRegionEntity} from './company/entities/availableRegion.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');
const encoder = new util.TextEncoder('utf-8');
global.TextEncoder = encoder;

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '../public/root'), // main html file path
		}),
		MongooseModule.forRoot('mongodb://localhost/inclukathon-x-etna'),
		MongooseModule.forFeature([
			{name: DELIVERIES_COLLECTION_NAME, schema: DeliveriesEntity},
			{
				name: NOTATION_DELIVERY_COLLECTION_NAME,
				schema: NotationDeliveryEntity,
			},
			{name: EMAIL_SENT_COLLECTION_NAME, schema: EmailEntity},
			{name: THEMES_SCR_COLLECTION_NAME, schema: ThemesIncluscoreEntity},
			{name: USER_COLLECTION_NAME, schema: UserEntity},
			{name: COMPANY_COLLECTION_NAME, schema: CompanyEntity},
			{name: INCLUSCORE_COLLECTION_NAME, schema: IncluscoreEntity},
			{name: TEAM_COLLECTION_NAME, schema: TeamEntity},
			{name: TEAM_ARBORESCENCE_COLLECTION_NAME, schema: TeamArborescenceEntity},
			{name: AVAILABLE_REGION_COLLECTION_NAME, schema: AvailableRegionEntity},
			{name: LOGIN_TOKENS_COLLECTION_NAME, schema: LoginEntity},
			{name: LAUNCH_SCR_COLLECTION, schema: LaunchIncluscoreEntity},
			{name: LAUNCH_KTH_COLLECTION, schema: LaunchInclukathonEntity},
			{name: BAI_COLLECTION_NAME, schema: BaiEntity},
			{
				name: INCLUKATHON_PROGRAM_COLLECTION_NAME,
				schema: InclukathonProgramEntity,
			},
			{
				name: KTH_SCR_ASSOCIATION_COLLECTION_NAME,
				schema: KthScrAssociationEntity,
			},
			{
				name: PROPOSITIONS_SCR_COLLECTION_NAME,
				schema: PropositionsIncluscoreEntity,
			},
			{
				name: QUESTIONS_SCR_COLLECTION_NAME,
				schema: QuestionsIncluscoreEntity,
			},
			{
				name: USER_THEME_SCR_COLLECTION_NAME,
				schema: UserThemeIncluscoreEntity,
			},
			{
				name: USER_ANSWER_SCR_COLLECTION_NAME,
				schema: UserAnswerIncluscoreEntity,
			},
			{
				name: TEAM_DELIVERY_COLLECTION_NAME,
				schema: TeamDeliveryEntity,
			},
			{
				name: WEBINAR_COLLECTION_NAME,
				schema: WebinarEntity,
			},
		]),
		ChatModule,
	],
	controllers: [
		AdminBaiFileUploadsController,
		AdminKthFileUploadsController,
		AppController,
		CompanyController,
		EmailController,
		FileUploadsController,
		InclukathonProgramController,
		IncluscoreController,
		LaunchScrController,
		LaunchKthController,
		LoginController,
		PropositionController,
		QuestionController,
		TeamController,
		ThemeController,
		UserController,
		UserThemeController,
		DeliveryFileUploadsController,
		TranslationController,
		WebinarController,
	],
	providers: [
		AppService,
		BaiKthService,
		CompanyService,
		EmailService,
		FileUploadsService,
		KthScrAssociationService,
		LaunchIncluscoreService,
		LScrStatService,
		LaunchInclukathonService,
		LoginService,
		InclukathonProgramService,
		IncluscoreService,
		PropositionIncluscoreService,
		QuestionIncluscoreService,
		TeamService,
		ThemeIncluscoreService,
		UserService,
		UserThemeService,
		DeliveryKthService,
		WebinarService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
