import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ThemeDto} from '../../../../server/src/incluscore/dto/theme.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {createIncluscoreThemeAdminPath} from '../../../routes/adminRoutes';
import {THEME_SCR_CTRL} from '../../../../server/src/provider/routes.helper';

library.add(faTrash);

interface IAdminIncluscoreThemes extends IRouterProps {
	incluscoreId?: string;
	themes: ThemeDto[];
}

class AdminIncluscoreThemesList extends Component<IAdminIncluscoreThemes, any> {
	constructor(props) {
		super(props);
		this.state = {
			themes: this.props.themes,
		};
	}

	removeIncluscoreTheme = async (e, incluscoreTheme: ThemeDto) => {
		e.stopPropagation();
		if (
			!window.confirm(
				`Supprimer définitivement le theme ${incluscoreTheme.name} et ses informations ?`,
			)
		) {
			return;
		}
		const themes = await HttpRequester.deleteHttp(THEME_SCR_CTRL, {
			idIncluscore: this.props.incluscoreId,
			idTheme: incluscoreTheme.id,
		});
		this.setState({themes});
	};

	renderSingleIncluscoreTheme(incluscoreTheme: ThemeDto) {
		if (!incluscoreTheme) {
			return null;
		}
		return (
			<>
				<td>
					<img
						className={'d-block m-auto w-50'}
						alt={'logo'}
						src={'/themes-logo/' + incluscoreTheme.imgPath}
					/>
				</td>
				<td>
					<p> {incluscoreTheme.name} </p>
				</td>
				<td>
					<p> {incluscoreTheme.enabled ? 'Activé' : 'Non activé'} </p>
				</td>
				<td>
					<p> {incluscoreTheme.imgPath} </p>
				</td>
				<td>
					{!incluscoreTheme.questions
						? 'Aucune questions'
						: incluscoreTheme.questions.map((q, i) => (
								<p key={i}> {q.title + ' '} </p>
						  ))}
				</td>
				<td>
					<FontAwesomeIcon
						icon={['fas', 'trash']}
						onClick={(e) =>
							this.removeIncluscoreTheme(e, incluscoreTheme)
						}
					/>
				</td>
			</>
		);
	}

	render() {
		const creationUrl = `${createIncluscoreThemeAdminPath}/${this.props.incluscoreId}/theme/`;
		return (
			<div className={'manage-incluscore-themes-page'}>
				<div
					className={
						'd-flex w-100 justify-content-between align-items-center'
					}
				>
					<h1 className={'admin-list-titles'}>
						{' '}
						Themes de l'incluscore{' '}
					</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() =>
							this.props.history.push({pathname: creationUrl})
						}
					>
						Nouveau theme
					</button>
				</div>

				{this.state.themes && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Logo</th>
								<th>Nom</th>
								<th>Activé</th>
								<th>Image</th>
								<th>Questions</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.state.themes.map((incluscoreTheme, index) => {
								const classEnabled = incluscoreTheme.enabled
									? ''
									: 'not-enabled';
								const editUrl =
									creationUrl + incluscoreTheme.id;
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
										{this.renderSingleIncluscoreTheme(
											incluscoreTheme,
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}

export default withRouter(AdminIncluscoreThemesList);
