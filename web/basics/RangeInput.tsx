import {Component} from 'react';
import * as React from 'react';
import './RangeInput.scss';

interface IProps {
	id: string;
	availableValues: string[];
	onValueChange?: (string) => void;
	initialValue: string | null;
	disabled?: boolean;
}

export class RangeInput extends Component<IProps, {classForPercentageBgColor: string}> {
	readonly testLibReadyTimeout = 50;
	hasBeenMounted = false;
	hasBeenInit = false;

	constructor(props) {
		super(props);
		this.state = {
			classForPercentageBgColor: 'empty',
		};
	}

	setClassStateFromPercentage(value: string) {
		const indexOfSelectedValue = this.props.availableValues.indexOf(value);
		const unitOfPercentage = 100 / (this.props.availableValues.length - 1);
		const selectedValuePercentage = unitOfPercentage * indexOfSelectedValue;
		let classForPercentageBgColor;
		if (selectedValuePercentage <= 25) {
			classForPercentageBgColor = 'range-danger';
		} else if (selectedValuePercentage <= 50) {
			classForPercentageBgColor = 'range-warning';
		} else if (selectedValuePercentage <= 75) {
			classForPercentageBgColor = 'range-ok';
		} else {
			classForPercentageBgColor = 'range-success';
		}
		this.setState({
			classForPercentageBgColor,
		});
		if (this.hasBeenMounted && this.hasBeenInit) {
			this.props.onValueChange(value);
		}
		this.hasBeenInit = true;
	}

	initRangeSlider = () => {
		if (!this.props.availableValues) {
			return null;
		}
		if (document.querySelector('#' + this.props.id)) {
			const inputReady =
				getComputedStyle(document.querySelector('#' + this.props.id) as HTMLInputElement).width !== 'auto';
			if (inputReady) {
				return new window.rSlider({
					target: '#' + this.props.id,
					values: this.props.availableValues,
					range: false,
					disabled: this.props.disabled,
					set: [
						this.props.initialValue
							? this.props.initialValue
							: this.props.availableValues[this.props.availableValues?.length / 2],
					],
					onChange: (value) => {
						this.setClassStateFromPercentage(value);
					},
				});
			}
		}
		window.setTimeout(() => this.initRangeSlider(), this.testLibReadyTimeout);
	};

	render() {
		const {classForPercentageBgColor} = this.state;
		return (
			<div className={`range-selector-component custom-range-wrapper ${classForPercentageBgColor}`}>
				<div className={'container'}>
					<div className="slider-container">
						<input type="text" id={this.props.id} disabled={this.props.disabled} />
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.initRangeSlider();
		this.hasBeenMounted = true;
	}
}
