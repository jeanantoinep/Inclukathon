import Page from '../Page';
import './IncluscoreAppCommon.scss';

class IncluscoreAppCommon<P, S> extends Page<P, S> {
	static readonly CHOSEN_THEME_LOCALSTORAGE_KEY = 'current-theme-selected-scr';
	static readonly CURRENT_ID_THEME_ENDED_LS_KEY = 'current-id-theme-ended-scr';
	static readonly SHOW_SUCCESS_ID_THEME_DONE_LS_KEY = 'show_success_id_theme_done_ls_key';
	static readonly CURRENT_QUESTION_LS_KEY = 'current-question-scr';

	static resetLocalStorageScr = () => {
		window.localStorage.removeItem(IncluscoreAppCommon.CURRENT_ID_THEME_ENDED_LS_KEY);
		window.localStorage.removeItem(IncluscoreAppCommon.CHOSEN_THEME_LOCALSTORAGE_KEY);
		window.localStorage.removeItem(IncluscoreAppCommon.CURRENT_QUESTION_LS_KEY);
		window.localStorage.removeItem(IncluscoreAppCommon.SHOW_SUCCESS_ID_THEME_DONE_LS_KEY);
	};

	retrieveThemeDone = (): string => {
		return window.localStorage.getItem(IncluscoreAppCommon.SHOW_SUCCESS_ID_THEME_DONE_LS_KEY);
	};

	storeThemeDone = (themeDone: string) => {
		window.localStorage.setItem(IncluscoreAppCommon.SHOW_SUCCESS_ID_THEME_DONE_LS_KEY, themeDone);
	};

	retrieveStoredIncluscoreEnded = (): string => {
		return window.localStorage.getItem(IncluscoreAppCommon.CURRENT_ID_THEME_ENDED_LS_KEY);
	};

	storeSelectedIncluscoreEnded = (themeEnded: string) => {
		window.localStorage.setItem(IncluscoreAppCommon.CURRENT_ID_THEME_ENDED_LS_KEY, themeEnded);
	};

	retrieveStoredSelectedTheme = (): string => {
		return window.localStorage.getItem(IncluscoreAppCommon.CHOSEN_THEME_LOCALSTORAGE_KEY);
	};

	storeSelectedTheme = (idTheme: string) => {
		window.localStorage.setItem(IncluscoreAppCommon.CHOSEN_THEME_LOCALSTORAGE_KEY, idTheme);
	};

	retrieveStoredSelectedQuestion = (): string => {
		return window.localStorage.getItem(IncluscoreAppCommon.CURRENT_QUESTION_LS_KEY);
	};

	storeSelectedQuestion = (idQuestion: string) => {
		window.localStorage.setItem(IncluscoreAppCommon.CURRENT_QUESTION_LS_KEY, idQuestion);
	};
}

export default IncluscoreAppCommon;
