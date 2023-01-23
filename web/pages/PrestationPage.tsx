import * as React from 'react';
import Page from './Page';
import {PrestationPageHandler} from './PrestationPageHandler';
import {InclukathonPageHandler} from './InclukathonPageHandler';
import {withRouter} from 'react-router-dom';

class PrestationPage extends Page<any, any> {
	inclukathonPageHandler() {
		return InclukathonPageHandler.onlyInclukathonPageContent();
	}

	prestationPageContent() {
		return PrestationPageHandler.onlyPrestationContent();
	}

	render(): JSX.Element {
		return (
			<>
				<div className={'d-block d-lg-none'}>
					{this.inclukathonPageHandler()}
				</div>
				{this.prestationPageContent()}
			</>
		);
	}

	// componentDidMount() {
	//     super.scrollToSection(this.props.location.search);
	// }
}
export default withRouter(PrestationPage);
