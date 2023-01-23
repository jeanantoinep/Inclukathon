import {Component} from 'react';

class Page<P, S> extends Component<P, S> {
	public static scrollToParamName = '?scroll-to=';

	public static scrollToSection(search: string) {
		setTimeout(() => {
			const moveTo = search.split('#')[1];
			const scrollTo =
				moveTo && moveTo.length > 0
					? moveTo
					: search.split(Page.scrollToParamName)[1];
			if (scrollTo) {
				const moveToElement = document.getElementById(
					scrollTo,
				) as HTMLElement;
				moveToElement &&
					window.scrollTo({
						top: moveToElement.offsetTop - 150,
						behavior: 'smooth',
					});
			}
		}, 300);
	}
}

export default Page;
