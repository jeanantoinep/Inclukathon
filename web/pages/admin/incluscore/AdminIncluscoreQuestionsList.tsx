import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {QuestionDto} from '../../../../server/src/incluscore/dto/question.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {createIncluscoreQuestionAdminPath} from '../../../routes/adminRoutes';
import {QUESTION_SCR_CTRL} from '../../../../server/src/provider/routes.helper';

library.add(faTrash);

interface IAdminIncluscoreQuestions extends IRouterProps {
	incluscoreId?: string;
	incluscoreThemeId?: string;
	questions: QuestionDto[];
}

interface IState {
	questions: QuestionDto[];
}

class AdminIncluscoreQuestionsList extends Component<
	IAdminIncluscoreQuestions,
	IState
> {
	constructor(props) {
		super(props);
		this.state = {
			questions: this.props.questions,
		};
	}

	removeIncluscoreQuestion = async (e, incluscoreQuestion: QuestionDto) => {
		e.stopPropagation();
		if (
			!window.confirm(
				'Supprimer définitivement la question et ses propositions ?',
			)
		) {
			return;
		}
		const questions = await HttpRequester.deleteHttp(QUESTION_SCR_CTRL, {
			idQuestion: incluscoreQuestion.id,
			idTheme: this.props.incluscoreThemeId,
		});
		this.setState({questions});
	};

	renderSingleIncluscoreQuestion(incluscoreQuestion: QuestionDto) {
		return (
			<>
				<td>
					<p> {incluscoreQuestion.title} </p>
				</td>
				<td>
					<p>
						{' '}
						{incluscoreQuestion.enabled
							? 'Activée'
							: 'Non activé'}{' '}
					</p>
				</td>
				<td>
					<p> {incluscoreQuestion.answerExplanation} </p>
				</td>
				<td>
					{!incluscoreQuestion.propositions
						? incluscoreQuestion.propositions
						: incluscoreQuestion.propositions.map((p, i) => {
								return (
									<p key={i}>
										{p.isAGoodAnswer && p.enabled ? (
											<span className={'good-answer'}>
												{' '}
												{p.title + ' '}{' '}
											</span>
										) : (
											<span
												className={`${
													p.enabled
														? ''
														: 'not-enabled'
												}`}
											>
												{' '}
												{p.title + ' '}{' '}
											</span>
										)}
									</p>
								);
						  })}
				</td>
				<td>
					<FontAwesomeIcon
						icon={['fas', 'trash']}
						onClick={(e) =>
							this.removeIncluscoreQuestion(e, incluscoreQuestion)
						}
					/>
				</td>
			</>
		);
	}

	render() {
		const creationUrl = `${createIncluscoreQuestionAdminPath}/${this.props.incluscoreId}/theme/${this.props.incluscoreThemeId}/question/`;
		return (
			<div className={'manage-incluscore-questions-page'}>
				<div
					className={
						'd-flex justify-content-between align-items-center'
					}
				>
					<h1 className={'admin-list-titles'}>
						{' '}
						Questions du theme{' '}
					</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() =>
							this.props.history.push({pathname: creationUrl})
						}
					>
						Nouvelle question
					</button>
				</div>
				{this.state.questions && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Title</th>
								<th>Activée</th>
								<th>Answer explanation</th>
								<th>Propositions</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.questions.map(
								(incluscoreQuestion, index) => {
									const editUrl =
										creationUrl + incluscoreQuestion.id;
									const classEnabled =
										incluscoreQuestion.enabled
											? ''
											: 'not-enabled';
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
											{this.renderSingleIncluscoreQuestion(
												incluscoreQuestion,
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

export default withRouter(AdminIncluscoreQuestionsList);
