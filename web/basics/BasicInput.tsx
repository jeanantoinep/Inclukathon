import * as React from 'react';
import {Component} from 'react';
import classNames from 'classnames/bind';
import {DateTimeHelper} from '../../server/src/helper/DateTimeHelper';
import {IDatepicker, IEventDatepicker} from '../typings/datepicker';
import {ILang} from '../../server/src/translations/LangUtils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {HttpRequester} from '../utils/HttpRequester';
import {TRANSLATION_CTRL} from '../../server/src/provider/routes.helper';
library.add(faLanguage);

interface IBasicInputProps {
	value: any;
	valueEn?: any;
	valueEs?: any;
	id?: string;
	inputName: string;
	label?: string; // if none, we use inputName
	type: 'checkbox' | 'radio' | 'text' | 'email' | 'textarea' | 'password' | 'datepicker';
	change: (e: any, key: string) => void;
	disabled?: boolean;
	extraInputClass?: string;
	onKeyPress?: (event: any) => void;
	canBeTranslated?: boolean;
}

interface IState {
	value: any;
	valueEn?: any;
	valueEs?: any;
}

export default class BasicInput extends Component<IBasicInputProps, IState> {
	constructor(props: IBasicInputProps) {
		super(props);
		this.state = {
			value: this.props.value,
			valueEn: this.props.valueEn,
			valueEs: this.props.valueEs,
		};
	}

	id = this.props.id || this.props.inputName;
	labelDisplayed = this.props.label || this.props.inputName;
	isCheckInput = ['checkbox', 'radio'].indexOf(this.props.type) > -1;
	isDatepicker = ['datepicker'].indexOf(this.props.type) > -1;
	isTextarea = ['textarea'].indexOf(this.props.type) > -1;
	inputType = this.isDatepicker ? 'text' : this.props.type;

	showLabel = (lang?: ILang) => {
		const labelClasses = classNames('pointer text-bold', {
			'form-check-label': this.isCheckInput,
		});
		return (
			<label className={labelClasses} htmlFor={`${this.id}${lang ? '-' + lang : ''}`}>
				{this.labelDisplayed}
				{lang ? ' ' + lang : ''}
			</label>
		);
	};

	getSimpleDatepickerOptions = (): IDatepicker => {
		return {
			autoclose: true,
			language: 'fr',
			format: DateTimeHelper.defaultDatePickerFormat,
			todayHighlight: true,
			todayBtn: 'linked',
		};
	};

	initDatepicker = () => {
		const jQuery = window.$;
		const inputDom = jQuery(`input[name='${this.props.inputName}']`);
		if (this.isDatepicker) {
			inputDom.datepicker(this.getSimpleDatepickerOptions()).on('changeDate', (event: IEventDatepicker) => {
				this.props.change(DateTimeHelper.toDateTime(event.date, true), this.props.inputName);
			});
			// force initial update as it seems to be needed
			inputDom.datepicker('update', DateTimeHelper.toJsDate(this.props.value));
		}
	};

	setInitialInputValue = () => {
		this.setState({
			value: this.isDatepicker ? DateTimeHelper.formatWithDateOnly(this.props.value) : this.props.value,
		});
		if (this.props.canBeTranslated) {
			this.setState({
				valueEn: this.props.valueEn,
				valueEs: this.props.valueEs,
			});
		}
		this.initDatepicker();
	};

	/**
	 * Check box / Radio box
	 */
	renderCheckbox() {
		return (
			<div className={'form-check'}>
				<input
					key={this.props.inputName + this.state.value}
					className="form-check-input pointer"
					type={this.inputType}
					id={this.id}
					disabled={this.props.disabled}
					name={this.props.inputName}
					defaultChecked={this.state.value}
					onChange={(event) => {
						const newValue = this.inputType === 'radio' ? event.target.id : event.target.checked;
						this.setState({value: newValue});
						this.props.change(newValue, this.props.inputName);
					}}
				/>
				{this.showLabel()}
			</div>
		);
	}

	/**
	 * TextInput
	 * @param lang to be translated, when its a text shown to users
	 */
	renderTextInput(lang?: ILang) {
		let valueTranslationSuffix = '';
		if (lang === ILang.EN) {
			valueTranslationSuffix = 'En';
		} else if (lang === ILang.ES) {
			valueTranslationSuffix = 'Es';
		}
		const id = `${this.id}${lang ? '-' + lang : ''}`;
		const inputName = `${this.props.inputName}${lang ? '-' + lang : ''}`;
		return (
			<div className={'w-100'}>
				<div className="form-group w-100">
					{this.showLabel(lang)}
					<div className={'d-flex align-items-center'}>
						{this.isTextarea && (
							<textarea
								className="form-control"
								id={id}
								name={inputName}
								rows={3}
								disabled={this.props.disabled}
								onKeyPress={this.props.onKeyPress}
								value={this.state['value' + valueTranslationSuffix]}
								placeholder={this.labelDisplayed}
								onChange={(event) => {
									const update = {};
									update['value' + valueTranslationSuffix] = event.target.value;
									this.setState(update);
									this.props.change(event.target.value, inputName);
								}}
							/>
						)}
						{!this.isTextarea && (
							<input
								className={`
								form-control
								form-control-lg
								round-lg
								${this.props.extraInputClass}
							`}
								required={!lang}
								type={this.inputType}
								name={inputName}
								autoComplete={inputName}
								onKeyPress={this.props.onKeyPress}
								id={id}
								disabled={this.props.disabled}
								placeholder={this.labelDisplayed}
								value={this.state['value' + valueTranslationSuffix]}
								onChange={(event) => {
									const update = {};
									update['value' + valueTranslationSuffix] = event.target.value;
									this.setState(update);
									this.props.change(event.target.value, inputName);
								}}
							/>
						)}
						{lang && (
							<div>
								<button
									className="btn btn-primary"
									type={'button'}
									data-toggle="collapse"
									data-target={'#' + inputName + '-auto-translation'}
									aria-expanded="false"
									aria-controls="collapseExample"
									onClick={() => this.translate(this.state.value, lang, inputName)}
								>
									<FontAwesomeIcon icon={['fas', 'language']} /> Auto
								</button>
							</div>
						)}
					</div>
				</div>
				{lang && (
					<div className="collapse" id={inputName + '-auto-translation'}>
						<div className={'d-flex align-items-center'}>
							<div className="card card-body" />
							<button
								type={'button'}
								className={'btn btn-primary'}
								onClick={() => this.translate(this.state.value, lang, inputName)}
							>
								refresh
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	translate = async (value: string, lang: ILang, inputName: string) => {
		const divResult = document.querySelector(
			'#' + inputName + '-auto-translation' + ' div .card',
		) as HTMLDivElement;
		if (divResult) {
			divResult.innerHTML = await HttpRequester.postHttp(TRANSLATION_CTRL, {text: value, lang});
		}
	};

	render() {
		if (this.isCheckInput) {
			return this.renderCheckbox();
		}
		return (
			<div>
				<div className={'d-flex align-items-end'}>
					{this.renderTextInput()}
					{this.props.canBeTranslated && (
						<div>
							<button
								className="btn btn-primary m3 mb-4"
								type="button"
								data-toggle="collapse"
								data-target={`#${this.id}-translations`}
								aria-expanded="false"
								aria-controls="collapseExample"
							>
								Voir les traductions
							</button>
						</div>
					)}
				</div>
				<div className="collapse mb-3" id={`${this.id}-translations`}>
					<div className="card card-body">
						{this.renderTextInput(ILang.EN)}
						{this.renderTextInput(ILang.ES)}
					</div>
				</div>
			</div>
		);
	}

	componentDidUpdate(prevProps: Readonly<IBasicInputProps>) {
		if (this.props.value !== prevProps.value) {
			this.setInitialInputValue();
		}
	}

	componentDidMount() {
		this.setInitialInputValue();
	}
}
