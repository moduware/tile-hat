/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { navigate, addReading } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import app from '../reducers/app.js';
import './icons.js';
import * as Utils from '../lib/Utils';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import TemperatureUnit from '../enums/TemperatureUnit';
import MeasureType from '../enums/MeasureType';

class TemperaturePage extends connect(store)(PageViewElement) {


	static get styles() {
		return [
			SharedStyles,
			css`
        h2 {
					color: red;
        }
      :host {
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #FFB931;
      }

      .result-screen__content {
        flex-grow: 1;
        display: flex;
        justify-content: center;
      }

      .result-screen__left-side {
        padding-top: 50px;
        padding-left: 20px;
      }

      .result-screen__right-side {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 40px;
        min-width: 210px;
      }

      .temperature-numbers {
        margin-bottom: 20px;
      }

      .temperature-scale {
          position: relative;
          min-width: 72px;
          height: 100%;
          overflow: hidden;
      }

      .temperature-scale::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background-image: linear-gradient(to bottom, rgba(255,185,49,100) 0%, rgba(255,185,49,0) 25%, rgba(255,185,49,0) 50%, rgba(255,185,49,0) 75%, rgba(255,185,49,100) 92%);
          z-index: 2;
      }

      .temperature-scale::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 38px;
          background-image: url('images/line.svg');
          transform: translateY(-50%);
          width: 34px;
          height: 2px;
          z-index: 2;
      }

      .temperature-scale__scale {
          position: absolute;
          top: 50%; left: 0;
          background-position: 0 50%;
          background-repeat: no-repeat;
          z-index: 1;
          transition: transform 0.5s;
      }


      .temperature-scale__scale--celsius {
          background-image: url('images/celsius_scale_2x.png');
          background-size: 72px 721px;
          top: calc(-721px / 2 + 50% - 1px);
          width: 72px;
          height: 721px;
      }

      .temperature-scale__scale--fahrenheit {
          background-image: url('images/fahrenheit_scale_2x.png');
          background-size: 71px 746px;
          top: calc(-746px / 2 + 50% - 301px);
          width: 71px;
          height: 746px;
      }

      .temperature-numbers {
          color: white;
      }

      .temperature-numbers__temparature-value {
          font-size: 60px;
          font-weight: 400;
          line-height: 85px;
      }

      .temperature-numbers__temparature-value::after {
        content: '°';
      }

      .temperature-numbers__temparature-value:empty::after {
        content: '...';
        font-size: 0.3em;
        font-style: italic;
      }

      .temperature-numbers__temparature-unit {
          font-size: 60px;
          font-weight: 400;
          line-height: 85px;
      }

      .temperature-numbers__humidity {
          font-size: 17px;
      }

      .temperature-numbers__humidity-value {
          font-weight: bold;
      }

      .temperature-numbers__humidity-value::after {
          content: '%';
      }

      .temperature-numbers__humidity-value:empty::after {
          content: '...';
          font-style: italic;
      }
      `
		];
	}

	render() {
		return html`
      <div class="result-screen__content">
        <div class="result-screen__left-side">
          <div class="temperature-scale">
            <div class="temperature-scale__scale ${this._unit.name === TemperatureUnit.Celsius.name ? 'temperature-scale__scale--celsius' : 'temperature-scale__scale--fahrenheit'}" 
									style="transform: translateY(${this._temperature * (this._unit.name === TemperatureUnit.Celsius.name ? 7 : 3)}px)"></div>
          </div>
        </div>
        <div class="result-screen__right-side">
          <div class="temperature-numbers">
            <span class="temperature-numbers__temparature-value" id="temperature-value">${this._temperature.toFixed(1)}</span>
            <span class="temperature-numbers__temparature-unit" id="temperature-unit">${this._unit.symbol}</span>
            <div class="temperature-numbers__humidity">
              <span class="temperature-numbers__humidity-title">Humidity</span>
              <span class="temperature-numbers__humidity-value" id="humidity-value">${this._humidity.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      <a class="action-button action-button--primary" @click="${() => this._saveClickHandler()}">Save</a>
    `;
	}

	_saveClickHandler() {

		var time = moment();
		var reading = {
			id: time.valueOf(),
			temperature: this._temperature,
			humidity: this._humidity,
			unit: this._unit,
			measureType: this._measureType,
			//timestamp: time,
			label: ''
		};
		console.log('reading: ', reading);
		store.dispatch(addReading(reading));
	}


	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_temperature: { type: Number },
			_unit: { type: Object },
			_humidity: { type: String },
			_measureType: { type: String }
		};
	}

	updated(changedProperties) {
		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

	async connectedCallback() {
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}
	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this._unit = state.app.unit;
		this._humidity = state.app.humidity;
		this._measureType = state.app.measureType;

		if (state.app.measureType === MeasureType.Ambient) {
			if (this._unit.name === TemperatureUnit.Fahrenheit.name) {
				this._temperature = Utils.Celsius2Farenheit(state.app.ambientTemperature);
			} else {
				this._temperature = state.app.ambientTemperature;
			}
		} else {
			if (this._unit.name === TemperatureUnit.Fahrenheit.name) {
				this._temperature = Utils.Celsius2Farenheit(state.app.objectTemperature);
			} else {
				this._temperature = state.app.objectTemperature;
			}
		}
	}
}

window.customElements.define('temperature-page', TemperaturePage);
