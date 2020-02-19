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
import Swiper from 'swiper';
import app from '../reducers/app.js';
import './icons.js';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';

class InstructionsPage extends connect(store)(PageViewElement) {

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
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
      }
      .button-container {
        padding: 0 10px 10px;
      }

      .swiper-slide {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-align: center;
        font-size: 14px;
        color: white;
        padding: 0 10px 10px;
        box-sizing: border-box;
      }

      .slide-image-container {
        display: flex;
        justify-content: center;
      }

      .slide-image {
        width: auto;
      }

      .slide-note {
        min-height: 100px;
        font-weight: 300;
      }

      .slide-note.slide-note__heading {
        font-size: 17px;
      }
      .swiper-container {
          width: 100%;
          height: 100%;
      }
      .swiper-container {
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          list-style: none;
          padding: 0;
          z-index: 1;
      }
      .swiper-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          align-items: center;
          -webkit-transition-property: -webkit-transform;
          transition-property: -webkit-transform;
          -o-transition-property: transform;
          transition-property: transform;
          transition-property: transform,-webkit-transform;
          -webkit-box-sizing: content-box;
          box-sizing: content-box;
      }
      .swiper-slide {
          -webkit-flex-shrink: 0;
          -ms-flex-negative: 0;
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          position: relative;
          -webkit-transition-property: -webkit-transform;
          transition-property: -webkit-transform;
          -o-transition-property: transform;
          transition-property: transform;
          transition-property: transform,-webkit-transform;
      }
      .swiper-slide {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          font-size: 14px;
          color: white;
          padding: 0 10px 10px;
          box-sizing: border-box;
      }
      .slide-image-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin-bottom: 50px;
          min-height: 150px;
      }
      .swiper-container .swiper-pagination-bullet,
      .swiper-container .swiper-pagination-bullet-active {
          background-color: white;
      }
      .slide-image {
          width: auto;
      }
      .slide-note {
          min-height: 100px;
      }
      `
		];
	}

	updated(changedProperties) {
		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

  firstUpdated() {
    const swiperElement = this.shadowRoot.querySelector('.swiper-container');
    const swiperPagination = this.shadowRoot.querySelector('.swiper-pagination');
    const instructionSwiper = new Swiper(swiperElement, {
      direction: 'horizontal',
      pagination: {
        el: swiperPagination
      }
    });

    instructionSwiper.on('slideChange', function () {
      if (instructionSwiper.isBeginning) {
        console.log('First slide active');
      } else if (instructionSwiper.isEnd) {
        console.log('Second slide active');
      }
    });

  }

	async connectedCallback() {
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	render() {
		return html`
          <link rel="stylesheet" href="/node_modules/swiper/css/swiper.min.css">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="slide-image-container">
                  <svg class="slide-image" width="273px" height="35px" viewBox="0 0 273 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-44.000000, -285.000000)">
                        <g transform="translate(44.000000, 285.000000)">
                          <rect fill="#FFFFFF" x="0" y="33" width="273" height="2"></rect>
                          <g transform="translate(61.000000, 0.000000)" stroke-width="2" stroke="#FFFFFF">
                            <path d="M1.54853288,32 L149,32 L149,4.01452282 L27.6552899,5.76417672 C19.7657742,5.87793464 10.6358214,11.8677722 7.38801146,19.0630593 L1.54853288,32 Z"></path>
                            <rect id="Rectangle-5" x="67" y="1" width="77" height="3"></rect>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <p class="slide-note">
                  When measuring ambient temperature, place the device away from extraneous influences and allow it to stabilise.
                </p>
              </div>
              <div class="swiper-slide">
                <p class="slide-note slide-note__heading">
                  IMPORTANT: Don't use module as a thermometer
                </p>
                <div class="slide-image-container">
                  <svg class="slide-image" width="273px" height="142px" viewBox="0 0 273 142" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-39.000000, -178.000000)">
                        <g transform="translate(39.000000, 156.000000)">
                          <rect fill="#FFFFFF" x="0" y="162" width="273" height="2"></rect>
                          <g transform="translate(62.000000, 129.000000)" stroke-width="2" stroke="#FFFFFF">
                            <path d="M1.54853288,32 L149,32 L149,4.01452282 L27.6552899,5.76417672 C19.7657742,5.87793464 10.6358214,11.8677722 7.38801146,19.0630593 L1.54853288,32 Z"></path>
                            <rect  x="67" y="1" width="77" height="3"></rect>
                          </g>
                          <path d="M267.51281,91.0859492 L261.976405,23.6238216 L233.046351,40.0144165 C231.890028,40.6695424 230.779075,41.3881032 229.717026,42.1666615 L229.531626,42.2741062 C229.295526,42.3789427 229.060348,42.4865775 228.826125,42.5970043 L125.835307,91.1529191 C122.738392,92.6129867 120.216426,95.0635654 118.668058,98.1172909 C114.822188,105.702201 117.853279,114.96868 125.43819,118.81455 C144.254666,128.355298 166.197174,129.618036 185.983901,122.298808 L258.226944,95.5756764 C259.458387,95.1201583 260.655341,94.5763398 261.808474,93.9484608 C262.504079,93.569705 263.179853,93.1633498 263.834773,92.730404 L263.981232,92.650289 L267.51281,91.0859492 Z M322,66.9504292 L343.14934,57.5821665 C346.078959,56.2844692 348.740651,54.4514025 350.997709,52.1771158 C361.015525,42.0828274 360.953533,25.7787448 350.859244,15.7609282 C342.971697,7.93313517 332.846903,2.99434021 322,1.51875631 L322,66.9504292 Z" stroke="#FFFFFF" stroke-width="2"></path>
                          <path d="M121.053778,95.5722817 C127.230617,98.379936 135.232432,100.204911 145.059222,101.047208 C149.246051,101.406079 173.638613,87.4801194 177.908776,84.6224301 C182.502831,81.5479855 185.02972,74.6692326 185.489443,63.9861713" stroke="#FFFFFF" stroke-width="2"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <p class="slide-note">
                  When measuring the temperature of an object, don't disconnect the module. Simply place the temperature sensor up against the intended object.
                </p>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <div class="button-container">
          <!--<a class="action-button action-button-/-primary">Next</a>-->
            <a class="action-button action-button--primary" @click="${() => store.dispatch(navigate('/temperature-page'))}">Got it!</a>
            <a class="action-button action-button--link" @click="${() => store.dispatch(navigate('/temperature-page'))}">Don't Show Again</a>
          </div>
    `;
	}

	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
	}

}

window.customElements.define('instructions-page', InstructionsPage);
