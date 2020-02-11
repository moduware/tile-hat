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
import '@moduware/morph-list-view/morph-list-view.js';
import '@moduware/morph-list-view-item/morph-list-view-item.js';
import '@moduware/morph-list-view-title/morph-list-view-title.js';
import '@moduware/morph-swipeout/morph-swipeout.js';


class SavedReadingsPage extends connect(store)(PageViewElement) {
	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String }
		};
	}

	static get styles() {
		return [
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
      <link rel="stylesheet" href="node_modules/reset-css/reset.css">
      ${/* history length == 0 */ false ? html`
       <div class="history-placeholder">
         <img class="history-placeholder-icon" src="images/history-empty-icon.svg" />
         <div class="history-placeholder-title">No saved mesaurements yet...</div>
         <span class="history-placeholder-text">Timeline will display the history of your measurements</span>
       </div>
      ` : ''}


       <morph-list-view class="temperature-list">
         <morph-list-view-title>Yesterday</morph-list-view-title>

         <morph-swipeout class="temperature-list-item">
           <morph-list-view-item class="temperature-list-item">
             <span class="temperature-list-item__icon-container" slot="icon">
               <img src="images/temperature-icon-ambient-square.svg" />
             </span>
             <span slot="header" class="temperature-list-item__title">LABEL</span>

             <span class="temperature-list-item__content">
               Temperature:
               <span class="temperature-list-item__value temperature-list-item__value--temperature">23.0 C</span>

               <br> Humidity:
               <span class="temperature-list-item__value temperature-list-item__value--humidity">80</span>
             </span>

             <span slot="secondary-content" class="temperature-list-item__time">

               4:14 PM
               <br>
             </span>

           </morph-list-view-item>

           <span slot="right-buttons">
             <morph-button class="swiper-integration-class" color="red" filled flat item-delete>Delete</morph-button>
           </span>
         </morph-swipeout>
         <morph-swipeout class="temperature-list-item">
           <morph-list-view-item class="temperature-list-item">
             <span class="temperature-list-item__icon-container" slot="icon">
               <img src="images/temperature-icon-ambient-square.svg" />
             </span>
             <span slot="header" class="temperature-list-item__title">LABEL</span>

             <span class="temperature-list-item__content">
               Temperature:
               <span class="temperature-list-item__value temperature-list-item__value--temperature">23.0 C</span>

               <br> Humidity:
               <span class="temperature-list-item__value temperature-list-item__value--humidity">80</span>
             </span>

             <span slot="secondary-content" class="temperature-list-item__time">

               4:14 PM
               <br>
             </span>

           </morph-list-view-item>

           <span slot="right-buttons">
             <morph-button class="swiper-integration-class" color="red" filled flat item-delete>Delete</morph-button>
           </span>
         </morph-swipeout>
       </morph-list-view>
    `;
	}

	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
	}
}

window.customElements.define('saved-readings-page', SavedReadingsPage);
