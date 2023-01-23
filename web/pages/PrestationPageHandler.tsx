import * as React from 'react';
import Expertise from '../components/services/Expertise';
import Plateform from '../components/services/Plateform';
import Incluscore from '../components/services/Incluscore';
import Communication from '../components/services/Communication';

export class PrestationPageHandler {
	public static onlyPrestationContent() {
		return (
			<>
				<Expertise />
				<Plateform />
				<Incluscore />
				<Communication />
			</>
		);
	}
}
