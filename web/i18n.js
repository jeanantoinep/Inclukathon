import * as i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as incluscoreFR from './translations/fr/incluscore.json';
import * as incluscoreEN from './translations/en/incluscore.json';
import * as incluscoreES from './translations/es/incluscore.json';
import * as inclucardFR from './translations/fr/inclucard.json';
import * as inclucardEN from './translations/en/inclucard.json';
import * as inclucardES from './translations/es/inclucard.json';

const resources = {
	en: {
		incluscore: incluscoreEN,
		inclucard: inclucardEN,
	},
	fr: {
		incluscore: incluscoreFR,
		inclucard: inclucardFR,
	},
	es: {
		incluscore: incluscoreES,
		inclucard: inclucardES,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	interpolation: {
		escapeValue: false, // react already safes from xss
	},
	ns: ['incluscore'],
});

export default i18n;
