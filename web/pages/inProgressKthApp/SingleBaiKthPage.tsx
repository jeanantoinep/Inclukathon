import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import {BaiDto} from '../../../server/src/inclukathon-program/models/dto/bai.dto';
import {KTH_BAI_FILES_EXEMPLES_UPLOAD} from '../../utils/FileUploaderHelper';
import {FilePondInput} from '../../fileManager/FilePondInput';

export default class SingleBaiKthPage extends Component<InProgressKthWrapperProps, any> {
	singleBai: BaiDto = this.props.inclukathon.bai.find((b) => b.id === this.props.match.params['idBai']);

	render() {
		return (
			<div id={'single-bai-page'}>
				<p>{this.singleBai.name}</p>
				<p>{this.singleBai.rubrique}</p>
				<FilePondInput
					disabled={true}
					id={'single-bai-files'}
					loadImage={false}
					filesPath={this.singleBai.filesPath.map((path) => path)}
					idToAssignToFilename={this.singleBai.id}
					apiUrl={KTH_BAI_FILES_EXEMPLES_UPLOAD}
					filenameSuffix={'single-bai'}
					allowMultiple={true}
					typeOfFileExpected={'*'}
					keepOriginalFileName={true}
				/>
			</div>
		);
	}
}
