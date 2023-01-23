import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Component} from 'react';
import {HttpRequester} from '../../../utils/HttpRequester';
import {COMPANY_CTRL, WEBINAR_CTRL} from '../../../../server/src/provider/routes.helper';
import {WebinarDto} from '../../../../server/src/webinar/dto/webinar.dto';
import {ToastHelper} from '../../../basics/ToastHelper';
import {createWebinarAdminPath} from '../../../routes/adminRoutes';
import BasicInput from '../../../basics/BasicInput';
import {AdminValueHandler} from '../AdminValueHandler';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import {WEBINAR_VIDEO_UPLOAD} from '../../../utils/FileUploaderHelper';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';

interface IState extends WebinarDto {
	companiesAvailable: CompanyDto[];
	companyId: string;
}

type IProps = IRouterProps;

class WebinarForm extends Component<IProps, IState> {
	adminValueHandler = new AdminValueHandler(this);

	constructor(props) {
		super(props);
		this.state = {
			score: 0,
			id: undefined,
			enabled: false,
			startDate: null,
			endDate: null,
			title: '',
			'title-en': '',
			'title-es': '',
			description: '',
			'description-en': '',
			'description-es': '',
			path: '',
			company: null,
			companyId: '',
			companiesAvailable: [],
		};
	}

	handleSubmit = async () => {
		const hasToRewriteUrl = !this.state.id;
		this.setState({
			...(await HttpRequester.postHttp(WEBINAR_CTRL, {
				...this.state,
			})),
		});
		ToastHelper.showSuccessMessage();
		if (hasToRewriteUrl) {
			// rewrite url
			return this.props.history.push(`${createWebinarAdminPath}/${this.state.id}`);
		}
	};

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Webinar </h1>
					</div>
					<BasicInput
						label={'Titre'}
						inputName={'title'}
						value={this.state.title}
						valueEn={this.state['title-en']}
						valueEs={this.state['title-es']}
						type="text"
						change={this.adminValueHandler.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						label={'Activé'}
						value={this.state.enabled}
						inputName={'enabled'}
						type={'checkbox'}
						change={this.adminValueHandler.handleValue}
					/>
					{this.state.id && (
						<>
							<label className={'pointer text-bold'} htmlFor="webinar-company">
								Entreprise
							</label>
							<select
								onChange={async (e) => {
									const newCompanyId = this.state.companiesAvailable[e.target.selectedIndex].id;
									await this.adminValueHandler.handleValue(newCompanyId, 'companyId');
								}}
								className={'custom-select mr-2'}
								name="webinar-company"
								id="webinar-company"
								defaultValue={this.state.companyId}
							>
								{this.state.companiesAvailable.map((company) => {
									return (
										<option key={company.id} value={company.id}>
											{company.name}
										</option>
									);
								})}
							</select>
						</>
					)}
					<BasicInput
						label={'Date debut'}
						value={this.state.startDate || ''}
						inputName={'startDate'}
						type={'datepicker'}
						change={this.adminValueHandler.handleValue}
					/>
					<BasicInput
						label={'Date fin'}
						value={this.state.endDate || ''}
						inputName={'endDate'}
						type={'datepicker'}
						change={this.adminValueHandler.handleValue}
					/>
					<BasicInput
						label={'Description'}
						inputName={'description'}
						value={this.state.description}
						valueEn={this.state['description-en']}
						valueEs={this.state['description-es']}
						type="textarea"
						change={this.adminValueHandler.handleValue}
						canBeTranslated={true}
					/>
					<BasicInput
						label={'Score'}
						inputName={'score'}
						value={this.state.score}
						type="text"
						change={this.adminValueHandler.handleValue}
					/>
					{this.state.id && (
						<FilePondInput
							id={'webinar-video'}
							loadImage={false}
							filesPath={this.state.path ? [this.state.path] : []}
							idToAssignToFilename={this.state.id}
							apiUrl={WEBINAR_VIDEO_UPLOAD}
							filenameSuffix={'webinar-video'}
							keepOriginalFileName={true}
							typeOfFileExpected={'video/*'}
							allowImagePreview={true}
							extraBodyParams={[
								{
									key: 'idWebinar',
									value: this.state.id,
								},
							]}
						/>
					)}
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idWebinar} = this.props.match.params;
		let webinar: WebinarDto = {} as WebinarDto;
		if (idWebinar) {
			webinar = await HttpRequester.getHttp(`${WEBINAR_CTRL}/${idWebinar}`);
		}
		const companiesAvailable = await HttpRequester.getHttp(COMPANY_CTRL + '/light');
		this.setState({
			...webinar,
			companiesAvailable,
			companyId: webinar.company?.id,
		});
	}
}
export default withRouter(WebinarForm);
