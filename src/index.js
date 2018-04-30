import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import 'swiper/dist/css/swiper.min.css';
import './sass/styles.scss';

import Navigo from 'navigo';
import moment from 'moment';
import Swiper from 'swiper';
import Vue from 'vue';
import 'material-design-lite/material.min.js';
import WebViewTileHeader from 'webview-tile-header/WebViewTileHeader.js';

import headerSettingsIcon from './img/icon-settings.svg';

import Settings from './lib/Settings';
import * as Utils from './lib/Utils';
import TemperatureUnit from './enums/TemperatureUnit';
import MeasureType from './enums/MeasureType';

import '../bower_components/morph-tabbar/morph-tabbar.html'; 
import '../bower_components/morph-tabbar-item/morph-tabbar-item.html';

import '../bower_components/morph-pages/morph-pages.html';

Settings.setPrefix('hat_tile_v1_');
const defaultSettings = {
    units: TemperatureUnit.Celsius,
    measureType: MeasureType.Ambient,
    showInstruction: true
};
const loadedSettings = Settings.Load(defaultSettings);

const router = new Navigo(null, true, '#');

const STORAGE_KEY = 'hat-history-storage';

const tile = new Vue({
    el: '#wrapper',
    data: {
        sensorValues: {
            ambientTemperature: 0,
            objectTemperature: 0,
            humidity: 0
        },
        snapshotValues: {
            measureType: MeasureType.Ambient,
            temperature: 0,
            humidity: 0,
            timestamp: 0
        },
        settings: loadedSettings,
        temperatureHistoryValues: []
    },
    created() {
        const json = localStorage.getItem(STORAGE_KEY);
        this.temperatureHistoryValues = json != null ? JSON.parse(json) : [];
    },
    methods: {
        changeMeasureType: function() {
            this.settings.measureType = this.settings.measureType == MeasureType.Ambient ? MeasureType.Object : MeasureType.Ambient;
        },
        disableInstruction: function() {
            this.settings.showInstruction = false;
        },
        saveTemperatureHistory: function() {
            this.temperatureHistoryValues.push({ id: this.temperatureHistoryValues.length, temperatureValue: this.snapshotTemperatureOutput, timestamp: this.snapshotTimeOutput });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.temperatureHistoryValues));
            alert('Data saved!');
        },
        removeTodo: function (index) {
            this.$delete(this.temperatureHistoryValues, index);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.temperatureHistoryValues));
            alert('Item removed!');
        }
    },
    watch: {
        settings: {
            handler: function(newSettings, oldSettings) {
                Settings.Save(newSettings);
            },
            deep: true
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
        temperatureUnitSelected: function () {
            let temperatureUnit;
            if (this.settings.units == TemperatureUnit.Celsius) {
                temperatureUnit = 'C';
            } else {
                temperatureUnit = 'F';
            }
            return temperatureUnit;
        },
        humidityOutput: function() {
            return this.sensorValues.humidity.toFixed(1);
        },
        scaleUnitClass: function() {
            return {
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
        },
        isMeasuringObject: function() {
            return this.settings.measureType == MeasureType.Object;
        },
        snapshotTimeOutput: function() {
            return moment.unix(this.snapshotValues.timestamp).format('DD/MM/YYYY - h:mm a');
        },
        snapshotTemperatureOutput: function() {
            let temperature = this.snapshotValues.temperature;
            // if user uses fahrenheit, converting value
            if(this.settings.units == TemperatureUnit.Fahrenheit) {
                temperature = Utils.Celsius2Farenheit(temperature);
            }
            return temperature.toFixed(1);
        },
        snapshotHumidityOutput: function() {
            return this.snapshotValues.humidity.toFixed(1);
        }
    },
});

window.tile = tile;

// Showing module instruction to user by default
if(tile.settings.showInstruction) {
    document.location.hash = 'instruction';
}

router.on({
    'instruction': function() {
        showPage('instruction-screen');
    },
    'settings': function() {
        showPage('settings-screen');
    },
    'snapshot': function() {
        showPage('snapshot-screen');
    },
    'history': function () {
        showPage('history-screen');
    },
    '*': function() {
        showPage('result-screen');
    }
}).resolve();

// document.addEventListener('DOMContentLoaded', () => {
    /* Configuring instruction slider */
    const instructionSwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        pagination: {
            el: '.swiper-pagination'
        }
    });

    /* Revealing UI */
    document.getElementById('wrapper').style.opacity = 1;

    WebViewTileHeader._detectCurrentPlatform();
    /* Header configuration */
    WebViewTileHeader.create('Temperature');
    WebViewTileHeader.customize({color: 'white', iconColor:'white', backgroundColor:'#FFB931', borderBottom:'none'});
    WebViewTileHeader.hideShadow();

    /* Paging system */
    WebViewTileHeader.addButton({image: headerSettingsIcon}, () => router.navigate('settings'));//Pages.showSettingsPage());
    WebViewTileHeader.addEventListener('BackButtonClicked', () => {
        if(document.location.hash == '' || document.location.hash == '#instruction') {
            Nexpaq.API.Exit();
        } else {
            history.back();
        }
    });
    document.getElementById('button-snapshot').addEventListener('click', () => createSnapshot());
    document.getElementById('snapshot-button-cancel').addEventListener('click', snapshotButtonCancelClickHandler);
// });

document.addEventListener('NexpaqAPIReady', () => {
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartSensor', []);
    Nexpaq.API.addEventListener('BeforeExit', () => Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StopSensor', []));

    Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
        // we don't care about data not related to our module
        if(event.moduleUuid != Nexpaq.Arguments[0]) return;
        if(event.dataSource != 'SensorValue') return;

        tile.sensorValues.ambientTemperature = parseFloat(event.variables.ambient_temperature);
        tile.sensorValues.objectTemperature = parseFloat(event.variables.object_temperature);
        tile.sensorValues.humidity = parseFloat(event.variables.humidity);
    }); 

});

function showPage(name) {
    const pages = Array.from(document.querySelectorAll('.tile-screen'));
    pages.map(
        page => page.classList.contains(name) ? page.classList.remove('hidden') : page.classList.add('hidden')
    );
}

function snapshotButtonCancelClickHandler() {
    const containerElement = document.getElementById('snapshot-buttons-container');
    const snapshotItemElement = document.getElementById('snapshot-item');

    const animationPromise1 = Utils.runCssAnimationByClass(containerElement, 'animation-slidedown');
    const animationPromise2 = Utils.runCssAnimationByClass(snapshotItemElement, 'animation-disapear');

    Promise.all([animationPromise1, animationPromise2]).then(() => {
        router.navigate('');
        setTimeout(() => {
            containerElement.classList.remove('animation-slidedown');
            snapshotItemElement.classList.remove('animation-disapear');
        }, 500);
    });
}

function createSnapshot() {
    tile.snapshotValues.measureType = tile.settings.measureType;
    tile.snapshotValues.humidity = tile.sensorValues.humidity;
    if(tile.settings.measureType == MeasureType.Ambient) {
        tile.snapshotValues.temperature = tile.sensorValues.ambientTemperature;
    } else {
        tile.snapshotValues.temperature = tile.sensorValues.objectTemperature;
    }
    tile.snapshotValues.timestamp = moment().unix();
}
