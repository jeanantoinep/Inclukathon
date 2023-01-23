import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import {BaiDto} from '../../../server/src/inclukathon-program/models/dto/bai.dto';
import './BaiKthPage.scss';
import {singleBaiKthPath} from '../../routes/inProgressInclukathonAppRoutes';

export default class BaiKthPage extends Component<InProgressKthWrapperProps, any> {
	goToSingleBaiPage = (idBai) => {
		this.props.history.push(singleBaiKthPath + '/' + idBai);
	};

	renderSingleBai(bai: BaiDto) {
		return (
			<div
				className={'common-kth-square single-bai-square pointer'}
				key={bai.id}
				onClick={() => this.goToSingleBaiPage(bai.id)}
			>
				<div className={'empty-div-for-1-1-ratio'} />
				<div className={'sub-div-for-1-1-ratio-content'}>
					<img
						className={'common-cover-img bai-cover-img'}
						alt={'cover'}
						src={`/bai-cover/${bai.imgCoverPath}`}
					/>
					<div className={'square-content'}>
						<p>{bai.name}</p>
						<p>{bai.rubrique}</p>
					</div>
				</div>
			</div>
		);
	}

	render() {
		const baiList = this.props.inclukathon.bai;
		return (
			<div id={'bai-page'} className={'common-list-page-style'}>
				{baiList.map((bai) => this.renderSingleBai(bai))}
			</div>
		);
	}
}
