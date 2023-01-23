import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Component} from 'react';
import {PropositionDto} from '../../../../server/src/incluscore/dto/proposition.dto';
import {createIncluscorePropositionAdminPath} from '../../../routes/adminRoutes';

interface IAdminIncluscorePropositions extends IRouterProps {
	incluscoreId?: string;
	incluscoreThemeId?: string;
	incluscoreQuestionId?: string;
	propositions: PropositionDto[];
}

class AdminIncluscorePropositionsList extends Component<
	IAdminIncluscorePropositions,
	{propositions: PropositionDto[]}
> {
	constructor(props) {
		super(props);
		this.state = {
			propositions: this.props.propositions,
		};
	}

	renderSingleIncluscoreProposition(proposition: PropositionDto) {
		return (
			<>
				<td>
					<p> {proposition.title} </p>
				</td>
				<td>
					<p> {proposition.enabled ? 'Activée' : 'Non activée'} </p>
				</td>
				<td>
					<p> {proposition.isAGoodAnswer ? 'Oui' : 'Non'} </p>
				</td>
			</>
		);
	}

	render() {
		const creationUrl = `${createIncluscorePropositionAdminPath}/${this.props.incluscoreId}/theme/${this.props.incluscoreThemeId}/question/${this.props.incluscoreQuestionId}/proposition/`;
		return (
			<div className={'manage-incluscore-propositions-page'}>
				<div
					className={
						'd-flex justify-content-between align-items-center'
					}
				>
					<h1 className={'admin-list-titles'}>
						{' '}
						Propositions pour cette réponse{' '}
					</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() =>
							this.props.history.push({pathname: creationUrl})
						}
					>
						Nouvelle proposition
					</button>
				</div>
				{this.state.propositions && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Title</th>
								<th>Activée</th>
								<th>Bonne réponse</th>
							</tr>
						</thead>
						<tbody>
							{this.state.propositions.map(
								(incluscoreProposition, index) => {
									const classEnabled =
										incluscoreProposition.enabled
											? ''
											: 'not-enabled';
									const editUrl =
										creationUrl + incluscoreProposition.id;
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
											{this.renderSingleIncluscoreProposition(
												incluscoreProposition,
											)}
										</tr>
									);
								},
							)}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}

export default withRouter(AdminIncluscorePropositionsList);
