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
import StorageKeys from '../enums/StorageKeys';

export const GET_PLATFORM = 'GET_PLATFORM';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const MODUWARE_API_READY = 'MODUWARE_API_READY';
export const LOAD_LANGUAGE_TRANSLATION = 'LOAD_LANGUAGE_TRANSLATION';
export const DATA_RECEIVED = 'DATA_RECEIVED';
export const TEMPERATURE_UNIT_CHANGED = 'TEMPERATURE_UNIT_CHANGED';
export const MEASURE_TYPE_CHANGED = 'MEASURE_TYPE_CHANGED';
export const SHOW_INSTRUCTION_TOGGLED = 'SHOW_INSTRUCTION_TOGGLED';
export const ADD_READING = 'ADD_READING';
export const SAVE_READING = 'SAVE_READING';

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

	Moduware.v1.Module.ExecuteCommand(Moduware.Arguments[0], 'StartSensor', []);

	Moduware.API.addEventListener('HardwareBackButtonPressed', () => {
		dispatch(hardwareBackButtonPressed());
	});

	Moduware.API.addEventListener('BeforeExit', () => {
		Moduware.v1.Module.ExecuteCommand(Moduware.Arguments[0], 'StopSensor', []);
	});

	Moduware.v1.Module.addEventListener('MessageReceived', async (e) => {
		if (e.ModuleUuid === Moduware.Arguments.uuid && e.Message.dataSource === 'SensorValue') {
			dispatch({
				type: DATA_RECEIVED,
				ambientTemperature: parseFloat(e.Message.variables.ambient_temperature),
				objectTemperature: parseFloat(e.Message.variables.object_temperature),
				humidity: parseFloat(e.Message.variables.humidity)
			});
		}
	});
}


export const changeTemperatureUnit = (unit) => (dispatch) => {
	localStorage.setItem(StorageKeys.UNIT_STORAGE_KEY, JSON.stringify(unit));
	dispatch({ type: TEMPERATURE_UNIT_CHANGED, unit: unit });
}

export const changeMeasureType = (measureType) => (dispatch) => {
	localStorage.setItem(StorageKeys.MEASURE_TYPE_STORAGE_KEY, JSON.stringify(measureType));
	dispatch({ type: MEASURE_TYPE_CHANGED, measureType: measureType });
}

export const loadStoredSettings = () => (dispatch) => {

	var unitJson = localStorage.getItem(StorageKeys.UNIT_STORAGE_KEY);
	if (unitJson != null) {
		var savedUnit = JSON.parse(unitJson);
		dispatch({ type: TEMPERATURE_UNIT_CHANGED, unit: savedUnit });
	}

	var measureTypejson = localStorage.getItem(StorageKeys.MEASURE_TYPE_STORAGE_KEY);
	if (measureTypejson != null) {
		var savedMeasureType = JSON.parse(measureTypejson);
		dispatch({ type: MEASURE_TYPE_CHANGED, measureType: savedMeasureType });
	}

	var showInstructionJson = localStorage.getItem(StorageKeys.SHOW_INSTRUCTION_KEY);
	if (showInstructionJson != null) {
		var savedShowInstruction = JSON.parse(showInstructionJson);
		dispatch({ type: SHOW_INSTRUCTION_TOGGLED, showInstruction: savedShowInstruction });
	}
}

export const toggleShowInstructions = () => (dispatch, getState) => {
	if (getState().app.showInstruction === true) {
		localStorage.setItem(StorageKeys.SHOW_INSTRUCTION_KEY, JSON.stringify(false));
		dispatch({ type: SHOW_INSTRUCTION_TOGGLED, showInstruction: false });
	} else {
		localStorage.setItem(StorageKeys.SHOW_INSTRUCTION_KEY, JSON.stringify(true));
		dispatch({ type: SHOW_INSTRUCTION_TOGGLED, showInstruction: true });
	}
}

export const disableShowInstruction = () => (dispatch) => {
	localStorage.setItem(StorageKeys.SHOW_INSTRUCTION_KEY, JSON.stringify(false));
	dispatch({ type: SHOW_INSTRUCTION_TOGGLED, showInstruction: false });
}

export const addReading = (toBeSavedReading) => (dispatch) => {
	dispatch({ type: ADD_READING, toBeSavedReading: toBeSavedReading });
	dispatch(navigate('/add-reading-page'));
}

export const navigate = (path) => (dispatch) => {
	const page = path === '/' ? 'temperature-page' : path.slice(1);
	dispatch(loadPage(page));
}

export const saveReading = (reading) => (dispatch, getState) => {
	dispatch({ type: SAVE_READING, reading: reading });
	var historyList = getState().app.historyList;
	localStorage.setItem(StorageKeys.HISTORY_KEY, JSON.stringify(historyList));
	dispatch(navigate('/saved-readings-page'));
}

export const loadLanguageTranslation = () => async dispatch => {
	var language = Moduware.Arguments.language;
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
	if (Moduware) {
		if (getState().app.page === 'add-reading-page') {
			dispatch(navigate('/temperature-page'))
		} else {
			Moduware.API.Exit();
		}
	}
};

