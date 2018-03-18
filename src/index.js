import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import './sass/styles.scss';

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

const values = {
    ambientTemperature: 0,
    objectTemperature: 0,
    humidity: 0
};

document.addEventListener('DOMContentLoaded', () => {
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
    document.getElementById('button-snapshot').addEventListener('click', () => Pages.showSnapshotPage());
    document.getElementById('button-cancel').addEventListener('click', () => Pages.showMainPage());
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

function renderValues() {
    let temperature;
    // taking required temperature
    if(settings.measureType == MeasureType.Ambient) {
        temperature = values.ambientTemperature;
    } else {
        temperature = values.objectTemperature;
    }
    // if user uses fahrenheit, converting value
    if(settings.units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
    }
    // formatting temperature
    temperature = temperature.toFixed(1);
    const humidity = values.humidity.toFixed(1);

    // displaying values in UI
    document.getElementById('temp-value1').textContent = temperature;
    document.getElementById('humidity-value1').textContent = humidity;
}

window.renderValues = renderValues;