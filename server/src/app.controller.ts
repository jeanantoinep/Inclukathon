import {Controller, Get, Render} from '@nestjs/common';
import {AppService} from './app.service';
import {API_ENDPOINT} from './provider/routes.helper';

@Controller(API_ENDPOINT)
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Render('index')
	root() {
		return {};
	}
}
