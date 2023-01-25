import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import AdminIncluscorePropositionsList from './AdminIncluscorePropositionsList';
import {QuestionDto} from '../../../../server/src/incluscore/dto/question.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveQuestionDto} from '../../../../server/src/incluscore/dto/creation/save.question.dto';
import { QUESTION_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {ToastHelper} from '../../../basics/ToastHelper';
import {createIncluscoreQuestionAdminPath} from '../../../routes/adminRoutes';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import { QUESTION_IMG_UPLOAD } from 'web/utils/FileUploaderHelper';


type IProps = IRouterProps;

class AdminIncluscoreQuestionsForm extends Component<
	IProps,
	QuestionDto & {incluscoreId: string; incluscoreThemeId: string; imgPath: string}
> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			title: '',
			'title-en': '',
			'title-es': '',
			enabled: true,
			answerExplanation: '',
			'answerExplanation-en': '',
			'answerExplanation-es': '',
			propositions: [],
			incluscoreId: '',
			incluscoreThemeId: '',
            imgPath: ""
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
		const oldId = this.state.id;
		const updatedQuestion: QuestionDto = await HttpRequester.postHttp(
			QUESTION_SCR_CTRL,
			this.state as SaveQuestionDto,
		);
		this.setState({...updatedQuestion});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			let url = `${createIncluscoreQuestionAdminPath}/${this.state.incluscoreId}`;
			url += `/theme/${this.state.incluscoreThemeId}`;
			url += `/question/${updatedQuestion.id}`;
			return this.props.history.push(url);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'une question </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						label={'Titre'}
						inputName={'title'}
						value={this.state.title}
						valueEn={this.state['title-en']}
						valueEs={this.state['title-es']}
						type="textarea"
						change={this.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						label={'Activée'}
						inputName={'enabled'}
						value={this.state.enabled}
						type="checkbox"
						change={this.handleValue}
					/>
					<BasicInput
						label={'Explication de la réponse'}
						inputName={'answerExplanation'}
						value={this.state.answerExplanation}
						valueEn={this.state['answerExplanation-en']}
						valueEs={this.state['answerExplanation-es']}
						type="textarea"
						change={this.handleValue}
						canBeTranslated={true}
					/>
                    {this.state.id && 
                        <FilePondInput
                            id={'question-img-1'}
                            loadImage={false}
                            filesPath={this.state.imgPath ? [this.state.imgPath] : []}
                            squareSideLength={400}
                            idToAssignToFilename={this.state.id}
                            apiUrl={QUESTION_IMG_UPLOAD}
                            filenameSuffix={'question-img'}
                            imageCropAspectRatio={'1:1'}
                            keepOriginalFileName={true}
                            typeOfFileExpected={'image/*'}
                            allowImagePreview
                            extraBodyParams={[
                                {
                                    key: 'idQuestion',
                                    value: this.state.id,
                                },
                            ]}
                        />
                    }  
				</form>
				{this.state.id && (
					<AdminIncluscorePropositionsList
						incluscoreId={this.state.incluscoreId}
						incluscoreThemeId={this.state.incluscoreThemeId}
						incluscoreQuestionId={this.state.id}
						propositions={this.state.propositions}
					/>
				)}
			</>
		);
	}

	async componentDidMount() {
		const {idIncluscore, idTheme, idQuestion} = this.props.match.params;
		let question: QuestionDto = {} as QuestionDto;
		if (idQuestion) {
			question = await HttpRequester.getHttp(`${QUESTION_SCR_CTRL}/${idQuestion}`);
		}
		this.setState({
			...question,
			incluscoreId: idIncluscore,
			incluscoreThemeId: idTheme,
		});
	}
}

export default withRouter(AdminIncluscoreQuestionsForm);
