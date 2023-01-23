import {Component} from 'react';

export class AdminValueHandler {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler = null;
	component = null;

	constructor(component: Component) {
		this.component = component;
	}

	handleValue = (value: string | number | boolean, key: string) => {
		const update = {loginError: false};
		update[key] = value;
		this.component.setState(update);
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.component.handleSubmit(), this.saveRequestTimeoutValue);
	};
}
