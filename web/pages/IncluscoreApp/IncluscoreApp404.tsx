import * as React from 'react';
import {withRouter} from 'react-router-dom';
import Lottie from 'react-lottie';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import IncluAppHeader from './layout/IncluAppHeader';
import './IncluscoreApp404.scss';
import IncluscoreMenu from './layout/IncluscoreMenu';
import {incluscoreHomePath} from '../../routes/incluscoreAppRoutes';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import * as Sentry from '@sentry/react';
import {Translation} from 'react-i18next';

class IncluscoreApp404 extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, any> {
	render() {
		const incluscore = this.props.incluscore;
		const isInclucard = this.props.incluscore?.isInclucard;
		return (
			<>
				{incluscore && (
					<IncluscoreMenu
						isInclucard={isInclucard}
						goToMethod={(path) => this.props.incluscoreAppGoTo(path)}
					/>
				)}
				<div className={'incluscore-app not-found mt-5'}>
					<div>
						{incluscore && (
							<IncluAppHeader
								thumbnail={true}
								incluscore={incluscore}
								companyImgPath={this.props.company.imgPath}
								launch={this.props.launch}
							/>
						)}

						<div className={'lottie-container'}>
							<Lottie
								height={200}
								width={400}
								options={{
									loop: true,
									autoplay: true,
									path: '/img/lotties/incluscore404.json',
									rendererSettings: {
										preserveAspectRatio: 'xMidYMid slice',
									},
								}}
							/>
						</div>
						<p className={'c-liquorice score-title'}>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('global.notFound', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
						<button
							className={'basic-btn mt-1'}
							onClick={() => this.props.incluscoreAppGoTo(incluscoreHomePath)}
						>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('global.backToHome', {ns: 'incluscore'})}</>}
							</Translation>
						</button>
					</div>
				</div>
			</>
		);
	}

	componentDidMount() {
		Sentry.captureMessage('404 component: ' + window.location.href);
	}
}

export default withRouter(IncluscoreApp404);
