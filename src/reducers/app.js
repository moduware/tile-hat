/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
	UPDATE_PAGE,
	MODUWARE_API_READY,
	LOAD_LANGUAGE_TRANSLATION,
} from '../actions/app.js';

const INITIAL_STATE = {
	page: '',
	apiReady: false,
	language: 'en'
};

const app = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MODUWARE_API_READY:
			return {
				...state,
				apiReady: true
			};
		case UPDATE_PAGE:
			return {
				...state,
				page: action.page
			};
		case LOAD_LANGUAGE_TRANSLATION:
			return {
				...state,
				language: action.language
			}
		default:
			return state;
	}
};

export default app;
