import * as React from 'react';

export class TextToInterpretedTextHelper {
	public static getInterpretation(text: string): JSX.Element[] {
		if (!text) {
			return null;
		}
		return text.split('\n').map((str, i) => {
			if (str?.trim() === '') {
				return null;
			}
			return (
				<span key={i}>
					{str} <br />{' '}
				</span>
			);
		});
	}
}
