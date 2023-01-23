import * as React from 'react';
import {withRouter} from 'react-router-dom';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import './IncluscoreAppAboutPage.scss';
import IncluscoreMenu from './layout/IncluscoreMenu';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {Translation} from 'react-i18next';

class IncluscoreAppAboutPage extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, any> {
	email = 'contact@inclusionconseil.fr';
	rs = 'Raison Sociale: Inclusion Conseil / 910 117 936 000 13 /';

	render() {
		return (
			<>
				<IncluscoreMenu isInclucard={false} goToMethod={(path) => this.props.incluscoreAppGoTo(path)} />
				<div className={'incluscore-app about-page user-select-none'}>
					<div className={'about-container'}>
						<p>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.what1', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
						<p>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.what2', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
						<h4>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.howTitle', {ns: 'incluscore'})}</>}
							</Translation>
						</h4>
						<p>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.how1', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
						<p>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.how2', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
						<h4>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('about.companyTitle', {ns: 'incluscore'})}</>}
							</Translation>
						</h4>
						<p>
							{this.rs} <a href={`mailto:${this.email}`}>{this.email}</a>
						</p>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(IncluscoreAppAboutPage);
