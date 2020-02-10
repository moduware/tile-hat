/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { getPlatform } from '@moduware/lit-utils';

export const GET_PLATFORM = 'GET_PLATFORM';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const MODUWARE_API_READY = 'MODUWARE_API_READY';
export const LOAD_LANGUAGE_TRANSLATION = 'LOAD_LANGUAGE_TRANSLATION';

// This is a fix to iOS not auto connecting and not finding any devices
export const initializeModuwareApiAsync = () => async dispatch => {
	let promise = new Promise((resolve, reject) => {
		if (typeof Moduware === 'undefined') {
			document.addEventListener('WebViewApiReady', resolve);
		} else {
			resolve();
		}
	});

	await promise;
	dispatch(moduwareApiReady());
}

export const getPlatformInfo = () => {
	var platform = getPlatform();
	return {
		type: GET_PLATFORM,
		platform
	};
}

export const moduwareApiReady = () => async dispatch => {

	dispatch({ type: MODUWARE_API_READY });
	dispatch(loadLanguageTranslation());

	Moduware.API.addEventListener('HardwareBackButtonPressed', () => {
		dispatch(hardwareBackButtonPressed());
	});
}

export const navigate = (path) => (dispatch) => {
	const page = path === '/' ? 'instructions-page' : path.slice(1);
	dispatch(loadPage(page));
};

export const loadLanguageTranslation = () => async dispatch => {
	language = Moduware.Arguments.language;
	console.log(Moduware.Arguments);
	dispatch({ type: LOAD_LANGUAGE_TRANSLATION, language });
}

const loadPage = (page) => (dispatch) => {
	switch (page) {
		case 'instructions-page':
			import('../components/instructions-page.js').then((module) => {
				// Put code in here that you want to run every time when
				// navigating to view1 after my-view1.js is loaded.
			});
			break;
		case 'temperature-page':
			import('../components/temperature-page.js');
			break;
		case 'saved-readings-page':
			import('../components/saved-readings-page.js');
			break;
		case 'settings-page':
			import('../components/settings-page.js');
			break;
		case 'add-reading-page':
			import('../components/add-reading-page.js');
			break;
		default:
			page = 'error-page';
			import('../components/error-page.js');
	}

	dispatch(updatePage(page));
};

const updatePage = (page) => {
	return {
		type: UPDATE_PAGE,
		page
	};
};

export const hardwareBackButtonPressed = () => (dispatch, getState) => {
	if (Moduware) {
		if (getState().app.page === 'add-reading-page') {
			dispatch(navigate('/temperature-page'))
		} else {
			Moduware.API.Exit();
		}
	}
}

export const headerBackButtonClicked = () => (dispatch, getState) => {
	console.log('Webview header back button clicked!');
	if (Moduware) {
		if (getState().app.page === 'add-reading-page') {
			dispatch(navigate('/temperature-page'))
		} else {
			Moduware.API.Exit();
		}
	}
};

