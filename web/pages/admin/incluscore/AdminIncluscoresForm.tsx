import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {hideLoader, showLoader} from '../../../index';
import AdminIncluscoreThemesList from './AdminIncluscoreThemesList';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveIncluscoreDto} from '../../../../server/src/incluscore/dto/creation/save.incluscore.dto';
import {createCompanyAdminPath, createIncluscoreAdminPath, incluscoreAdminPath} from '../../../routes/adminRoutes';
import {INCLUSCORE_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {ToastHelper} from '../../../basics/ToastHelper';
import {tr} from '../../../translations/TranslationsUtils';

type IProps = IRouterProps;

class AdminIncluscoresForm extends Component<IProps, IncluscoreDto> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			'name-en': '',
			'name-es': '',
			smallName: '',
			'smallName-en': '',
			'smallName-es': '',
			enabled: true,
			canBePublic: true,
			description: '',
			'description-en': '',
			'description-es': '',
			themes: [],
			isInclucard: false,
			inclucardColor: '',
			incluscoreColor: '',
			secondIncluscoreColor: '',
			displayNewStudentNumber: false,
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
		const updatedIncluscore = await HttpRequester.postHttp(INCLUSCORE_CTRL, this.state as SaveIncluscoreDto);
		this.setState({
			...updatedIncluscore,
		});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createIncluscoreAdminPath}/${updatedIncluscore.id}`);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'un incluscore </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						inputName={'name'}
						label={'Nom'}
						value={this.state.name}
						valueEn={this.state['name-en']}
						valueEs={this.state['name-es']}
						type="text"
						change={this.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						inputName={'smallName'}
						label={"Hashtag (mettre le # devant s'il le faut)"}
						value={this.state.smallName}
						valueEn={this.state['smallName-en']}
						valueEs={this.state['smallName-es']}
						type="text"
						change={this.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						inputName={'enabled'}
						label={'Activé'}
						value={this.state.enabled}
						type="checkbox"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'canBePublic'}
						label={'Public'}
						value={this.state.canBePublic}
						type="checkbox"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'description'}
						label={'Description'}
						value={this.state.description}
						valueEn={this.state['description-en']}
						valueEs={this.state['description-es']}
						type="textarea"
						change={this.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						inputName={'displayNewStudentNumber'}
						label={'Afficher le champ "Numéro d’étudiant" à l’inscription'}
						value={this.state.displayNewStudentNumber}
						type="checkbox"
						change={this.handleValue}
					/>
					<h3>Inclucard</h3>
					<BasicInput
						inputName={'isInclucard'}
						label={'Ceci est un inclucard'}
						value={this.state.isInclucard}
						type="checkbox"
						change={this.handleValue}
					/>
					<div className={'d-flex'}>
						<BasicInput
							inputName={'inclucardColor'}
							label={
								"Couleur de l'incluCard (utilisée seulement si c'est un inclucard), commencer par '#' (couleur hexadecimal)"
							}
							value={this.state.inclucardColor}
							type="text"
							change={this.handleValue}
						/>
						<div
							className={'inclucard-color-preview'}
							style={{backgroundColor: this.state.inclucardColor}}
						/>
					</div>
					<div className={'d-flex'}>
						<BasicInput
							inputName={'incluscoreColor'}
							label={
								"Couleur de l'incluscore (utilisée seulement si c'est un incluscore), commencer par '#' (couleur hexadecimal)"
							}
							value={this.state.incluscoreColor}
							type="text"
							change={this.handleValue}
						/>
						<div
							className={'incluscore-color-preview'}
							style={{backgroundColor: this.state.incluscoreColor}}
						/>
					</div>
					<div className={'d-flex'}>
						<BasicInput
							inputName={'secondIncluscoreColor'}
							label={
								"Seconde couleur de l'incluscore (utilisée seulement pour un dégradé de couleur du bouton), commencer par '#' (couleur hexadecimal)"
							}
							value={this.state.secondIncluscoreColor}
							type="text"
							change={this.handleValue}
						/>
						<div
							className={'incluscore-color-preview'}
							style={{backgroundColor: this.state.secondIncluscoreColor}}
						/>
					</div>
				</form>
				{this.state.id && <AdminIncluscoreThemesList incluscoreId={this.state.id} themes={this.state.themes} />}
			</>
		);
	}

	async componentDidMount() {
		const id = this.props.match.params.id;
		if (id) {
			const incluscore = await HttpRequester.getHttp(`${INCLUSCORE_CTRL}/${id}`);
			this.setState({...incluscore});
		}
	}
}

export default withRouter(AdminIncluscoresForm);
