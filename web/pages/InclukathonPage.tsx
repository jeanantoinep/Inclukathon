import * as React from 'react';
import Page from './Page';
import {PrestationPageHandler} from './PrestationPageHandler';
import {InclukathonPageHandler} from './InclukathonPageHandler';
import {withRouter} from 'react-router-dom';

class InclukathonPage extends Page<any, any> {
	inclukathonPageHandler() {
		return InclukathonPageHandler.onlyInclukathonPageContent();
	}

	prestationPageContent() {
		return PrestationPageHandler.onlyPrestationContent();
	}

	render(): JSX.Element {
		return (
			<>
				{this.inclukathonPageHandler()}
				<div className={'d-block d-lg-none'}>
					{this.prestationPageContent()}
				</div>
			</>
		);
	}
}

export default withRouter(InclukathonPage);
