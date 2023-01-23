import IncluscoreAppWrapper from '../pages/IncluscoreApp/IncluscoreAppWrapper';
import IncluscoreAppHome from '../pages/IncluscoreApp/IncluscoreAppHome';
import IncluscoreAppThemes from '../pages/IncluscoreApp/IncluscoreAppThemes';
import IncluscoreAppQuestions from '../pages/IncluscoreApp/IncluscoreAppQuestions';
import InclucardAppGrid from '../pages/IncluscoreApp/InclucardAppGrid';
import IncluscoreAppScore from '../pages/IncluscoreApp/IncluscoreAppScore';
import IncluscoreAppAnswers from '../pages/IncluscoreApp/IncluscoreAppAnswers';
import IncluscoreAppAboutPage from '../pages/IncluscoreApp/IncluscoreAppAboutPage';
import * as React from 'react';
import LoginPage from '../pages/LoginPage';
import {Route} from 'react-router-dom';
import {appLoggedPath} from './publicRoutes';

export const incluscoreAppPath = '/incluscore-app';
export const inclucardAppPath = '/inclucard-app';
export const incluscoreLoginPath = appLoggedPath + '/incluscore-login-page';

// incluscore
export const incluscoreHomePath = incluscoreAppPath + '/home';
export const incluscoreThemesPath = incluscoreAppPath + '/themes';
export const incluscoreQuestionPath = incluscoreAppPath + '/question';
export const incluscoreScorePath = incluscoreAppPath + '/score';
export const incluscoreAnswersPath = incluscoreAppPath + '/answers';
export const incluscoreAboutPath = incluscoreAppPath + '/about';

// inclucard
export const inclucardHomePath = inclucardAppPath + '/home';
export const inclucardThemesPath = inclucardAppPath + '/themes';
export const inclucardQuestionsPath = inclucardAppPath + '/questions';
export const inclucardScorePath = inclucardAppPath + '/score';
export const inclucardAnswersPath = inclucardAppPath + '/answers';
export const inclucardAboutPath = inclucardAppPath + '/about';

// incluscore / inclucard common paths
export const quizHomePath = [incluscoreHomePath, inclucardHomePath];
export const quizThemesPath = [incluscoreThemesPath, inclucardThemesPath];
export const quizScorePath = [incluscoreScorePath, inclucardScorePath];
export const quizAnswersPath = [incluscoreAnswersPath, inclucardAnswersPath];
export const quizAboutPath = [incluscoreAboutPath, inclucardAboutPath];

export const getIncluscoreAppRoutes = () => {
	return [
		<Route exact path={incluscoreLoginPath} key={incluscoreLoginPath}>
			<LoginPage />
		</Route>,
		<Route exact path={quizHomePath} key={quizHomePath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppHome />
			</IncluscoreAppWrapper>
		</Route>,
		<Route exact path={quizThemesPath} key={quizThemesPath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppThemes />
			</IncluscoreAppWrapper>
		</Route>,
		<Route path={incluscoreQuestionPath} key={incluscoreQuestionPath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppQuestions />
			</IncluscoreAppWrapper>
		</Route>,
		<Route path={quizScorePath} key={quizScorePath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppScore />
			</IncluscoreAppWrapper>
		</Route>,
		<Route path={quizAnswersPath} key={quizAnswersPath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppAnswers />
			</IncluscoreAppWrapper>
		</Route>,
		<Route path={quizAboutPath} key={quizAboutPath}>
			<IncluscoreAppWrapper>
				<IncluscoreAppAboutPage />
			</IncluscoreAppWrapper>
		</Route>,
		<Route path={inclucardQuestionsPath} key={inclucardQuestionsPath}>
			<IncluscoreAppWrapper>
				<InclucardAppGrid />
			</IncluscoreAppWrapper>
		</Route>,
	];
};
