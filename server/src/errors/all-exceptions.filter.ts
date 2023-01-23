import {Catch, ArgumentsHost} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import * as Sentry from '@sentry/node';
import {UserService} from '../user/service/user.service';
import {UserDb} from '../user/entity/user.entity';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
	constructor(private readonly userService: UserService) {
		super();
	}

	sendSentryLog(e: any, method?: string, url?: string, query?: string, params?: string, body?: any, user?: UserDb) {
		const transaction = Sentry.startTransaction({
			op: 'Error caught by AllExceptionsFilter',
			name: 'An error occurred',
		});
		body.pwd = '********';
		body.password = '********';
		Sentry.setContext('error-context', {
			method,
			url,
			query,
			params,
			body,
			currentDate: new Date(),
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			company: user?.companyId?.name,
		});
		if (user) {
			delete (user as any).pwd;
			delete (user as any).password;
		}
		Sentry.setUser({
			...user,
		});
		Sentry.captureException(e);
		transaction.finish();
	}

	async catch(exception: unknown, host: ArgumentsHost) {
		super.catch(exception, host);
		if (process.env.NODE_ENV === 'PROD') {
			const hostInfo = (host as any)?.args ? (host as any)?.args[0] : null;
			let user;
			if (hostInfo?.query && hostInfo?.query['current-user-id']) {
				user = await this.userService.findOne(hostInfo.query['current-user-id']);
			}
			this.sendSentryLog(
				exception,
				hostInfo?.method,
				hostInfo?.url,
				hostInfo?.query,
				hostInfo?.params,
				hostInfo?.body,
				user,
			);
		}
	}
}
