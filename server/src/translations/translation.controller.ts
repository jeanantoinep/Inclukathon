import {Body, Controller, Post} from '@nestjs/common';
import {TRANSLATION_CTRL} from '../provider/routes.helper';
import {ILang} from './LangUtils';
import * as deepl from 'deepl-node';

@Controller(TRANSLATION_CTRL)
export class TranslationController {
	@Post()
	async translate(@Body() req: any): Promise<string> {
		const text = req.text;
		const lang = req.lang as ILang;
		return (await this.deeplAutoTranslation(text, lang))?.text;
	}

	deeplAutoTranslation = async (textToTranslate: string, lang: ILang) => {
		const deeplAuthKey = '';
		const translator = new deepl.Translator(deeplAuthKey);
		let deeplLang: any = lang;
		if (lang === ILang.EN) {
			deeplLang = 'en-US'; // from en to en-US
		}
		return await translator.translateText(textToTranslate, ILang.FR, deeplLang);
	};
}
