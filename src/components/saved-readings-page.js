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
import { navigate, removeReading } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { ResetStyles } from '../vendor/reset.css.js';
import { SharedStyles } from './shared-styles.js';
import app from '../reducers/app.js';
import './icons.js';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import '@moduware/morph-list-view/morph-list-view.js';
import '@moduware/morph-list-view-item/morph-list-view-item.js';
import '@moduware/morph-list-view-title/morph-list-view-title.js';
import '@moduware/morph-swipeout/morph-swipeout.js';
import '@moduware/morph-button/morph-button.js';

class SavedReadingsPage extends connect(store)(PageViewElement) {

	constructor() {
		super();
		this._historyList = [];
	}

	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_historyList: { type: Array }
		};
	}

	static get styles() {
		return [
			ResetStyles,
			SharedStyles,
			css`
        :host {
          display: flex;
        	overflow-y: scroll;
        	background-color: #F9F9F9;
        }

        morph-list-view {
          margin-bottom: 0;
          width: 100%;
        }
        morph-list-view-title {
        	background-color: #eff0f4;
        	margin: 0;
        	padding: 10px;
        }

        morph-list-view-item {
        	--display-inner-item-bottom-line: none;
        	--container-align-items: stretch;
        	margin-bottom: 0px;
        	width: 100%;
        }

        morph-tabbar {
        	--ios-bar-color: transparent;
        	box-shadow: 0px -0.5px 0px 1px rgba(0, 0, 0, 0.3);
        }
        .history-placeholder {
          font-family: Roboto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          margin: auto 0;
        }

        .history-placeholder-icon {
          margin-bottom: 35px;
        }

        .history-placeholder-title {
          font-size: 17px;
          line-height: 17px;
          color: #000000;
          margin-bottom: 8px;
        }

        :host([platform="ios"]) .history-placeholder-title {
          color: #535353;
        }

        .history-placeholder-text {
          font-size: 14px;
          line-height: 18px;
          color: #929292;
          display: inline-block;
          text-align: center;
        }

        :host([platform="ios"]) .history-placeholder-text {
          color: #7A7A7A;
        }

        .temperature-list-item {
          font-family: Roboto;
          color: #535353;
        }

        .temperature-list-item__title:empty::after {
          content: 'Unlabeled';
        }

        .temperature-list-item__title {
          margin-bottom: 5px;
        }

        .temperature-list-item__value,
        .temperature-list-item__title {
          font-weight: bold;
          color: black;
        }
        .temperature-list-item__content {
          line-height: 1.5em;
        }

        .temperature-list-item__value--temperature::after {
          content: '°';
        }

        .temperature-list-item__value--humidity::after {
          content: '%';
        }

        .temperature-list-item__time,
        .temperature-list-item__address {
          color: #929292;
          font-size: 14px;
          font-weight: 300;
        }

        .temperature-list-item__address {
          margin-top: 8px;
          text-overflow: initial;
          white-space: initial;
        }

        .temperature-list-item__time {
          margin-bottom: auto;
          margin-top: 8px;
          margin-right: 17px;
        }

        .temperature-list-item__icon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          min-width: auto;
          padding-top: 10px;
          padding-bottom: 10px;
          margin-right: 25px;
        }
      `
		];
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
      ${this._historyList.length == 0 ? html`
       <div class="history-placeholder">
         <img class="history-placeholder-icon" src="images/history-empty-icon.svg" />
         <div class="history-placeholder-title">${translate('history.placeholder.title')}</div>
         <span class="history-placeholder-text">${translate('history.placeholder.message')}</span>
       </div>
			` : this._historyList.map(dategroup => html`
				<morph-list-view class="temperature-list">
         <morph-list-view-title>${this._formatDate(dategroup.date)}</morph-list-view-title>
				 ${dategroup.items.map(item => html`
					<morph-swipeout class="temperature-list-item">
           <morph-list-view-item class="temperature-list-item">
             <span class="temperature-list-item__icon-container" slot="icon">
               <img src="images/temperature-icon-ambient-square.svg" />
             </span>
             <span slot="header" class="temperature-list-item__title">${item.label === '' ? translate('history.list.unlabeled') : item.label}</span>
             <span class="temperature-list-item__content">
               ${translate('history.list.temperature')}:
               <span class="temperature-list-item__value temperature-list-item__value--temperature">${item.temperature.toFixed(1) + ' ' + item.unit.symbol}</span>
               <br> ${translate('history.list.humidity')}:
               <span class="temperature-list-item__value temperature-list-item__value--humidity">${item.humidity.toFixed(1)}</span>
             </span>
             <span slot="secondary-content" class="temperature-list-item__time">
               ${moment(item.id).format('LT')}
               <br>
             </span>
           </morph-list-view-item>
           <span slot="right-buttons">
						 <morph-button class="swiper-integration-class" color="red" 
						 								filled flat item-delete @click="${() => store.dispatch(removeReading(item.id))}" >${translate('history.list.delete')}</morph-button>
           </span>
         </morph-swipeout>
				 `)}
       </morph-list-view>
			`)}
    `;
	}

	_groupByDate(historyList) {
		const dateGroups = historyList.reduce((dateGroups, item) => {
			const date = item.id;
			const jsDate = new Date(date);
			let day = moment(jsDate).local().startOf('day');

			if (!dateGroups[day]) {
				dateGroups[day] = [];
			}
			dateGroups[day].push(item);
			return dateGroups;
		}, {});


		// To add it in the array format
		const groupArrays = Object.keys(dateGroups).map((date) => {
			return {
				date,
				items: dateGroups[date]
			};
		});
		return groupArrays;
	}

	_formatDate(date) {
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
	}


	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this._historyList = this._groupByDate(state.app.historyList);
		console.log(this._historyList);
	}
}

window.customElements.define('saved-readings-page', SavedReadingsPage);
