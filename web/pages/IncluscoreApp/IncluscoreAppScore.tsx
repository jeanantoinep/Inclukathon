import * as React from 'react';
import {withRouter} from 'react-router-dom';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import IncluAppHeader from './layout/IncluAppHeader';
import './IncluscoreAppScore.scss';
import IncluscoreCounter from './layout/IncluscoreCounter';
import IncluscoreMenu from './layout/IncluscoreMenu';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {inclucardQuestionsPath, incluscoreThemesPath} from '../../routes/incluscoreAppRoutes';
import i18n from '../../i18n';

class IncluscoreAppScore extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, any> {
	themesPath = this.props.incluscore.isInclucard ? inclucardQuestionsPath : incluscoreThemesPath;

	render() {
		const incluscore = this.props.incluscore;
		const isInclucard = this.props.incluscore.isInclucard;
		return (
			<>
				<IncluscoreMenu isInclucard={isInclucard} goToMethod={(path) => this.props.incluscoreAppGoTo(path)} />
				<div className={`incluscore-app score ${isInclucard ? 'is-inclucard' : ''}`}>
					{!isInclucard && (
						<IncluAppHeader
							thumbnail={true}
							incluscore={incluscore}
							hideScoreCounter={true}
							companyImgPath={this.props.company.imgPath}
							launch={this.props.launch}
						/>
					)}
					<IncluscoreCounter isThumbnail={false} incluscore={incluscore} launch={this.props.launch} />
					<button className={'basic-btn mt-3'} onClick={() => this.props.incluscoreAppGoTo(this.themesPath)}>
						{isInclucard
							? i18n.t('back.ask', {ns: 'inclucard'})
							: i18n.t('back.themes', {ns: 'incluscore'})}
					</button>
				</div>
			</>
		);
	}
}

export default withRouter(IncluscoreAppScore);
