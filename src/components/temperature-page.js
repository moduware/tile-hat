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
import { navigate } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import app from '../reducers/app.js';
import './icons.js';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';

class TemperaturePage extends connect(store)(PageViewElement) {
	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
		};
	}

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
            <div class="temperature-scale__scale temperature-scale__scale--celsius" style="transform: translateY(${23 * 7}px)"></div>
          </div>
        </div>
        <div class="result-screen__right-side">
          <div class="temperature-numbers">
            <!-- <div class="temperature-numbers__temparature-value" id="temperature-value">{{ temperatureOutput }} {{ temperatureUnitSelected }}</div> -->
            <span class="temperature-numbers__temparature-value" id="temperature-value">23.0</span>
            <span class="temperature-numbers__temparature-unit" id="temperature-unit">C</span>
            <div class="temperature-numbers__humidity">
              <span class="temperature-numbers__humidity-title">Humidity</span>
              <span class="temperature-numbers__humidity-value" id="humidity-value">80</span>
            </div>
          </div>
        </div>
      </div>
      <a class="action-button action-button--primary" @click="${() => store.dispatch(navigate('/add-reading-page'))}">Save</a>
    `;
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
	}
}

window.customElements.define('temperature-page', TemperaturePage);
