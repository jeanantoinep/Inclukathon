import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import {KTH_BAI_COVER_IMG_UPLOAD, KTH_BAI_FILES_EXEMPLES_UPLOAD} from '../../../utils/FileUploaderHelper';
import {BaiDto} from '../../../../server/src/inclukathon-program/models/dto/bai.dto';
import {SaveBaiDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.bai.dto';
import {
	createCompanyAdminPath,
	createInclukathonsBaiAdminPath,
	inclukathonAdminPath,
} from '../../../routes/adminRoutes';
import {
	ADMIN_BAI_FILE_UPLOADS_CTRL,
	FILES_EXEMPLES_BAI_ENDPOINT,
	INCLUKATHON_CTRL,
} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminBaiKthForm extends Component<IProps, BaiDto> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			rubrique: '',
			imgCoverPath: '',
			filesPath: [],
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
		const idKth = this.props.match.params.idInclukathon;
		const oldId = this.state.id;
		const updatedBai: BaiDto = await HttpRequester.postHttp(INCLUKATHON_CTRL + '/bai', {
			...this.state,
			idKth,
		} as SaveBaiDto);
		this.setState({...updatedBai});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createInclukathonsBaiAdminPath}/${idKth}/bai/${this.state.id}`);
		}
	};

	renderForm() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()} key={this.state.id}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'une boîte à idée </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						inputName={'name'}
						label={'Nom'}
						value={this.state.name}
						type="text"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'rubrique'}
						label={'Rubrique'}
						value={this.state.rubrique}
						type="text"
						change={this.handleValue}
					/>
					{this.state.id && (
						<>
							<label>Couverture</label>
							<FilePondInput
								id={'bai-cover'}
								loadImage={false}
								filesPath={this.state.imgCoverPath ? [this.state.imgCoverPath] : []}
								idToAssignToFilename={this.state.id}
								apiUrl={KTH_BAI_COVER_IMG_UPLOAD}
								imageCropAspectRatio={'1:1'}
								filenameSuffix={'ktn-bai-cover'}
								stylePanelLayout={'integrated'}
								keepOriginalFileName={true}
								typeOfFileExpected={'image/*'}
								extraBodyParams={[
									{
										key: 'idBai',
										value: this.state.id,
									},
								]}
							/>
							<p>Contenu</p>
							<div className={'d-flex'}>
								<div className={'w-100'}>
									<FilePondInput
										id={'bai-files'}
										loadImage={false}
										filesPath={this.state.filesPath.map((path) => path)}
										idToAssignToFilename={this.state.id}
										apiUrl={KTH_BAI_FILES_EXEMPLES_UPLOAD}
										deleteApiUrl={ADMIN_BAI_FILE_UPLOADS_CTRL + '/' + FILES_EXEMPLES_BAI_ENDPOINT}
										filenameSuffix={'bai-files'}
										allowMultiple={true}
										typeOfFileExpected={'*'}
										keepOriginalFileName={true}
										extraBodyParams={[
											{
												key: 'idBai',
												value: this.state.id,
											},
										]}
									/>
								</div>
							</div>
						</>
					)}
				</form>
			</>
		);
	}

	render() {
		return this.renderForm();
	}

	async componentDidMount() {
		const {idBai} = this.props.match.params;
		if (idBai) {
			const bai = await HttpRequester.getHttp(`${INCLUKATHON_CTRL}/bai/${idBai}`);
			this.setState({...bai});
		}
	}
}

export default withRouter(AdminBaiKthForm);
