import {Component} from 'react';
import * as React from 'react';

export class AlertEmailNeeded extends Component<any, any> {
	render() {
		return (
			<div className="alert alert-warning" role="alert">
				Un email est nécessaire afin de sauvegarder l'utilisateur.
			</div>
		);
	}
}
