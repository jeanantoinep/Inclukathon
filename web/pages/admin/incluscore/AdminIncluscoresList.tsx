import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {createIncluscoreAdminPath} from '../../../routes/adminRoutes';
import {INCLUSCORE_CTRL} from '../../../../server/src/provider/routes.helper';

type IProps = IRouterProps;

class AdminIncluscoresList extends Component<IProps, any> {
	constructor(props) {
		super(props);
		this.state = {
			incluscores: [],
		};
	}

	async getAllIncluscoresFromServer() {
		showLoader(this.constructor.name);
		const incluscores = await HttpRequester.getHttp(INCLUSCORE_CTRL);
		hideLoader(this.constructor.name);
		this.setState({incluscores});
	}

	renderSingleIncluscore(incluscore: IncluscoreDto) {
		return (
			<>
				<td>
					{' '}
					<p> {incluscore.name} </p>{' '}
				</td>
				<td>
					{' '}
					<p> {incluscore.smallName} </p>{' '}
				</td>
				<td>
					{' '}
					<p> {incluscore.enabled ? 'Activé' : 'Non activé'} </p>{' '}
				</td>
				<td>
					{' '}
					<p> {incluscore.canBePublic ? 'Public' : <span className={'not-enabled'}>Privé</span>} </p>{' '}
				</td>
				<td>
					{' '}
					<p> {incluscore.description} </p>{' '}
				</td>
				<td>
					{!incluscore.themes
						? incluscore.themes
						: incluscore.themes.map((t, i) => {
								return (
									<p key={i} className={`${t.enabled ? '' : 'not-enabled'}`}>
										{' '}
										{t.name + ' '}{' '}
									</p>
								);
						  })}
				</td>
			</>
		);
	}

	render(): JSX.Element {
		return (
			<div className={'manage-incluscore-page'}>
				<div>
					<button
						className={'d-block btn btn-success btn-new ml-auto mr-0'}
						onClick={() =>
							this.props.history.push({
								pathname: createIncluscoreAdminPath,
							})
						}
					>
						Nouveau incluscore
					</button>
				</div>
				<table className={'admin-table'}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Small name</th>
							<th>Activé</th>
							<th>Can be public</th>
							<th>Description</th>
							<th>Themes</th>
						</tr>
					</thead>
					<tbody>
						{this.state.incluscores &&
							this.state.incluscores.length > 0 &&
							this.state.incluscores.map((incluscore: IncluscoreDto, index) => {
								const classEnabled = incluscore.enabled ? '' : 'not-enabled';
								const editUrl = `${createIncluscoreAdminPath}/${incluscore.id}`;
								return (
									<tr
										key={index}
										className={classEnabled}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl,
											})
										}
									>
										{this.renderSingleIncluscore(incluscore)}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		);
	}

	componentDidMount() {
		this.getAllIncluscoresFromServer().then();
	}
}

export default withRouter(AdminIncluscoresList);
