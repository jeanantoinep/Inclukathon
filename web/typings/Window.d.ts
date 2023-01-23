import {LoggedUserDto} from '../../server/src/user/dto/logged.user.dto';

declare global {
	interface Window {
		connectedUser: LoggedUserDto | undefined;
		analytics: SegmentAnalytics.AnalyticsJS;
		$: (...any) => any;
		FilePond: FilePond;
		FilePondPluginFileEncode: any;
		FilePondPluginFileValidateType: any;
		FilePondPluginImageExifOrientation: any;
		FilePondPluginImagePreview: any;
		FilePondPluginMediaPreview: any;
		FilePondPluginImageCrop: any;
		FilePondPluginImageResize: any;
		FilePondPluginImageTransform: any;
		FilePondPluginFileRename: any;
		FilePondPluginGetFile: any;
		rSlider: any;
		Toastify: any;
		Chart: any;
		ChartDataLabels: any;
	}

	interface FilePond {
		registerPlugin: (...any) => void;
		create: (node: HTMLInputElement, options: FilePondOptions) => any;
	}
}

interface FilePondOptions {
	disabled?: boolean;
	allowImagePreview?: boolean;
	allowFileTypeValidation?: boolean;
	allowMultiple?: boolean; // false by default
	maxFiles?: null | number;
	allowRevert?: boolean;
	allowRemove?: boolean;
	allowProcess?: boolean;
	labelIdle?: string;
	imagePreviewHeight?: string | number;
	imageCropAspectRatio?: string | '1:1';
	imageResizeTargetWidth?: string | number;
	imageResizeTargetHeight?: string | number;
	stylePanelLayout?: string | 'integrated' | 'compact' | 'circle' | 'compact circle';
	styleLoadIndicatorPosition?: string | 'center bottom';
	styleProgressIndicatorPosition?: string | 'center bottom';
	styleButtonRemoveItemPosition?: string | 'center bottom' | 'center top';
	files?: {source: string; options: {type: string | 'local'}}[];
	server?: any;
	instantUpload?: boolean;
	fileRenameFunction?: (file: any) => string;
	beforeRemoveFile?: () => boolean;
}
