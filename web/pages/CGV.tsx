import * as React from 'react';
import {Component} from 'react';

export default class CGVPage extends Component<any, any> {
	render(): JSX.Element {
		return (
			<div>
				<h1> Mentions légales </h1>
				<iframe
					src={'/img/pdf/cgu.pdf'}
					width={'100%'}
					height={'800px'}
				/>
			</div>
		);
	}
}
