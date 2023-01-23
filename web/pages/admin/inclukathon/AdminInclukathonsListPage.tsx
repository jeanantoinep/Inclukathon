import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {InclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/inclukathon.dto';
import {createInclukathonsAdminPath} from '../../../routes/adminRoutes';
import {INCLUKATHON_CTRL} from '../../../../server/src/provider/routes.helper';

type IProps = IRouterProps;

class AdminInclukathonsListPage extends Component<IProps, any> {
	constructor(props) {
		super(props);
		this.state = {
			inclukathons: [],
		};
	}

	async getAllInclukathonsFromServer() {
		showLoader(this.constructor.name);
		const inclukathons: InclukathonDto[] = await HttpRequester.getHttp(INCLUKATHON_CTRL);
		hideLoader(this.constructor.name);
		this.setState({inclukathons});
	}

	renderSingleInclukathon(inclukathon: InclukathonDto) {
		return (
			<>
				<td>
					<p> {inclukathon.name} </p>
				</td>
				<td>
					<p> {inclukathon.explanation} </p>
				</td>
				<td>
					<p>
						{' '}
						{inclukathon.inProgress ? (
							'En cours'
						) : (
							<span className={'not-enabled'}> {inclukathon.notStarted ? 'Pas commencé' : 'Fini'} </span>
						)}{' '}
					</p>
				</td>
				<td>
					<p> {inclukathon.subject} </p>
				</td>
			</>
		);
	}

	render(): JSX.Element {
		return (
			<div className={'manage-inclukathon-page'}>
				<div>
					<button
						className={'d-block btn btn-success btn-new ml-auto mr-0'}
						onClick={() =>
							this.props.history.push({
								pathname: createInclukathonsAdminPath,
							})
						}
					>
						Nouveau inclukathon
					</button>
				</div>
				<table className={'admin-table'}>
					<thead>
						<tr>
							<th>Nom</th>
							<th>Explication</th>
							<th>Dates</th>
							<th>Sujet</th>
						</tr>
					</thead>
					<tbody>
						{this.state.inclukathons &&
							this.state.inclukathons.length > 0 &&
							this.state.inclukathons.map((inclukathon: InclukathonDto, index) => {
								const editUrl = `${createInclukathonsAdminPath}/${inclukathon.id}`;
								return (
									<tr
										key={index}
										className={''}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl,
											})
										}
									>
										{this.renderSingleInclukathon(inclukathon)}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		);
	}

	async componentDidMount() {
		await this.getAllInclukathonsFromServer();
	}
}

export default withRouter(AdminInclukathonsListPage);
