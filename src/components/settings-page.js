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
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import { MaterialStyles } from '../vendor/material.min.css.js';
import './icons.js';
import { registerTranslateConfig, use, translate } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import 'material-design-lite/material.min.js';
import TemperatureUnit from '../enums/TemperatureUnit';
import MeasureType from '../enums/MeasureType';
import { changeTemperatureUnit, changeMeasureType, toggleShowInstructions } from '../actions/app';

class SettingsPage extends connect(store)(PageViewElement) {

	render() {
		return html`
     <div class="settings-container">
       <span class="settings-container__title">${translate('settings.general.title')}</span>
       <label class="settings-container__label" for="instructionSetting">
         ${translate('settings.general.message')}
         <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="instructionSetting">
           <input type="checkbox" id="instructionSetting" class="mdl-switch__input" ?checked="${this._showInstruction}" @change="${() => store.dispatch(toggleShowInstructions())}">
           <span class="mdl-switch__label"></span>
         </label>
       </label>
     </div>
     ${this.platform == 'ios' ? html`
      <div class="settings-container">
        <span class="settings-container__title">${translate('settings.measure.title')}</span>
        <input type="radio" name="measureType" value="ambient" id="ambientSetting" 
								?checked="${this._measureType === MeasureType.Ambient}"
								@change="${() => this._changeMeasureTypeHandler(MeasureType.Ambient)}">
        <label class="settings-container__label" for="ambientSetting">${translate('settings.measure.ambient')}</label>
        <input type="radio" name="measureType" value="object" id="objectSetting" 
								?checked="${this._measureType === MeasureType.Object}"
								@change="${() => this._changeMeasureTypeHandler(MeasureType.Object)}">
        <label class="settings-container__label" for="objectSetting">${translate('settings.measure.object')}</label>
      </div>
      <div class="settings-container">
        <span class="settings-container__title">${translate('settings.units.title')}</span>
        <input type="radio" class="celsius" name="measureUnit" value="celsius" 
								?checked="${this._unit.name === TemperatureUnit.Celsius.name}"
								@change="${() => this._changeTemperatureUnitHandler(TemperatureUnit.Celsius)}"
								id="celsiusSetting-ios">
        <label class="settings-container__label unit-celsius" for="celsiusSetting-ios">${translate('settings.units.celcius')}</label>
        <input type="radio" class="fahrenheit" name="measureUnit" value="fahrenheit" 
								?checked="${this._unit.name === TemperatureUnit.Fahrenheit.name}"
								@change="${() => this._changeTemperatureUnitHandler(TemperatureUnit.Fahrenheit)}"
								id="fahrenheitSetting-ios" >
        <label class="settings-container__label unit-fahrenheit" for="fahrenheitSetting-ios">${translate('settings.units.fahrenheit')}</label>
      </div>
     ` : html`
      <div class="settings-container">
        <span class="settings-container__title">${translate('settings.measure.title')}</span>
        <label class="settings-container__label" for="ambientSetting-android">
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="ambientSetting-android">
            <input type="radio" 
										id="ambientSetting-android" 
										class="mdl-radio__button" 
										name="measureType" 
										value="ambient" 
										?checked="${this._measureType === MeasureType.Ambient}"
										@change="${() => this._changeMeasureTypeHandler(MeasureType.Ambient)}">
            <span class="mdl-radio"></span>
          </label>
          ${translate('settings.measure.ambient')}
        </label>
        <label class="settings-container__label" for="objectSetting-android">
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="objectSetting-android">
            <input type="radio" 
										id="objectSetting-android" 
										class="mdl-radio__button" 
										name="measureType" 
										value="object"
										?checked="${this._measureType === MeasureType.Object}"
										@change="${() => this._changeMeasureTypeHandler(MeasureType.Object)}">
            <span class="mdl-radio"></span>
          </label>
          ${translate('settings.measure.object')}
        </label>
      </div>
      <div class="settings-container">
        <span class="settings-container__title">${translate('settings.units.title')}</span>
        <label class="settings-container__label unit-celsius" for="celsiusSetting-android" >
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="celsiusSetting-android">
            <input type="radio" 
										id="celsiusSetting-android" 
										class="mdl-radio__button celsius" 
										name="measureUnit" 
										value="celsius" 
										?checked="${this._unit.name === TemperatureUnit.Celsius.name}"
										@change="${() => this._changeTemperatureUnitHandler(TemperatureUnit.Celsius)}" >
            <span class="mdl-radio"></span>
          </label>
          ${translate('settings.units.celcius')}
        </label>
        <label class="settings-container__label unit-fahrenheit" for="fahrenheitSetting-android" >
          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="fahrenheitSetting-android">
            <input type="radio" 
										id="fahrenheitSetting-android" 
										class="mdl-radio__button fahrenheit" 
										name="measureUnit" 
										value="fahrenheit" 
										?checked="${this._unit.name === TemperatureUnit.Fahrenheit.name}"
										@change="${() => this._changeTemperatureUnitHandler(TemperatureUnit.Fahrenheit)}">
            <span class="mdl-radio"></span>
          </label>
          ${translate('settings.units.fahrenheit')}
        </label>
      </div>
     `}
    `;
	}

	static get properties() {
		return {
			platform: {
				type: String,
				reflect: true
			},
			_page: { type: String },
			_language: { type: String },
			_unit: { type: Object },
			_measureType: { type: String },
			_showInstruction: { type: Boolean }
		};
	}

	static get styles() {
		return [
			SharedStyles,
			MaterialStyles,
			css`

      :host {
        font-size: 14px;
        background-color: #eff0f4;
      }

      .settings-container {
        margin-bottom: 15px;
      }
      input[type=radio] {
        display: none;
      }

      .settings-container__title,
      .settings-container__label {
        padding: 0 24px;
      }

      .settings-container__title {
        display: block;
        color: #333333;
        font-size: 13px;
        font-weight: 400;
        line-height: 23px;
        text-transform: uppercase;
      }
      .settings-container__title:first-child {
        margin-top: 15px;
      }

      .settings-container__label {
        position: relative;
        display: block;
        box-sizing: border-box;
        font-size: 17px;
        line-height: 44px;
        height: 44px;
        color: black;
        background-color: white;
        border-bottom: 1px solid #D8D8D8;
      }

      .settings-container__label::after {
        display: none;
        position: absolute;
        top: 50%; right: 15px;
        transform: translateY(-50%);
        content: url('images/checkmark.svg');
        color: black;
      }

      input[type=radio]:checked + .settings-container__label::after {
        display: inline-block;
      }

      .mdl-switch {
        position: absolute;
        width: 50px;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

      }

      :host([platform="ios"]) .mdl-switch {
        width: 52px;
        height: 32px;
        margin: 0 16px 0 0;
      }

      :host([platform="ios"]) .mdl-switch .mdl-switch__thumb {
        background: white;
        left: 2px;
        width: 28px;
        height: 28px;
      }


      .mdl-switch.is-checked .mdl-switch__thumb {
        background: #ffb931;
      }

      :host([platform="ios"]) .mdl-switch.is-checked .mdl-switch__thumb {
        transform: translate(20px, 0);
      }

      :host([platform="ios"]) .mdl-switch .mdl-switch__track {
        box-sizing: border-box;
        border-radius: 16px;
        background-color: white;
        border: 2px solid #bfbfbf;
        top: 0px;
        height: 32px;
        width: 52px;
      }


      .mdl-switch.is-checked .mdl-switch__track {
        background: rgba(255, 185, 49, 0.5);
      }

      :host([platform="ios"]) .mdl-switch.is-checked .mdl-switch__track  {
        box-sizing: border-box;
        border-radius: 16px;
        background-color: #4cd964;
        border: none;
      }

      .mdl-radio__inner-circle,
      .mdl-radio__ripple-container .mdl-ripple,
      .mdl-radio.is-checked .mdl-radio__inner-circle {
        background: #ffb931;
      }
      .mdl-radio.is-checked .mdl-radio__outer-circle {
        border: 2px solid #ffb931;
      }

      :host([platform="ios"]) .mdl-switch__ripple-container.mdl-js-ripple-effect {
        display: none;
      }

      :host([platform="ios"]) .mdl-switch__input{
        visibility: hidden !important;
      }
      `
		];
	}

	firstUpdated() {
		componentHandler.upgradeElement(this.shadowRoot.querySelector(".mdl-switch"));
		if (this.platform == 'android') {
			componentHandler.upgradeElements(this.shadowRoot.querySelectorAll(".mdl-radio"));
		}
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

	_changeTemperatureUnitHandler(unit) {

		store.dispatch(changeTemperatureUnit(unit));
		if (unit.name === TemperatureUnit.Fahrenheit.name && this.platform === 'android') {
			this.shadowRoot.getElementById('celsiusSetting-android').parentNode.classList.remove('is-checked');
			this.shadowRoot.getElementById('fahrenheitSetting-android').parentNode.classList.add('is-checked');
		} else if (unit.name === TemperatureUnit.Celsius.name && this.platform === 'android') {
			this.shadowRoot.getElementById('celsiusSetting-android').parentNode.classList.add('is-checked');
			this.shadowRoot.getElementById('fahrenheitSetting-android').parentNode.classList.remove('is-checked');
		}
	}

	_changeMeasureTypeHandler(measureType) {

		store.dispatch(changeMeasureType(measureType));
		if (measureType === MeasureType.Object && this.platform === 'android') {
			this.shadowRoot.getElementById('ambientSetting-android').parentNode.classList.remove('is-checked');
			this.shadowRoot.getElementById('objectSetting-android').parentNode.classList.add('is-checked');
		} else if (measureType === MeasureType.Ambient && this.platform === 'android') {
			this.shadowRoot.getElementById('ambientSetting-android').parentNode.classList.add('is-checked');
			this.shadowRoot.getElementById('objectSetting-android').parentNode.classList.remove('is-checked');
		}
	}

	stateChanged(state) {
		this.platform = state.app.platform;
		this._page = state.app.page;
		this._language = state.app.language;
		this._unit = state.app.unit;
		this._measureType = state.app.measureType;
		this._showInstruction = state.app.showInstruction;
	}
}

window.customElements.define('settings-page', SettingsPage);
