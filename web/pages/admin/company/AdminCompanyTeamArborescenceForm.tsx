import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveTeamDto} from '../../../../server/src/team/dto/save.team.dto';
import {TEAM_CTRL} from '../../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../../basics/ToastHelper';
import {createCompanyTeamArborescenceAdminPath} from '../../../routes/adminRoutes';
import {TeamArborescenceDto} from '../../../../server/src/company/dto/teamArborescence.dto';

interface IState extends TeamArborescenceDto {
	companyId: string;
}

type IProps = IRouterProps;

class AdminCompanyTeamArborescenceForm extends Component<IProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			level: 1,
			companyId: undefined,
		};
	}

	handleValue = (value: string | number | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleSubmit = async () => {
		const oldId = this.state.id;
		const updatedTeam = await HttpRequester.postHttp(TEAM_CTRL + '/new-arborescence', {
			id: this.state.id,
			name: this.state.name,
			level: this.state.level,
			companyId: this.state.companyId,
		} as SaveTeamDto);
		this.setState({...updatedTeam});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createCompanyTeamArborescenceAdminPath}/${this.state.companyId}/team-arborescence/${updatedTeam.id}`,
			);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion du niveau </h1>
					</div>
					<BasicInput
						label={'Nom'}
						inputName={'name'}
						value={this.state.name}
						type="text"
						change={this.handleValue}
					/>
					<select
						name="level"
						id="level"
						className={'custom-select'}
						value={this.state.level}
						onChange={(e) => this.handleValue(parseInt((e.target as HTMLSelectElement).value), 'level')}
					>
						<option key={1} value="1">
							Niveau 1
						</option>
						<option key={2} value="2">
							Niveau 2
						</option>
						<option key={3} value="3">
							Niveau 3
						</option>
					</select>
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idCompany, idTeamArborescence} = this.props.match.params;
		let teamArborescence: TeamArborescenceDto = {} as TeamArborescenceDto;
		if (idTeamArborescence) {
			teamArborescence = await HttpRequester.getHttp(`${TEAM_CTRL}/arborescence/${idTeamArborescence}`);
		}
		this.setState({
			...teamArborescence,
			companyId: idCompany,
		});
	}
}

export default withRouter(AdminCompanyTeamArborescenceForm);
