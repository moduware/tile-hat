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
import 'material-design-lite/material.min.js';



class SettingsPage extends connect(store)(PageViewElement) {
	static get properties() {
		return {
      platform: {
				type: String,
				reflect: true
			},
			_page: { type: String },
			_language: { type: String }
		};
	}

	static get styles() {
		return [
			SharedStyles,
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
    componentHandler.upgradeElements(this.shadowRoot.querySelectorAll(".mdl-radio"));
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

	render() {
		return html`
      <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
     <div class="settings-container">
       <span class="settings-container__title">General</span>

       <label class="settings-container__label" for="instructionSetting">
         Show instruction
         <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="instructionSetting">
           <input type="checkbox" id="instructionSetting" class="mdl-switch__input">
           <span class="mdl-switch__label"></span>
         </label>
       </label>
     </div>

     <div class="settings-container ${this.platform != 'ios' ? 'hidden' : ''}">
       <span class="settings-container__title">Measure</span>

       <input type="radio" name="measureType" value="ambient" id="ambientSetting" checked>
       <label class="settings-container__label" for="ambientSetting">Ambient temperature</label>

       <input type="radio" name="measureType" value="object" id="objectSetting" >
       <label class="settings-container__label" for="objectSetting">Object temperature</label>
     </div>

     <div class="settings-container ${this.platform != 'android' ? 'hidden' : ''}">
       <span class="settings-container__title">Measure</span>

       <label class="settings-container__label" for="ambientSetting">
         <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="ambientSetting">
           <input type="radio" id="ambientSetting" class="mdl-radio__button" name="measureType" value="ambient" checked>
           <span class="mdl-radio"></span>
         </label>
         Ambient temperature
       </label>

       <label class="settings-container__label" for="objectSetting">
         <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="objectSetting">
           <input type="radio" id="objectSetting" class="mdl-radio__button" name="measureType" value="object">
           <span class="mdl-radio"></span>
         </label>
         Object temperature
       </label>
     </div>

     <div class="settings-container ${this.platform != 'ios' ? 'hidden' : ''}">
       <span class="settings-container__title">Units</span>

       <input type="radio" class="celsius" name="measureUnit" value="celsius" checked>
       <label class="settings-container__label unit-celsius" for="celsiusSetting">Celsius</label>

       <input type="radio" class="fahrenheit" name="measureUnit" value="fahrenheit" id="fahrenheitSetting" >
       <label class="settings-container__label unit-fahrenheit" for="fahrenheitSetting">Fahrenheit</label>
     </div>

     <div class="settings-container ${this.platform != 'android' ? 'hidden' : ''}">
       <span class="settings-container__title">Units</span>

       <label class="settings-container__label unit-celsius" for="celsiusSetting">
         <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="celsiusSetting">
           <input type="radio" id="celsiusSetting" class="mdl-radio__button celsius" name="measureUnit" value="celsius" checked>
           <span class="mdl-radio"></span>
         </label>
         Celsius
       </label>

       <label class="settings-container__label unit-fahrenheit" for="fahrenheitSetting">
         <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="fahrenheitSetting">
           <input type="radio" id="fahrenheitSetting" class="mdl-radio__button fahrenheit" name="measureUnit" value="fahrenheit">
           <span class="mdl-radio"></span>
         </label>
         Fahrenheit
       </label>
     </div>
    `;
	}

	stateChanged(state) {
    this.platform = state.app.platform;
		this._page = state.app.page;
		this._language = state.app.language;
	}
}

window.customElements.define('settings-page', SettingsPage);
