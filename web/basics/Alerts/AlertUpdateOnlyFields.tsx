import {Component} from 'react';
import * as React from 'react';

export class AlertUpdateOnlyFields extends Component<any, any> {
	render() {
		return (
			<div className="alert alert-warning" role="alert">
				Certains champs apparaitrons seulement après la création.
			</div>
		);
	}
}
