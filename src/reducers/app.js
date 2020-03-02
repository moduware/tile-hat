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
  GET_PLATFORM
} from '../actions/app.js';

import TemperatureUnit from '../enums/TemperatureUnit';
import MeasureType from '../enums/MeasureType';

const INITIAL_STATE = {
	page: 'instructions-page',
	apiReady: false,
  language: 'en',
	platform: '',
	ambientTemperature: 0,
	objectTemperature: 0,
	humidity: 0,
	temperatureHistoryValues: [],
	unit: TemperatureUnit.Celsius,
	measureType: MeasureType.Ambient,
	showInstruction: true
};

const app = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MODUWARE_API_READY:
			return {
				...state,
				apiReady: true
			};
    case GET_PLATFORM:
			return {
				...state,
				platform: action.platform
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
