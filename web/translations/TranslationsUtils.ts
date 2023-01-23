import {ILang} from '../../server/src/translations/LangUtils';
import i18n from '../i18n';

export const tr = (obj: any, path: string) => {
	const lang = i18n.language;
	if (!lang || lang === ILang.FR) {
		return obj[path];
	}
	if (lang === ILang.EN) {
		return obj[path + '-en'] || obj[path];
	}
	return obj[path + '-es'] || obj[path + '-en'] || obj[path];
};
