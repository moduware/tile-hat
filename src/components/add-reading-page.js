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
import { navigate, saveReading } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { ResetStyles } from '../vendor/reset.css.js';
import { SharedStyles } from './shared-styles.js';
import './icons.js';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';

class AddReadingPage extends connect(store)(PageViewElement) {
	constructor() {
		super();
		this._label = '';
	}

	static get properties() {
		return {
			platform: {
				type: String,
				reflect: true
			},
			_page: { type: String },
			_language: { type: String },
			_toBeSavedReading: { type: Object, reflect: true },
			_label: { type: String }
		};
	}

	static get styles() {
		return [
			ResetStyles,
			SharedStyles,
			css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: #FFB931;
      }

      :host([platform="ios"]) {
        padding: 10px;
      }

      :host([platform="android"]) .button-container {
        padding: 10px;
      }

      .snapshot-item {
          background-color: white;
          font-size: 16px;
          padding: 0 15px 10px 15px;
          overflow: hidden;
      }

      :host([platform="ios"]) .snapshot-item {
          border-radius: 12px;
      }

      :host([platform="android"]) .snapshot-item {
          box-shadow: 0 0 1px rgba(0,0,0,.12), 0 1px 1px rgba(0,0,0,.24);
      }

      .snapshot-item__title {
          width: 100%;
          line-height: 50px;

          color: black;
          font-size: 16px;
          font-weight: 400;
          text-align: left;
          border: none;
          outline: none;
          outline-offset: 0;
          -webkit-appearance:none;
      }

      .snapshot-item__title::-webkit-input-placeholder {
          color: #929292;
      }

      :host([platform="ios"]) .snapshot-item__title {
          font-size: 17px;
      }

      :host([platform="android"]) .snapshot-item__title {
          padding-top: 15px;
          box-sizing: border-box;
          margin-bottom: 15px;
          line-height: calc(35px);
          border-bottom: 1px solid rgba(0,0,0,.12);
      }

      .snapshot-item__values {
          width: 100%;
          margin-bottom: 20px;
      }

      .snapshot-item__line {
          line-height: 30px;
          font-size: 17px;
      }

      :host([platform="android"]) .snapshot-item__line {
          line-height: 40px;
      }

      .snapshot-item__field-value {
          text-align: right;
      }

      .snapshot-item__field-value--temperature::after {
          content: '°';
      }

      .snapshot-item__field-value--humidity::after {
          content: '%';
      }

      .snapshot-item__daytime,
      .snapshot-item__location {
          font-size: 14px;
          color: #929292;
      }

      .snapshot-item__daytime {
          margin-bottom: 5px;
      }

      `
		];
	}

	updated(changedProperties) {
		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

	firstUpdated() { }


	async connectedCallback() {
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	render() {
		return html`
      <div class="snapshot-item" id="snapshot-item">
        <input type="text" id="snapshot-title" class="snapshot-item__title" placeholder="${translate('snapshot.label')}" .value="${this._label}"
          onfocus="this.placeholder=''" onblur="this.placeholder='${translate('snapshot.label')}'">
        <div class="snapshot-item__daytime" id="snapshotDayAndTime">${moment(this._toBeSavedReading.id).format('LT')}</div>
        <table class="snapshot-item__values">
          <tr class="snapshot-item__line">
            <td class="snapshot-item__field-title" id="snapshot-temperature-title">
              <span>${translate('snapshot.temperature')}</span>
            </td>
            <td class="snapshot-item__field-value snapshot-item__field-value--temperature">${this._toBeSavedReading.temperature.toFixed(1) + ' ' + this._toBeSavedReading.unit.symbol}</td>
          </tr>
          <tr class="snapshot-item__line">
            <td class="snapshot-item__field-title">${translate('snapshot.humidity')}</td>
            <td class="snapshot-item__field-value snapshot-item__field-value--humidity">${this._toBeSavedReading.humidity.toFixed(1)}</td>
          </tr>
        </table>
      </div>
      <div class="button-container" id="snapshot-buttons-container">
        <button class="action-button" id="snapshot-button-cancel" @click="${() => this._cancelClickHandler()}">${translate('snapshot.button.cancel')}</button>
        <a class="action-button action-button--primary" id="history-snapshot" @click="${() => this._saveReading()}">${translate('snapshot.button.save')}</a>
      </div>
    `;
	}

	stateChanged(state) {
		this.platform = state.app.platform;
		this._page = state.app.page;
		this._language = state.app.language;
		this._toBeSavedReading = state.app.toBeSavedReading;
	}

	_cancelClickHandler() {
		var snapshotLabel = this.shadowRoot.getElementById('snapshot-title');
		snapshotLabel.value = '';
		store.dispatch(navigate('/temperature-page'))
	}

	_saveReading() {
		var snapshotLabel = this.shadowRoot.getElementById('snapshot-title');
		this._toBeSavedReading.label = snapshotLabel.value;
		snapshotLabel.value = '';
		store.dispatch(saveReading(this._toBeSavedReading));
	}
}

window.customElements.define('add-reading-page', AddReadingPage);
