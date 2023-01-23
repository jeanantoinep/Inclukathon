import * as React from 'react';
import InclusionConseil from '../components/inclusionConseil/InclusionConseil';
import HowWeAre from '../components/inclusionConseil/HowWeAre';
import Values from '../components/inclusionConseil/Values';
import Page from './Page';
import {withRouter} from 'react-router-dom';

class InclusionConseilPage extends Page<any, any> {
	render(): JSX.Element {
		return (
			<>
				<InclusionConseil />
				<HowWeAre />
				<Values />
			</>
		);
	}

	// componentDidMount() {
	//     super.scrollToSection(this.props.location.search);
	// }
}
export default withRouter(InclusionConseilPage);
