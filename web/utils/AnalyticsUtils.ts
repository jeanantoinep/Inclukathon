import {isInclusionConseilUser} from '../index';
import {Component} from 'react';

export class AnalyticsUtils {
	static SCR_HOMEPAGE_SEEN = 'SCR_HOMEPAGE_SEEN';
	static SCR_USER_SIGN_UP_BEFORE_REDIRECT = 'SCR_USER_SIGN_UP_BEFORE_REDIRECT';
	static SCR_USER_ANSWER = 'SCR_USER_ANSWER';

	component = null;
	constructor(component: Component) {
		this.component = component;
	}

	public track(eventType: string, data: any) {
		if (isInclusionConseilUser()) {
			return;
		}
		window.analytics.track(eventType, {
			user: window.connectedUser?.email || 'unknown',
			...data,
		});
	}
}
