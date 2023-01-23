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

type IProps = IRouterProps;

class AdminIncluscorePropositionsForm extends Component<
	IProps,
	PropositionDto & {
		incluscoreId: string;
		incluscoreThemeId: string;
		incluscoreQuestionId: string;
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
			incluscoreQuestionId: undefined,
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

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'une proposition </h1>
					</div>
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
