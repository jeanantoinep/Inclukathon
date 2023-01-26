/* eslint-disable @typescript-eslint/no-var-requires */
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {join} from 'path';
import {ExpressAdapter, NestExpressApplication} from '@nestjs/platform-express';
import {getCredentials, getSentryDsn} from './https.credential';
import * as https from 'https';
import * as favicon from 'serve-favicon';
import * as express from 'express';
import {API_ENDPOINT} from './provider/routes.helper';
import * as Sentry from '@sentry/node';
import * as core from 'express-serve-static-core';
import * as http from 'http';

const staticFolders = [join(__dirname, '../../public'), join(__dirname, '../../uploaded_files')];

async function bootstrap() {
	const server = express();
	const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server), {
		logger: ['error', 'warn'],
	});
	app.setGlobalPrefix(API_ENDPOINT);
	app.useStaticAssets(join(__dirname, '../../public'));
	app.useStaticAssets(join(__dirname, '../../public/compiled')); // front app
	app.useStaticAssets(join(__dirname, '../../uploaded_files')); // img uploaded by users
	app.setBaseViewsDir(staticFolders);
	app.use(favicon(join(__dirname, '../../public/img/companies/', 'incluscore.png')));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true, // transform object to dto
		}),
	);
	if (process.env.NODE_ENV === 'PROD') {
		// http to https mandatory redirection
		app.enable('trust proxy');
		app.use((req, res, next) => {
			req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
		});
	}
	// setWSForChat(app);
	await app.init();
	prodSetup(server);
	http.createServer(server).listen(80);
	console.debug('Environnement: ', process.env.NODE_ENV || 'DEV', process.env.npm_package_version);
}

function prodSetup(server: core.Express) {
	if (process.env.NODE_ENV !== 'PROD') {
		return;
	}
	Sentry.init({
		release: process.env.npm_package_name + '@' + process.env.npm_package_version,
		dsn: getSentryDsn(),
		tracesSampleRate: 1.0,
	});
	https.createServer(getCredentials(), server).listen(443);
}

// function setWSForChat(app) {
// 	const server = require('http').createServer(app);
// 	const io = require('socket.io')(server);
//
// 	io.on('connection', (client) => {
// 		console.debug('io connection');
// 		client.on('event', (data) => {
// 			console.debug('io data', data);
// 		});
// 		client.on('disconnect', () => {
// 			console.debug('io disconnect');
// 		});
// 	});
// }

bootstrap().then();
