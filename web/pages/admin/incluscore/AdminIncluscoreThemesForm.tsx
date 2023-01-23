import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import AdminIncluscoreQuestionsList from './AdminIncluscoreQuestionsList';
import {ThemeDto} from '../../../../server/src/incluscore/dto/theme.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveThemeDto} from '../../../../server/src/incluscore/dto/creation/save.theme.dto';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import {THEME_LOGO_1_UPLOAD, THEME_LOGO_2_UPLOAD, THEME_LOGO_3_UPLOAD} from '../../../utils/FileUploaderHelper';
import {INCLUKATHON_COMPANY_LOGO_WIDTH} from '../company/AdminCompaniesForm';
import {INCLUSCORE_CTRL, THEME_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {createIncluscoreThemeAdminPath} from '../../../routes/adminRoutes';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminIncluscoreThemesForm extends Component<IProps, ThemeDto & {incluscore: IncluscoreDto}> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			['name-en']: '',
			['name-es']: '',
			enabled: true,
			imgPath: '',
			imgPath2: '',
			imgPath3: '',
			questions: [],
			incluscore: undefined,
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
		const updatedTheme = await HttpRequester.postHttp(THEME_SCR_CTRL, {
			...this.state,
			incluscoreId: this.state.incluscore.id,
		} as SaveThemeDto);
		this.setState({
			...updatedTheme,
		});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createIncluscoreThemeAdminPath}/${this.state.incluscore.id}/theme/${updatedTheme.id}`,
			);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'un theme </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						label={'Nom'}
						inputName={'name'}
						value={this.state.name}
						valueEn={this.state['name-en']}
						valueEs={this.state['name-es']}
						type="text"
						change={this.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						label={'Activé'}
						inputName={'enabled'}
						value={this.state.enabled}
						type="checkbox"
						change={this.handleValue}
					/>
					<div className={'d-flex'}>
						<div className={'d-flex mr-3'}>
							{this.state.id && (
								<FilePondInput
									id={'theme-logo-1'}
									loadImage={false}
									filesPath={this.state.imgPath ? [this.state.imgPath] : []}
									squareSideLength={INCLUKATHON_COMPANY_LOGO_WIDTH}
									idToAssignToFilename={this.state.id}
									apiUrl={THEME_LOGO_1_UPLOAD}
									filenameSuffix={'theme-picture'}
									imageCropAspectRatio={'1:1'}
									keepOriginalFileName={true}
									typeOfFileExpected={'image/*'}
									extraBodyParams={[
										{
											key: 'idTheme',
											value: this.state.id,
										},
									]}
								/>
							)}
						</div>
						{this.state.incluscore?.isInclucard && (
							<>
								<div className={'d-flex mr-3'}>
									{this.state.id && (
										<FilePondInput
											id={'theme-logo-2'}
											loadImage={false}
											filesPath={this.state.imgPath2 ? [this.state.imgPath2] : []}
											squareSideLength={INCLUKATHON_COMPANY_LOGO_WIDTH}
											idToAssignToFilename={this.state.id}
											apiUrl={THEME_LOGO_2_UPLOAD}
											filenameSuffix={'theme-picture-2'}
											imageCropAspectRatio={'1:1'}
											keepOriginalFileName={true}
											typeOfFileExpected={'image/*'}
											extraBodyParams={[
												{
													key: 'idTheme',
													value: this.state.id,
												},
											]}
										/>
									)}
								</div>
								<div className={'d-flex mr-3'}>
									{this.state.id && (
										<FilePondInput
											id={'theme-logo-3'}
											loadImage={false}
											filesPath={this.state.imgPath3 ? [this.state.imgPath3] : []}
											squareSideLength={INCLUKATHON_COMPANY_LOGO_WIDTH}
											idToAssignToFilename={this.state.id}
											apiUrl={THEME_LOGO_3_UPLOAD}
											filenameSuffix={'theme-picture-3'}
											imageCropAspectRatio={'1:1'}
											keepOriginalFileName={true}
											typeOfFileExpected={'image/*'}
											extraBodyParams={[
												{
													key: 'idTheme',
													value: this.state.id,
												},
											]}
										/>
									)}
								</div>
							</>
						)}
					</div>
				</form>
				{this.state.id && (
					<AdminIncluscoreQuestionsList
						incluscoreId={this.state.incluscore.id}
						incluscoreThemeId={this.state.id}
						questions={this.state.questions}
					/>
				)}
			</>
		);
	}

	async componentDidMount() {
		const {idIncluscore, idTheme} = this.props.match.params;
		const incluscore = await HttpRequester.getHttp(`${INCLUSCORE_CTRL}/${idIncluscore}`);
		let theme: ThemeDto = {} as ThemeDto;
		if (idTheme) {
			theme = await HttpRequester.getHttp(`${THEME_SCR_CTRL}/${idTheme}`);
		}
		this.setState({...theme, incluscore});
	}
}

export default withRouter(AdminIncluscoreThemesForm);
