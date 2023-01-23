import * as React from 'react';
import PageNotFound from '../pages/PageNotFound';
import {isProd} from '../index';

export class ErrorBoundary extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {hasError: false, error: null, info: null};
	}

	componentDidCatch(error, info) {
		this.setState({hasError: true, error: error, info: info});
	}

	traceErr = () => {
		return (
			<>
				{!isProd && (
					<div className={'w-50 m-auto'}>
						<p>{`${this.state.error.name} : ${this.state.error.message}`}</p>
						<pre>
							<code>{this.state.error.stack}</code>
						</pre>
					</div>
				)}
			</>
		);
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className={'error-container m-3'}>
					<h1 className={'text-center'}>Oups...</h1>
					{this.traceErr()}
					<div className={'w-25 m-auto'}>
						<PageNotFound isErrorPage={true} />
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
