import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {HttpRequester} from '../../../utils/HttpRequester';
import {COMPANY_CTRL} from '../../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../../basics/ToastHelper';
import {createCompanyAvailableRegionAdminPath} from '../../../routes/adminRoutes';
import {AvailableRegionDto} from '../../../../server/src/company/dto/availableRegion.dto';
import {SaveAvailableRegionDto} from '../../../../server/src/company/dto/saveAvailableRegion.dto';

interface IState extends AvailableRegionDto {
	companyId: string;
}

type IProps = IRouterProps;

class AdminCompanyAvailableRegionForm extends Component<IProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
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
		const updatedTeam = await HttpRequester.postHttp(COMPANY_CTRL + '/available-region', {
			id: this.state.id,
			name: this.state.name,
			companyId: this.state.companyId,
		} as SaveAvailableRegionDto);
		this.setState({...updatedTeam});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createCompanyAvailableRegionAdminPath}/${this.state.companyId}/available-region/${updatedTeam.id}`,
			);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion de la région </h1>
					</div>
					<BasicInput
						label={'Nom'}
						inputName={'name'}
						value={this.state.name}
						type="text"
						change={this.handleValue}
					/>
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idCompany, idAvailableRegion} = this.props.match.params;
		let availableRegion: AvailableRegionDto = {} as AvailableRegionDto;
		if (idAvailableRegion) {
			availableRegion = await HttpRequester.getHttp(`${COMPANY_CTRL}/available-region/${idAvailableRegion}`);
		}
		this.setState({
			...availableRegion,
			companyId: idCompany,
		});
	}
}

export default withRouter(AdminCompanyAvailableRegionForm);
