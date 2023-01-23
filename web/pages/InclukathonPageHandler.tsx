import * as React from 'react';
import HomePresentation from '../components/firstPage/HomePresentation';
import HomeVideo from '../components/firstPage/HomeVideo';
import HomeServices from '../components/firstPage/HomeServices';

export class InclukathonPageHandler {
	public static onlyInclukathonPageContent() {
		return (
			<>
				<HomePresentation />
				<HomeVideo />
				<HomeServices />
			</>
		);
	}
}
