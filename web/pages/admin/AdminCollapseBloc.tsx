import * as React from 'react';
import {Component} from 'react';

interface IProps {
	id: string;
	title: string;
}

export class AdminCollapseBloc extends Component<IProps, any> {
	render() {
		const {id} = this.props;
		const idTarget = `#${id}`;
		return (
			<div>
				<a data-toggle="collapse" href={idTarget} role="button" aria-expanded="false" aria-controls={id}>
					<div className={'d-flex justify-content-between align-items-center'}>
						<h1 className={'admin-list-titles'}>{this.props.title}</h1>
					</div>
				</a>
				<div className="row">
					<div className="col">
						<div className="collapse multi-collapse" id={id}>
							<div className="card card-body">{this.props.children}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
