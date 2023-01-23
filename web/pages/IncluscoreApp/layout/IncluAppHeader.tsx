import * as React from 'react';
import {Component} from 'react';
import IncluscoreCounter from './IncluscoreCounter';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {tr} from '../../../translations/TranslationsUtils';
import './IncluAppHeader.scss';

interface IncluAppHeaderProps {
	incluscore: IncluscoreDto;
	companyImgPath: string;
	thumbnail?: boolean;
	hideScoreCounter?: boolean;
	launch: LaunchIncluscoreDto;
	isThemesPage?: boolean;
}

export default class IncluAppHeader extends Component<IncluAppHeaderProps, any> {
	showHashtag() {
		return (
			<h1
				className={`title hashtag-text align-center ${this.getHideOnMobileIfIsThumbnail()} ${this.getSmallNameColor()}`}
			>
				{tr(this.props.incluscore, 'smallName')}
			</h1>
		);
	}

	showScore() {
		if (this.props.hideScoreCounter) {
			return null;
		}
		return <IncluscoreCounter isThumbnail={true} incluscore={this.props.incluscore} launch={this.props.launch} />;
	}

	showIncluscoreLogo() {
		return (
			<img
				draggable={false}
				className={`incluscore-home-illustration ${this.getHideOnMobileIfIsThumbnail()} ${this.getInclucardClass()}`}
				src={
					this.props.incluscore.isInclucard
						? '/img/incluscore-app/inclucard-logo.svg'
						: '/img/incluscore-app/incluscore-logo.svg'
				}
				alt={'incluscore-home-illustration'}
			/>
		);
	}

	showCompanyLogo() {
		return (
			<img
				draggable={false}
				className={`incluscore-home-company-logo ${this.getHideOnMobileIfIsThumbnail()} ${this.getInclucardClass()}`}
				src={'/company-logo/' + this.props.companyImgPath}
				alt={'company logo'}
			/>
		);
	}

	getHideOnMobileIfIsThumbnail = () => (this.props.thumbnail ? 'hide-on-mobile' : '');

	getSmallNameColor = () => (!this.props.incluscore.isInclucard ? 'c-sc' : '');

	getIncluscoreThumbnailClass = () => (this.props.thumbnail ? 'incluscore-thumbnail' : '');

	getInclucardClass = () => (this.props.incluscore.isInclucard ? 'is-inclucard' : '');

	renderThumbnail() {
		if (!this.props.thumbnail) {
			return null;
		}
		return (
			<div className={'is-thumbnail'}>
				{this.showIncluscoreLogo()}
				{this.showHashtag()}
				{this.showCompanyLogo()}
				{this.showScore()}
			</div>
		);
	}

	renderHomeLogos() {
		if (this.props.thumbnail) {
			return null;
		}
		return (
			<div className={`is-home ${this.props.isThemesPage ? 'is-themes-page' : ''}`}>
				{this.showIncluscoreLogo()}
				{this.showHashtag()}
				{this.showCompanyLogo()}
			</div>
		);
	}

	render() {
		if (!this.props.incluscore) {
			return null;
		}
		return (
			<div className={`incluscore-app-header-component ${this.getIncluscoreThumbnailClass()}`}>
				<div className={`header-items-flexible-container ${this.getInclucardClass()}`}>
					{this.renderThumbnail()}
					{this.renderHomeLogos()}
				</div>
			</div>
		);
	}
}
