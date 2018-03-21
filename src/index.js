import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import './sass/styles.scss';

import moment from 'moment';
import Vue from 'vue';
import 'material-design-lite/material.min.js';
import 'webview-tile-header/WebViewTileHeader.js';

import headerSettingsIcon from './img/icon-settings.svg';

import Settings from './lib/Settings';
import * as Pages from './lib/Pages';
import * as Utils from './lib/Utils';
import TemperatureUnit from './enums/TemperatureUnit';
import MeasureType from './enums/MeasureType';

/* Loading settings */
// const defaultSettings = {
//     units: TemperatureUnit.Celsius,
//     measureType: MeasureType.Ambient
// };
// Settings.setPrefix('hat');
// const settings = Settings.Load(defaultSettings);
// renderSettings(settings);

// const values = {
//     ambientTemperature: 0,
//     objectTemperature: 0,
//     humidity: 0
// };

const tile = new Vue({
    el: '#wrapper',
    data: {
        sensorValues: {
            ambientTemperature: 0,
            objectTemperature: 0,
            humidity: 0
        },
        settings: {
            units: TemperatureUnit.Celsius,
            measureType: MeasureType.Ambient
        }
    },
    computed: {
        temperatureValue: function() {
            let temperature;
            // taking required temperature
            if(this.settings.measureType == MeasureType.Ambient) {
                temperature = this.sensorValues.ambientTemperature;
            } else {
                temperature = this.sensorValues.objectTemperature;
            }

            // if user uses fahrenheit, converting value
            if(this.settings.units == TemperatureUnit.Fahrenheit) {
                temperature = Utils.Celsius2Farenheit(temperature);
            }

            return temperature;
        },
        temperatureOutput: function() {
            const temperature = this.temperatureValue.toFixed(1);

            return temperature;
        },
        scaleClasses: function() {
            return {
                'temperature-scale__scale': true,
                'temperature-scale__scale--celsius': this.settings.units == TemperatureUnit.Celsius,
                'temperature-scale__scale--fahrenheit': this.settings.units == TemperatureUnit.Fahrenheit
            }
        },
        scaleValue: function() {
            let scaleValue;
            if(this.settings.units == TemperatureUnit.Celsius) {
                scaleValue = this.temperatureValue * 7;
            } else {
                scaleValue = this.temperatureValue * 3;
            }
            return {
                transform: `translateY(${scaleValue}px)`
            }
        }
    },
    watch: {
        
    }
});

window.tile = tile;

Settings.setPrefix('hat');
tile.$data.settings = Settings.Load(tile.$data.settings);
renderSettings(tile.$data.settings);

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
        if(event.moduleUuid != Nexpaq.Arguments[0]) return;
        if(event.dataSource != 'SensorValue') return;

        tile.data.values.ambientTemperature = parseFloat(event.variables.ambient_temperature);
        tile.data.values.objectTemperature = parseFloat(event.variables.object_temperature);
        tile.data.values.humidity = parseFloat(event.variables.humidity);
        
        renderValues();
    }); 

});

function snapshotButtonCancelClickHandler() {
    const containerElement = document.getElementById('snapshot-buttons-container');
    const snapshotItemElement = document.getElementById('snapshot-item');

    const animationPromise1 = Utils.runCssAnimationByClass(containerElement, 'animation-slidedown');
    const animationPromise2 = Utils.runCssAnimationByClass(snapshotItemElement, 'animation-disapear');

    Promise.all([animationPromise1, animationPromise2]).then(() => {
        Pages.showMainPage();
        document.getElementById('spanshot-title').value = '';
    });
}

function buttonObjectClickHandler() {
    this.classList.toggle('active');
    if(tile.data.settings.measureType == MeasureType.Ambient) {
        tile.data.settings.measureType = MeasureType.Object;
    } else {
        tile.data.settings.measureType = MeasureType.Ambient;
    }
    Settings.Save(tile.data.settings);
}

function measureUnitSettingClickHandler() {
    const scale = document.getElementById('temperature-scale');
    if(this.value == 'celsius') {
        tile.data.settings.units = TemperatureUnit.Celsius;
        scale.classList.remove('temperature-scale__scale--fahrenheit');
        scale.classList.add('temperature-scale__scale--celsius');
    } else {
        tile.data.settings.units = TemperatureUnit.Fahrenheit;
        scale.classList.add('temperature-scale__scale--fahrenheit');
        scale.classList.remove('temperature-scale__scale--celsius');
    }
    Settings.Save(tile.data.settings);
}

function createSnapshot() {
    let temperature;
    // taking required temperature
    if(tile.data.settings.measureType == MeasureType.Ambient) {
        document.getElementById('snapshot-temperature-title').textContent = 'Ambient Temperature';
        temperature = tile.data.values.ambientTemperature;
    } else {
        document.getElementById('snapshot-temperature-title').textContent = 'Object Temperature';
        temperature = tile.data.values.objectTemperature;
    }
    // if user uses fahrenheit, converting value
    if(tile.data.settings.units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
    }
    // formatting temperature
    temperature = temperature.toFixed(1);
    const humidity = tile.data.values.humidity.toFixed(1);
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
    if(tile.data.settings.measureType == MeasureType.Ambient) {
        temperature = tile.data.values.ambientTemperature;
    } else {
        temperature = tile.data.values.objectTemperature;
    }
    scaleValue = temperature * 7;

    // if user uses fahrenheit, converting value
    if(tile.data.settings.units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
        scaleValue = temperature * 3;
    }
    // formatting temperature
    temperature = temperature.toFixed(1);
    const humidity = tile.data.values.humidity.toFixed(1);

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