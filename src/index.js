import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import './sass/styles.scss';

import moment from 'moment';
import 'material-design-lite/material.min.js';
import 'webview-tile-header/WebViewTileHeader.js';

import headerSettingsIcon from './img/icon-settings.svg';

import Settings from './lib/Settings';
import * as Pages from './lib/Pages';
import * as Utils from './lib/Utils';
import TemperatureUnit from './enums/TemperatureUnit';
import MeasureType from './enums/MeasureType';

/* Loading settings */
const defaultSettings = {
    units: TemperatureUnit.Celsius,
    measureType: MeasureType.Ambient
};
Settings.setPrefix('hat');
const settings = Settings.Load(defaultSettings);
renderSettings(settings);

const values = {
    ambientTemperature: 0,
    objectTemperature: 0,
    humidity: 0
};

document.addEventListener('DOMContentLoaded', () => {
    /* Revealing UI */
    document.getElementById('wrapper').style.opacity = 1;

    /* Header configuration */
    Nexpaq.Header.create('Temperature');
    Nexpaq.Header.customize({color: 'white', iconColor:'white', backgroundColor:'#FFB931', borderBottom:'none'});
    Nexpaq.Header.hideShadow();

    /* Paging system */
    Nexpaq.Header.addButton({image: headerSettingsIcon}, () => Pages.showSettingsPage());
    Nexpaq.Header.addEventListener('BackButtonClicked', () => {
        if(Pages.currentPage == 'main') {
            Nexpaq.API.Exit();
        } else {
            Pages.showMainPage();
        }
    });
    document.getElementById('button-snapshot').addEventListener('click', () => {
        createSnapshot();
        Pages.showSnapshotPage();
    });
    document.getElementById('snapshot-button-cancel').addEventListener('click', snapshotButtonCancelClickHandler);
    document.getElementById('button-object').addEventListener('click', buttonObjectClickHandler);
    document.querySelectorAll('input[type=radio][name=measureUnit]').forEach(
        item => item.addEventListener('click', measureUnitSettingClickHandler)
    );
});

document.addEventListener('NexpaqAPIReady', () => {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartSensor', []);
    Nexpaq.API.addEventListener('BeforeExit', () => Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StopSensor', []));

    Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
        // we don't care about data not related to our module
        if(event.module_uuid != Nexpaq.Arguments[0]) return;
        if(event.dataSource != 'SensorValue') return;

        values.ambientTemperature = parseFloat(event.variables.ambient_temperature);
        values.objectTemperature = parseFloat(event.variables.object_temperature);
        values.humidity = parseFloat(event.variables.humidity);
        
        renderValues();
    }); 

});

function snapshotButtonCancelClickHandler() {
    const containerElement = document.getElementById('snapshot-buttons-container');
    const snapshotItemElement = document.getElementById('snapshot-item');

    const animationPromise1 = Utils.runCssAnimationByClass(containerElement, 'animation-slidedown');
    const animationPromise2 = Utils.runCssAnimationByClass(snapshotItemElement, 'animation-disapear');

    Promise.all([animationPromise1, animationPromise2]).then(() => Pages.showMainPage());
}

function buttonObjectClickHandler() {
    this.classList.toggle('active');
    if(settings.measureType == MeasureType.Ambient) {
        settings.measureType = MeasureType.Object;
    } else {
        settings.measureType = MeasureType.Ambient;
    }
    Settings.Save(settings);
}

function measureUnitSettingClickHandler() {
    if(this.value == 'celsius') {
        settings.units = TemperatureUnit.Celsius
    } else {
        settings.units = TemperatureUnit.Fahrenheit;
    }
    Settings.Save(settings);
}

function createSnapshot() {
    let temperature;
    // taking required temperature
    if(settings.measureType == MeasureType.Ambient) {
        document.getElementById('snapshot-temperature-title').textContent = 'Ambient Temperature';
        temperature = values.ambientTemperature;
    } else {
        document.getElementById('snapshot-temperature-title').textContent = 'Object Temperature';
        temperature = values.objectTemperature;
    }
    // if user uses fahrenheit, converting value
    if(settings.units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
    }
    // formatting temperature
    temperature = temperature.toFixed(1);
    const humidity = values.humidity.toFixed(1);
    const time = moment().format('DD/MM/YYYY - h:mm a');

    // displaying values in UI
    document.getElementById('snapshot-temperature-value').textContent = temperature;
    document.getElementById('snapshot-humidity-value').textContent = humidity;
    document.getElementById('snapshotDayAndTime').textContent = time;
}


function renderValues() {
    let temperature;
    let scaleValue;
    // taking required temperature
    if(settings.measureType == MeasureType.Ambient) {
        temperature = values.ambientTemperature;
    } else {
        temperature = values.objectTemperature;
    }
    scaleValue = temperature * 7;

    // if user uses fahrenheit, converting value
    if(settings.units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
        scaleValue = temperature * 3;
    }
    // formatting temperature
    temperature = temperature.toFixed(1);
    const humidity = values.humidity.toFixed(1);

    // displaying values in UI
    document.getElementById('temperature-value').textContent = temperature;
    document.getElementById('humidity-value').textContent = humidity;
    document.getElementById('temperature-scale').style.transform = 'translateY(' + scaleValue + 'px)';
}

function renderSettings(settings) {
    if(settings.measureType == MeasureType.Object) {
        document.getElementById('button-object').classList.add('active');
    }
    if(settings.units == TemperatureUnit.Fahrenheit) {
        document.getElementById('fahrenheitSetting').checked = true;
    }
}

window.renderValues = renderValues;