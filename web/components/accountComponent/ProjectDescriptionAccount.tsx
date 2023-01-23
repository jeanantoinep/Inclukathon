import {Component} from 'react';
import BasicInput from '../../basics/BasicInput';
import * as React from 'react';
import {HttpRequester} from '../../utils/HttpRequester';
import {TEAM_CTRL} from '../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../basics/ToastHelper';

interface IProps {
	idTeam: string;
	initialProjectDescription: string;
}

interface IState {
	projectDescription: string;
}

export class ProjectDescriptionAccount extends Component<IProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			projectDescription: this.props.initialProjectDescription,
		};
	}

	setProjectDescription = async (value: string) => {
		this.setState({
			projectDescription: value,
		});
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(
			() => this.saveProjectDescription(value),
			this.saveRequestTimeoutValue,
		);
	};

	async saveProjectDescription(value: string) {
		await HttpRequester.postHttp(TEAM_CTRL + '/project-description', {
			projectDescription: value,
			idTeam: this.props.idTeam,
		});
		ToastHelper.showSuccessMessage();
	}

	render() {
		return (
			<>
				<h3>Nom du projet:</h3>
				<BasicInput
					label={'Description courte du projet (maximum 50 caractères)'}
					value={this.state.projectDescription}
					inputName={'projectDescription'}
					type={'textarea'}
					change={(value: string) => this.setProjectDescription(value)}
				/>
			</>
		);
	}
}
