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
import { navigate, disableShowInstruction } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import { SwiperStyles } from '../vendor/swiper.min.css.js';
import Swiper from 'swiper';
import './icons.js';
import { registerTranslateConfig, use, translate } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';

class InstructionsPage extends connect(store)(PageViewElement) {

	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_buttonText: { type: String },
			_currentSlide: { type: Number },
			_instructionSwiper: { type: Object }
		};
	}

	static get styles() {
		return [
			SharedStyles,
			SwiperStyles,
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
        /*margin-bottom: 50px;*/
          min-height: 150px;
          margin-top: 15vh;
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
		this._buttonText = translate('slide.button.next');
		this._currentSlide = 1;

		const swiperElement = this.shadowRoot.querySelector('.swiper-container');
		const swiperPagination = this.shadowRoot.querySelector('.swiper-pagination');
		this._instructionSwiper = new Swiper(swiperElement, {
			direction: 'horizontal',
			pagination: {
				el: swiperPagination
			}
		});

		var self = this;

		this._instructionSwiper.on('slideChange', () => {
			if (self._instructionSwiper.isBeginning) {
				self._buttonText = translate('slide.button.next');
				self._currentSlide = 1;
			} else if (self._instructionSwiper.isEnd) {
				self._buttonText = translate('slide.button.gotIt');
				self._currentSlide = 2;
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
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="slide-image-container">
                  <img src="images/instruction-ambient.png" />
                </div>
                <p class="slide-note">
                  ${translate('slide.instruction.ambient')}
                </p>
              </div>
              <div class="swiper-slide">
                <p class="slide-note slide-note__heading">
                  ${translate('slide.instruction.important')}
                </p>
                <div class="slide-image-container" style="margin-top:0;">
                  <img src="images/instruction-object.png" />
                </div>
                <p class="slide-note">
                  ${translate('slide.instruction.object')}
                </p>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
          <div class="button-container">
            <a class="action-button action-button--primary" @click="${() => this._sliderButtonClickHandler()}">${this._buttonText}</a>
            <a class="action-button action-button--link" @click="${() => this._dontShowClickHandler()}">${translate('slide.noShow')}</a>
          </div>
    `;
	}

	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
	}

	_dontShowClickHandler() {
		store.dispatch(navigate('/temperature-page'));
		store.dispatch(disableShowInstruction());
	}

	_sliderButtonClickHandler() {
		if (this._currentSlide === 1) {
			this._instructionSwiper.slideNext();
		} else {
			store.dispatch(navigate('/temperature-page'));
		}
	}
}

window.customElements.define('instructions-page', InstructionsPage);
