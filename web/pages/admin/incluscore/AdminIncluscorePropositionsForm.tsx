import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {hideLoader, showLoader} from '../../../index';
import {PropositionDto} from '../../../../server/src/incluscore/dto/proposition.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SavePropositionDto} from '../../../../server/src/incluscore/dto/creation/save.proposition.dto';
import {PROPOSITION_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {createCompanyAdminPath, createIncluscorePropositionAdminPath} from '../../../routes/adminRoutes';
import {ToastHelper} from '../../../basics/ToastHelper';
import { FilePondInput } from 'web/fileManager/FilePondInput';
import { THEME_LOGO_1_UPLOAD } from 'web/utils/FileUploaderHelper';
import { ANSWER_IMG_UPLOAD } from 'web/utils/FileUploaderHelper';
import { AlertUpdateOnlyFields } from 'web/basics/Alerts/AlertUpdateOnlyFields';

type IProps = IRouterProps;

class AdminIncluscorePropositionsForm extends Component<
	IProps,
	PropositionDto & {
		incluscoreId: string;
		incluscoreThemeId: string;
		incluscoreQuestionId: string;
    imgPath: string;
    selectedAnswer: PropositionDto;

	}
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
			isAGoodAnswer: false,
			incluscoreId: undefined,
			incluscoreThemeId: undefined,
      selectedAnswer: undefined,
			incluscoreQuestionId: undefined,
      imgPath: ''
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
		const updatedProposition: PropositionDto = await HttpRequester.postHttp(
			PROPOSITION_SCR_CTRL,
			this.state as SavePropositionDto,
		);
		this.setState({...updatedProposition});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			let url = `${createIncluscorePropositionAdminPath}/${this.state.incluscoreId}`;
			url += `/theme/${this.state.incluscoreThemeId}`;
			url += `/question/${this.state.incluscoreQuestionId}`;
			url += `/proposition/${updatedProposition.id}`;
			return this.props.history.push(url);
		}
	};
  showQuestionMedia() {
    const mediaPath = this.state.selectedAnswer.imgPath;

    if (mediaPath.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return (
            <img
                draggable={false}
                src={'/answer-img/' + this.state.selectedAnswer.imgPath}
                alt={'answer media'}
                style={{width: "65%", marginTop: "2%", marginBottom: "2%"}}
      />
        );
        }
    }

	render() {

		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'une proposition </h1>
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
          {this.state.id && (
								<FilePondInput
                id={'answer-img'}
                loadImage={false}
                filesPath={this.state.imgPath ? [this.state.imgPath] : []}
                squareSideLength={300}
                idToAssignToFilename={this.state.id}
                apiUrl={ANSWER_IMG_UPLOAD}
                filenameSuffix={'answer-img'}
                imageCropAspectRatio={'1:1'}
                keepOriginalFileName={true}
                typeOfFileExpected={'*'}
                deleteApiUrl={'file-uploads/proposition/img/'}
                allowImagePreview
                extraBodyParams={[
                    {
                        key: 'idProposition',
                        value: this.state.id,
                    },
                ]}

								/>
							)}
          <BasicInput
						label={'Activée'}
						inputName={'enabled'}
						value={this.state.enabled}
						type="checkbox"
						change={this.handleValue}
					/>

					<BasicInput
						label={'Bonne réponse'}
						inputName={'isAGoodAnswer'}
						value={this.state.isAGoodAnswer}
						type="checkbox"
						change={this.handleValue}
					/>
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idIncluscore, idTheme, idQuestion, idProposition} = this.props.match.params;
		let proposition: PropositionDto = {} as PropositionDto;
		if (idProposition) {
			proposition = await HttpRequester.getHttp(`${PROPOSITION_SCR_CTRL}/${idProposition}`);
		}
		this.setState({
			...proposition,
			incluscoreId: idIncluscore,
			incluscoreThemeId: idTheme,
			incluscoreQuestionId: idQuestion,
		});
	}
}

export default withRouter(AdminIncluscorePropositionsForm);
