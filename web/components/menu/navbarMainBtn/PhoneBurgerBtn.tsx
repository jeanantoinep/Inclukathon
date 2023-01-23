import {Component} from 'react';
import * as React from 'react';

interface IProps {
	id: string;
}

export class PhoneBurgerBtn extends Component<IProps, any> {
	render() {
		return (
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target={`#${this.props.id}`}
				aria-controls={this.props.id}
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>
		);
	}
}
