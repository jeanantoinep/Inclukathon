interface IToastHelper {
	text?: string;
	duration?: number;
	destination?: string; // link to a web page
	newWindow?: boolean; // along with destination
	close?: boolean;
	gravity?: 'top' | 'bottom';
	position?: 'left' | 'center' | 'right';
	stopOnFocus?: boolean; // Prevents dismissing of toast on hover
	style?: {
		background?: string;
	};
	onClick?: () => any; // Callback after click
}

export class ToastHelper {
	public static basicConfiguration: IToastHelper = {
		duration: 2000,
		close: true,
		gravity: 'bottom',
		position: 'left',
		stopOnFocus: true,
		style: {
			background: 'linear-gradient(to right, #00b09b, #96c93d)',
		},
	};
	public static defaultSuccessText = 'Informations sauvegardées avec succès';

	public static showSuccessMessage(text = ToastHelper.defaultSuccessText) {
		window
			.Toastify({
				text,
				...ToastHelper.basicConfiguration,
			})
			.showToast();
	}

	public static showIncluscoreMsg(text = ToastHelper.defaultSuccessText) {
		window
			.Toastify({
				text,
				...ToastHelper.basicConfiguration,
				style: {
					background: 'var(--incluscore__liquorice)',
				},
			})
			.showToast();
	}
}
