import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {HttpRequester} from '../../../utils/HttpRequester';
import {KthScrAssociationDto} from '../../../../server/src/inclukathon-program/models/dto/kth-scr-association.dto';
import {SaveKthScrAssociationDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.kth-scr-association';
import BasicInput from '../../../basics/BasicInput';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {createInclukathonsScrAdminPath} from '../../../routes/adminRoutes';
import {INCLUKATHON_CTRL, INCLUSCORE_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {DateTime} from 'luxon';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminKthScrAssociationForm extends Component<
	IProps,
	KthScrAssociationDto & {incluscoresAvailable: IncluscoreDto[]}
> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			incluscore: null, // id
			locked: false,
			startDate: DateTime.now(),
			endDate: DateTime.now(),
			incluscoresAvailable: [],
		};
	}

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleSubmit = async () => {
		const idKth = this.props.match.params.idInclukathon;
		const oldId = this.state.id;
		const association = await HttpRequester.postHttp(INCLUKATHON_CTRL + '/kth-scr-association', {
			...this.state,
			idKth,
		} as SaveKthScrAssociationDto);
		this.setState({...association});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createInclukathonsScrAdminPath}/${idKth}/scr/${this.state.id}`);
		}
	};

	selectIncluscoreToAdd = (e) => {
		const i = e.target.selectedIndex;
		if (i) {
			this.setState({
				incluscore: this.state.incluscoresAvailable[i].id,
			});
			if (this.saveRequestTimeoutHandler) {
				clearTimeout(this.saveRequestTimeoutHandler);
			}
			this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()} key={this.state.id}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1>Gestion des incluscores à réaliser pendant le programme</h1>
					</div>
					{this.state.incluscoresAvailable.length > 0 && (
						<div className={'kth-incluscore-association'}>
							<label className={'d-block'}>
								<b>Incluscore à ajouter</b>
							</label>
							<select
								className={'custom-select mr-2 mb-3'}
								onChange={this.selectIncluscoreToAdd}
								defaultValue={this.state.incluscore || this.state.incluscoresAvailable[0].id}
							>
								{this.state.incluscoresAvailable.map((incluscore, index) => {
									return (
										<option key={index} value={incluscore.id}>
											{incluscore.name}
										</option>
									);
								})}
							</select>
						</div>
					)}
					<BasicInput
						inputName={'startDate'}
						label={'Début'}
						value={this.state.startDate}
						type="datepicker"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'endDate'}
						label={'Fin (jour exclus)'}
						value={this.state.endDate}
						type="datepicker"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'locked'}
						label={'Désactivé'}
						value={this.state.locked}
						type={'checkbox'}
						change={this.handleValue}
					/>
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idKthScrAssociation} = this.props.match.params;
		let kthScrAssociation: KthScrAssociationDto = {} as KthScrAssociationDto;
		if (idKthScrAssociation) {
			kthScrAssociation = await HttpRequester.getHttp(
				`${INCLUKATHON_CTRL}/kth-scr-association/${idKthScrAssociation}`,
			);
		}
		const incluscores: IncluscoreDto[] = await HttpRequester.getHttp(INCLUSCORE_CTRL);
		this.setState({
			...kthScrAssociation,
			incluscoresAvailable: incluscores,
			incluscore: kthScrAssociation?.incluscore?.id || incluscores[0]?.id,
		});
	}
}

export default withRouter(AdminKthScrAssociationForm);
