import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import 'swiper/dist/css/swiper.min.css';
import './sass/styles.scss';

// import Navigo from 'navigo';
import moment from 'moment';
import Swiper from 'swiper';
import Vue from 'vue';
import 'material-design-lite/material.min.js';
// import WebViewTileHeader from 'webview-tile-header/WebViewTileHeader.js';
const WebViewTileHeader = NexpaqHeader;
WebViewTileHeader._detectCurrentPlatform();

import media from './media';
import tabbarIcons from './lib/tabbar-icons';

import Settings from './lib/Settings';
import * as Utils from './lib/Utils';
import TemperatureUnit from './enums/TemperatureUnit';
import MeasureType from './enums/MeasureType';

import '../bower_components/morph-tabbar/morph-tabbar.html'; 
import '../bower_components/morph-tabbar-item/morph-tabbar-item.html';

import '../bower_components/morph-swipeout/morph-swipeout.html';
import '../bower_components/morph-button/morph-button.html';

import '../bower_components/morph-pages/morph-location.html';
import '../bower_components/morph-pages/morph-pages.html';

import '../bower_components/morph-list-view/morph-list-view.html';
import '../bower_components/morph-list-view-item/morph-list-view-item.html';
import '../bower_components/morph-list-view-title/morph-list-view-title.html';


Settings.setPrefix('hat_tile_v1_');
const defaultSettings = {
  units: TemperatureUnit.Celsius,
  measureType: MeasureType.Ambient,
  showInstruction: true
};
const loadedSettings = Settings.Load(defaultSettings);

const STORAGE_KEY = 'hat-history-storage';

let instructionSwiper = null;

const tile = new Vue({
  el: '#wrapper',
  data: {
    currentPage: null,//'main', // instruction / snapshot
    currentTab: 'result', // history / settings
    // platform: 'undefined',
    navigationDirection: 'forward',
    currentSlide: 'one',
    swiperPage: 'one',
    sensorValues: {
        ambientTemperature: 0,
        objectTemperature: 0,
        humidity: 0
    },
    snapshotValues: {
        measureType: MeasureType.Ambient,
        temperature: 0,
        humidity: 0,
        timestamp: 0,
        textInput: '',
    },
    settings: loadedSettings,
    temperatureHistoryValues: [],
    temperatureListDataValues: [],
    icons: {
      temperatureListIconSrc: media.temperatureListIconSrc,
      historyEmptyIconSrc: media.historyEmptyIconSrc,
      instructionAmbientIconSrc: media.instructionAmbientIconSrc,
      instructionObjectIconSrc: media.instructionObjectIconSrc
    },
    tabbarIcons
  },

  created() {
    const json = localStorage.getItem(STORAGE_KEY);
    this.temperatureHistoryValues = json != null ? JSON.parse(json) : [];
    this.temperatureListDataValues = this.temperatureListDataGroupByDateOutput;
  },

  mounted: function () {
    // load material design lite properly in webpack
    componentHandler.upgradeAllRegistered();
    const swiperElement = document.querySelector('.swiper-container');
    // TODO: get rid of this shitty swiper
    window.Swiper = Swiper;

    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      instructionSwiper = new Swiper(swiperElement, {
        direction: 'horizontal',
        pagination: {
          el: '.swiper-pagination'
        }
      });

      instructionSwiper.on('slideChange', function () {
        const swiperSlideActive = document.querySelector('.swiper-slide.swiper-slide-active');
        if (instructionSwiper.isBeginning) {
          tile.currentSlide = 'one';
        } else if (instructionSwiper.isEnd) {
          tile.currentSlide = 'two';
        }
      });

    });

  },
 
  filters: {
    capitalize: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    // Format date to show Today or Tomorrow
    dateFormat: function (date) {
      let jsDate = new Date(date);
      let otherDates = moment(jsDate).fromNow();
      var callback = function () {
        return "[" + otherDates + "]";
      };

      return moment(jsDate).calendar(null, {
        sameDay: '[Today]',
        nextDay: 'DD/MM/YYYY',
        nextWeek: 'DD/MM/YYYY',
        lastDay: '[Yesterday]',
        lastWeek: 'DD/MM/YYYY',
        sameElse: 'DD/MM/YYYY'
      });
    },
    formatTemperature: function (temperature, units) {
      temperature = parseFloat(temperature);
      if (units == TemperatureUnit.Fahrenheit) {
        temperature = Utils.Celsius2Farenheit(temperature);
      }
      return temperature.toFixed(1);
    },
    formatHumidity: function (humidity) {
      humidity = parseFloat(humidity);
      return humidity.toFixed(1);
    }
    
  },

  methods: {
    changeMeasureType: function() {
      this.settings.measureType = this.settings.measureType == MeasureType.Ambient ? MeasureType.Object : MeasureType.Ambient;
    },

    disableInstruction: function() {
      this.settings.showInstruction = false;
    },

    saveTemperatureHistory: function() {
      this.temperatureHistoryValues.unshift({
        id: this.temperatureHistoryValues.length,
        temperatureValue: this.snapshotValues.temperature, 
        humidityValue: this.snapshotValues.humidity,
        time: this.snapshotTimeOutput,
        date: this.snapshotDateOutput,
        label: this.snapshotValues.textInput.trim(),
        type: this.snapshotValues.measureType
      });
      let historyTabbarItems = document.querySelector('morph-tabbar-item[name="history"]');
      this.currentTab = 'history';
      // historyTabbarItems.click();
      this.snapshotValues.textInput = '';
      this.temperatureListDataValues = this.temperatureListDataGroupByDateOutput;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.temperatureHistoryValues));
    },
   
    snapshotTimeObjectOutputFunction: function() {
      // return moment(this.snapshotValues.timestamp).toObject();
      let timestampObject = moment.unix(this.snapshotValues.timestamp);
    },

    removeTemperatureHistoryItem: function (id) {
      // TODO: pass item instead and say delete index of item
      
      setTimeout(() => {
        let index = this.temperatureHistoryValues.map(function (e) { return e.id; }).indexOf(id);
        this.$delete(this.temperatureHistoryValues, index);
        this.temperatureListDataValues = this.temperatureListDataGroupByDateOutput;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.temperatureHistoryValues));
      }, 500);
    },
    renderIosHeaderSaveButton: function(page, tab) {
      if (this.platform != 'ios') return;
      const headerSaveButton = document.getElementById('header-save-button');
      if (page == 'main' && tab == 'result') {
        headerSaveButton.classList.remove('hidden');
      } else {
        headerSaveButton.classList.add('hidden');
      }
    },

    updateSwiperPage: function(page) {                    
      this.swiperPage = page;
    },

    nextInstructionSlide: function() {
      instructionSwiper.slideNext();
    }

  },

  watch: {
    settings: {
      handler: function(newSettings, oldSettings) {
          Settings.Save(newSettings);
      },
      deep: true
    },
    currentPage: function(newPage, oldPage) {
      this.renderIosHeaderSaveButton(newPage, this.currentTab);
    },
    currentTab: function(newTab, oldTab) {
      this.renderIosHeaderSaveButton(this.currentPage, newTab);
    }
  },

  computed: {
    swiperPageValue: function() {
      this.swiperPage = this.currentSlide;
      return this.swiperPage ;
    },
    platform: function() {
      // get tile.platform after body.classList is set
      return getPlatformValue();
    },

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
      };
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
      };
    },

    isMeasuringObject: function() {
      return this.settings.measureType == MeasureType.Object;
    },

    snapshotTimeOutput: function() {
      return moment(this.snapshotValues.timestamp).format('h:mm A');
    },

    snapshotDateOutput: function () {
      // return moment.unix(this.snapshotValues.timestamp).format('DD/MM/YYYY');
      return this.snapshotValues.timestamp;

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
    },

    // make the data arrange by common date
    temperatureListDataGroupByDateOutput: function() {
      const dateGroups = this.temperatureHistoryValues.reduce((dateGroups, items) => {
        const date = items.date;
        const jsDate = new Date(date);
        let dayValue = moment(jsDate).startOf('day');
        if (!dateGroups[dayValue]) {
          dateGroups[dayValue] = [];
        }
        dateGroups[dayValue].push(items);
        return dateGroups;
      }, {});
      /// To add it in the array format
      const groupArrays = Object.keys(dateGroups).map((date) => {
        return {
          date,
          items: dateGroups[date]
        };
      });
      return groupArrays;
    }

  },
});

window.tile = tile;

// Showing module instruction to user by default
if(tile.settings.showInstruction) {
  document.location.hash = 'instruction';
} else {
  document.location.hash = 'main';
}

/* Revealing UI */
document.getElementById('wrapper').style.opacity = 1;


/* Header configuration */
WebViewTileHeader.create('Temperature');
WebViewTileHeader.customize({color: 'white', iconColor:'white', backgroundColor:'#FFB931', borderBottom:'none'});
WebViewTileHeader.hideShadow();

// Add save button to header (right side)
if (tile.platform == 'ios') {
  WebViewTileHeader.addButton({
    title: 'Save',
    id: 'header-save-button'
  }, () => headerSaveButtonHandler());
}

WebViewTileHeader.addEventListener('BackButtonClicked', () => {
  if (document.location.hash == '#snapshot') {
    document.location.hash = 'main';
  } else {
    // history.back();
    Nexpaq.API.Exit();
  }
});

if (tile.platform == 'android') {
  document.getElementById('button-snapshot').addEventListener('click', () => createSnapshot());
}
document.getElementById('snapshot-button-cancel').addEventListener('click', snapshotButtonCancelClickHandler);

function ApiReadyActions() {
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
}

// TODO: switch to Moduware.API.IsReady after app 1.1.9 released
if (window.ModuwareAPIIsReady) {
  ApiReadyActions();
} else {
  document.addEventListener('NexpaqAPIReady', () => ApiReadyActions());
}

function snapshotButtonCancelClickHandler() {
  const containerElement = document.getElementById('snapshot-buttons-container');
  const snapshotItemElement = document.getElementById('snapshot-item');

  const animationPromise1 = Utils.runCssAnimationByClass(containerElement, 'animation-slidedown');
  const animationPromise2 = Utils.runCssAnimationByClass(snapshotItemElement, 'animation-disapear');

  Promise.all([animationPromise1, animationPromise2]).then(() => {
    document.location.hash = 'main';
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
  tile.snapshotValues.timestamp = moment();
  // tile.snapshotValues.timestamp = moment().add('-1', 'day');
}

function getPlatformValue() {
  let platform;
  if (document.body.classList.contains("platform-android")) {
    platform = "android";
  } else if (document.body.classList.contains("platform-ios")) {
    platform = "ios";
  } else {
    platform = "undefined";
  }
  return platform;
}

function headerSaveButtonHandler() {
  createSnapshot();
  document.location.hash = 'snapshot';
}