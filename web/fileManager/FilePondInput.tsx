import * as React from 'react';
import {Component} from 'react';
import {FilePondOptions} from '../typings/Window';
import {HttpRequester} from '../utils/HttpRequester';
import './FilePondCustomGenericStyle.scss';
import {ToastHelper} from '../basics/ToastHelper';

interface IProps extends FilePondOptions {
	id: string;
	loadImage: boolean;
	idToAssignToFilename: string;
	apiUrl: string;
	deleteApiUrl?: string;
	squareSideLength?: null | string | number;
	filenameSuffix: string;
	extraBodyParams?: {key: string; value: string}[];
	keepOriginalFileName?: boolean;
	filesPath?: string[];
	typeOfFileExpected: '*' | 'image/*' | 'video/*' | 'audio/*';
	disabled?: boolean;
	allowImagePreview?: boolean;
}

export class FilePondInput extends Component<IProps, any> {
	currentFilePondInstance = null;

	getOptions = () => {
		let files = undefined;
		if (this.props.loadImage) {
			files = [
				{
					source: this.props.idToAssignToFilename,
					options: {type: 'local'},
				},
			];
		} else if (this.props.filesPath?.length > 0) {
			files = this.props.filesPath.map((p) => ({
				source: p,
				options: {type: 'local'},
			}));
		}
		const options: FilePondOptions = {
			disabled: this.props.disabled,
			allowImagePreview:
				this.props.allowImagePreview === undefined ? !this.props.allowMultiple : this.props.allowImagePreview,
			maxFiles: 10,
			allowFileTypeValidation: this.props.typeOfFileExpected !== '*',
			allowRemove: true,
			allowMultiple: this.props.allowMultiple,
			allowRevert: false,
			allowProcess: false,
			labelIdle: `Glisser/déposer ou <span class="filepond--label-action">Charger</span>`,
			imageCropAspectRatio: this.props.imageCropAspectRatio || null,
			stylePanelLayout: this.props.stylePanelLayout || null,
			styleLoadIndicatorPosition: 'center bottom',
			styleProgressIndicatorPosition: 'center bottom',
			styleButtonRemoveItemPosition: 'center bottom',
			instantUpload: true,
			server: {
				load: this.props.apiUrl + '?load=',
				process: this.processFileUploadToServer,
			},
			fileRenameFunction: (file) => {
				if (this.props.keepOriginalFileName) {
					return file.name;
				}
				return `${this.props.idToAssignToFilename}-${this.props.filenameSuffix}${file.extension}`;
			},
			beforeRemoveFile: () =>
				confirm('Cette action est irrevocable, confirmez vous vouloir supprimer ce fichier ?'),
		};
		if (this.props.squareSideLength) {
			options.imagePreviewHeight = this.props.squareSideLength;
			options.imageResizeTargetHeight = this.props.squareSideLength;
			options.imageResizeTargetWidth = this.props.squareSideLength;
		}
		if (files) {
			options['files'] = files;
		}
		return options;
	};

	registerNeededPlugins = () => {
		window.FilePond.registerPlugin(
			window.FilePondPluginFileEncode,
			window.FilePondPluginFileValidateType,
			window.FilePondPluginImageExifOrientation,
			window.FilePondPluginImagePreview,
			window.FilePondPluginMediaPreview,
			window.FilePondPluginImageCrop,
			window.FilePondPluginImageResize,
			window.FilePondPluginImageTransform,
			window.FilePondPluginFileRename,
			window.FilePondPluginGetFile,
		);
	};

	bindFilePondToImgInput = () => {
		const options = this.getOptions();
		this.currentFilePondInstance = window.FilePond.create(
			document.querySelector('input#filepond-' + this.props.id),
			options,
		);
		this.currentFilePondInstance.on('addfilestart', this.onAddfilestart);
		this.currentFilePondInstance.on('removefile', this.onRemoveFile);
		this.currentFilePondInstance.on('processfile', this.onAddedOrRemovedFileEnded);
	};

	processFileUploadToServer = (fieldName, file, metadata, load, error, progress, abort) => {
		const formData = new FormData();
		formData.append('idToAssignToFilename', this.props.idToAssignToFilename);
		formData.append('unixTime', new Date().getTime().toString());
		if (this.props.extraBodyParams?.length > 0) {
			for (const keyValue of this.props.extraBodyParams) {
				formData.append(keyValue.key, keyValue.value);
			}
		}
		formData.append(fieldName, file, file.name);
		const request = new XMLHttpRequest();
		request.open('POST', this.props.apiUrl);
		request.upload.onprogress = (e) => {
			progress(e.lengthComputable, e.loaded, e.total);
		};
		request.onload = function () {
			if (request.status >= 200 && request.status < 300) {
				load(request.responseText);
			} else {
				error('Un error occurred');
			}
		};
		request.send(formData);
		return {
			abort: () => {
				request.abort();
				abort();
			},
		};
	};

	onAddedOrRemovedFileEnded = () => {
		ToastHelper.showSuccessMessage();
	};

	/**
	 * remove previous before adding new one, if same file name and extension (replace a file by uploading one with same name)
	 * @param newFile
	 */
	onAddfilestart = (newFile) => {
		// ignore init(), replace only when user upload files
		if (newFile.origin !== (window.FilePond as any).FileOrigin.INPUT) {
			return;
		}
		for (const file of this.currentFilePondInstance.getFiles()) {
			if (file.id === newFile.id) {
				continue;
			}
			// good to know => plugin has trouble with jpeg but not jpg
			const jpgFiles =
				(file.fileExtension === 'jpeg' && newFile.fileExtension === 'jpg') ||
				(file.fileExtension === 'jpg' && newFile.fileExtension === 'jpeg');
			if (
				file.filename === newFile.filename ||
				(jpgFiles && file.filenameWithoutExtension === newFile.filenameWithoutExtension)
			) {
				this.currentFilePondInstance.removeFile(file.id);
			}
		}
	};

	/**
	 * Remove not handled by Filepond natively
	 * @param error
	 * @param file
	 */
	onRemoveFile = async (error, file) => {
		const paramsObj = {};
		for (const keyValue of this.props.extraBodyParams) {
			paramsObj[keyValue.key] = keyValue.value;
		}
		await HttpRequester.deleteHttp(this.props.deleteApiUrl, {
			filename: file.filename,
			...paramsObj,
		});
	};

	render() {
		return (
			<div
				style={{
					height: `${this.props.squareSideLength}px`,
					width: `${this.props.squareSideLength}px`,
				}}
				className={'m-auto'}
			>
				<input
					type="file"
					id={'filepond-' + this.props.id}
					className="filepond"
					name="filepond"
					accept={this.props.typeOfFileExpected}
				/>
			</div>
		);
	}

	componentDidMount() {
		this.registerNeededPlugins();
		this.bindFilePondToImgInput();
	}
}
