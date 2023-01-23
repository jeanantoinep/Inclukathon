import {overlayScrollBodyInstance} from '../App';

export class OnScrollHelper {
	public static onScrollToElement(targetElement: string, callback: any | null) {
		const elements = document.querySelectorAll(targetElement) as NodeListOf<HTMLElement>;
		for (const element of elements) {
			// document.body.scrollTop is usually equal to 0
			const elementTop = element.getBoundingClientRect().top + document.body.scrollTop;
			const elementHeight = element.offsetHeight;
			const windowHeight = window.innerHeight;
			const windowScrollY = overlayScrollBodyInstance?.scroll()?.position?.y;
			if (callback && windowScrollY > elementTop + elementHeight - windowHeight) {
				callback(element);
			}
		}
	}
}

export class Animations {
	public static flipXOnElementVisible(targetElement: string) {
		OnScrollHelper.onScrollToElement(targetElement, (eachElement: HTMLElement) => {
			eachElement.classList.add('animate__animated', 'animate__flipInX');
		});
	}
}
