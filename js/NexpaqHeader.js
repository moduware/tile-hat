/* Event system */
if(typeof NexpaqEvent == "undefined") {
	// Event with name and callbacks
	window.NexpaqEvent = function(name) {
		this.name = name;
		this.callbacks = [];
	};

	// We can register callbacks for our event
	NexpaqEvent.prototype.registerCallback = function(callback){
		this.callbacks.push(callback);
	};

	// We can remove callbacks for our event
	NexpaqEvent.prototype.removeCallback = function(callback){
		var index = this.callbacks.indexOf(callback);
		if(index >= 0) {
			this.callbacks.splice(index, 1);
		}
	};
}

var NexpaqHeader = {
	version: '1.0.5',
	Events: {
		BackButtonClicked: new NexpaqEvent('BackButtonClicked')
	},
	_node: null,
	_buttons: null,
	_backButton: null,
	_title: '',
	_titleArray: [],

	addEventListener: function(eventName, callback) {
		this.Events[eventName].registerCallback(callback);
	},

	removeEventListener: function(eventName, callback) {
		this.Events[eventName].removeCallback(callback);
	},

	dispatchEvent: function(eventName, eventArgs) {
		this.Events[eventName].callbacks.forEach(function(callback){
			callback(eventArgs);
		});
	},

	_detectCurrentPlatform : function() {
		var platform = (function getMobileOperatingSystem() {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			// Windows Phone must come first because its UA also contains "Android"
			if (/windows phone/i.test(userAgent)) {
				return "winphone";
			}

			if (/android/i.test(userAgent)) {
				return "android";
			}

			// iOS detection from: http://stackoverflow.com/a/9039885/177710
			if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
				return "ios";
			}

			return "unknown";
		})();

		document.body.classList.add('platform-' + platform);
		console.log("platform is: " + platform);
	},

	_backButtonClickHandler: function(e) {
		console.log("back button clicked");
	},

	exists: function() {
		return this._node != null;
	},

	create: function(title, root) {
		title = title || '';
		root = root || document.body;
		if(this.exists()) throw "NexpaqHeader already exists!";

		this._title = title;

		// HTML
		var node = document.createElement('div');
		node.id = 'nexpaq-header';
		node.innerHTML = atob(nxp_header_html);
		node.children[0].textContent = this._title;
		var header = this;
		node.children[1].addEventListener('click', function(e) {
			header._backButtonClickHandler();
			header.dispatchEvent('BackButtonClicked', e);
		});
		
		this._node = node;
		root.insertBefore(this._node, null);
		this._buttons = document.getElementById('nxp-buttons-container');
		this._backButton = document.getElementById('nxp-button-back');

		// CSS
		var header_style = document.createElement('style');
		header_style.appendChild(document.createTextNode(''));
		header_style.textContent = atob(nxp_header_css);
		document.head.appendChild(header_style);
	},

	/**
	 * Show header
	 * @param {string} title [title to be shown in header]
	 * @return {void}
	 */
	show: function() {
		if(!this.exists()) {
			this.create();
		}
		
		this.node.classList.remove('nxp-hidden');
	},

	setTitle: function(title) {
		title = title || '';
		this._title = title;

		this._node.children[0].textContent = this._title;
	},

	/**
	 * Hide header
	 * @return {void}
	 */
	hide: function() {
		if(this.exists()) this.node.classList.add('nxp-hidden');
	},

	remove: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";

		this._node.parentNode.removeChild(this._node);
	},

	/**
	 * Show shadow of header
	 * @return {void}
	 */
	showShadow: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		this._node.classList.remove('nxp-no-shadow');
	},
	/**
	 * Hide shadow of header
	 * @return {void}
	 */
	hideShadow: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		this._node.classList.add('nxp-no-shadow');
	},
	/**
	 * Add new button to header
	 * @param {string} settings [can be a simple url to icon image]
	 * @param {object} settings [or an object with optional fields title and image]
	 * @param {function} handler [js function to handle button tap event]
	 * @return {void}
	 */
	addButton: function(settings, handler) {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		var default_settings = {
			id: null,
			title: 'action',
			image: null,
			width: null,
			height: null,
			number: 0
		};

		settings = settings || default_settings;

		var button = document.createElement('button');
		// We can assign ID to button so we can refer to it in future
		if(settings.id != null) {
			button.id = settings.id;
		}
		// We can set title to our button with or instead of image
		if(settings.title != null) {
			button.textContent = settings.title;
		}
		// We can set number of notifications for the button on creation
		if(settings.number != null) {
			var number = document.createElement('div');
			number.classList.add('nxp-button-number');
			var value = parseInt(settings.number);
			number.textContent = value == 0 ? '' : value;

			button.insertBefore(number, null);
		}		
		// We can set image for our button
		if(settings.image != null) {
			var image = document.createElement('img');
			image.src = settings.image;
			// And specify custom with and\or height for it
			if(settings.width != null) image.width = settings.width;
			if(settings.height != null) image.height = settings.height;
			
			button.insertBefore(image, null);
		}
		

		// insterting created button
		button.addEventListener('click', handler);
		this._buttons.insertBefore(button, null);
	},
	/**
	 * Make buttons of header untappable
	 * @return {void}
	 */
	disableButtons: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		this._buttons.classList.add('nxp-buttons-container--disabled');
	},
	/**
	 * Enable buttons of header back and make them tappable
	 * @return {void}
	 */
	enableButtons: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		this._buttons.classList.remove('nxp-buttons-container--disabled');
	},
	/**
	 * Remeve all buttons from header
	 * @return {void}
	 */
	cleanButtons: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		this._buttons.innerHTML = '';
	},

	/**
	 * Add new button to header
	 * @param {string} id [id of button, can be set during button creation]
	 * @param {int} number [number to show for button, 0 is hidden]
	 * @return {void}
	 */
	setButtonNumber: function(id, number) {
		var button = document.getElementById(id);
		if(button == null) throw "Cannot find button with specified ID";

		var number = button.children[0];
		var value = parseInt(number);

		number.textContent = value == 0 ? '' : value
	},
	/**
	 * Make back button invisible
	 * @return {void}
	 */
	hideBackButton: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";
		
		this._node.classList.add('nxp-back-button-hidden');
		this._backButton.classList.add('nxp-hidden');
	},
	/**
	 * Make back button visible
	 * @return {void}
	 */
	showBackButton: function() {
		if(!this.exists()) throw "NexpaqHeader not exists!";

		this._node.classList.remove('nxp-back-button-hidden');
		this._backButton.classList.remove('nxp-hidden');
	},
	
	/**
	 * Set custom icon for back button
	 * @param {string} icon [url of icon to be used instead of default icon]
	 * @return {void}
	 */
	setBackButtonIcon: function(icon) {
		if(!this.exists()) throw "NexpaqHeader not exists!";

		var image = this._node.getElementsByClassName('npx-button-back-custom')[0];
		image.src = icon;

		this._node.classList.add('nxp-custom-back-button');
	},
	/**
	 * Restore standard icon for back button
	 * @return {void}
	 */
	resetBackButtonIcon: function() {
		this._node.classList.remove('nxp-custom-back-button');
	},
	/**
	* @param {object} {
		color: {string},
		backgroundColor: {string},
		opacity: {number} (0.0-1.0),
		borderBottom(box-shadow): {string},
		iconColor: {string}
	}
	*/
	customize: function(data) {
		if(!this.exists()) throw "NexpaqHeader not exists!";

		if(typeof data !== "object") {
			throw "Data must be an object";
		} else {
			if(data.hasOwnProperty('color')) {
				if(typeof data.color !== "string") {throw "Color has to be string."}
				this._node.style.color = data.color;
			}
			if(data.hasOwnProperty('backgroundColor')) {
				if(typeof data.backgroundColor !== "string") {throw "Background color has to be string."}
				this._node.style.backgroundColor = data.backgroundColor;
			}
			if(data.hasOwnProperty('opacity')) {
				if(typeof data.opacity !== "number" || data.opacity < 0.0 || data.opacity > 1.0) {throw "Opacity has to be number and needs to be between 0.0 - 1.0"};
				this._node.style.opacity = data.opacity;
			}
			if(data.hasOwnProperty('borderBottom')) {
				if(typeof data.borderBottom !== "string") {throw "Border-bottom has to be string."}
				document.querySelector("#nexpaq-header:not(.nxp-no-shadow)").style.boxShadow = data.borderBottom;
			}
			if(data.hasOwnProperty('iconColor')) {
				if(typeof data.iconColor !== "string") {throw "Icon color has to be string."}
				if (document.getElementsByTagName('body')[0].classList.contains("platform-android")) {
					document.querySelector('.nxp-svg-shape').setAttribute("fill",data.iconColor);
				}
				if (document.getElementsByTagName('body')[0].classList.contains("platform-ios")) {
					document.getElementById("Combined-Shape").setAttribute("fill",data.iconColor);
				}
			}
		}
	}
};

// If header initialized after API just plugging in, otherwise creating main Nexpaq object
if(typeof(Nexpaq) != 'undefined') {
	Nexpaq.Header = NexpaqHeader;
} else {
	window.Nexpaq = {
		Header: NexpaqHeader
	};
}

// Nexpaq.API will call 'NexpaqAPIReady function when it is ready, turning it into document event
var NexpaqAPIReadyEvent = new Event('NexpaqAPIReady');
function NexpaqAPIReady() {
	document.dispatchEvent(NexpaqAPIReadyEvent);
}

// When API is ready it can override main Nexpaq object we initialized, so plugging back
document.addEventListener('NexpaqAPIReady', function(event) {
	Nexpaq.Header = NexpaqHeader;
});

document.addEventListener('DOMContentLoaded', function(event) {
	NexpaqHeader._detectCurrentPlatform();
	var injector_js = atob(svg_injector);
	eval(injector_js);
});

// Default back button handler tries to close current instance, 
// if there are any other callback for back button click, it will do nothing
NexpaqHeader.addEventListener('BackButtonClicked', function(event) {
	if(NexpaqHeader.Events.BackButtonClicked.callbacks.length > 1) return;
	Nexpaq.API.Exit();
});


// =========== nexpaq header built-in resources ====
var nxp_header_html = 'PGgxPlRpdGxlPC9oMT4gPGJ1dHRvbiBjbGFzcz1ueHAtYnRuLWJhY2sgaWQ9bnhwLWJ1dHRvbi1iYWNrPiA8c3ZnIHdpZHRoPTEycHggaGVpZ2h0PTE1cHggdmlld0JveD0iOCAzNSAxMiAxNSIgY2xhc3M9bnhwLWJ1dHRvbi1iYWNrLWlvcz4gPHBhdGggZD0iTTEwLjAxNTg3MDMsNDEuOTkwNDg4MyBDOS45NjIyNTM3LDQxLjYwMDI4MjggMTAuMDg0NzY1OSw0MS4xOTA5NDY5IDEwLjM3OTgyNTQsNDAuODk1ODg3MyBMMTUuODk1ODg3MywzNS4zNzk4MjU0IEMxNi40MDE2MTgyLDM0Ljg3NDA5NDUgMTcuMjE5MjU0OSwzNC44NzE3Nzk0IDE3LjczMDAyODYsMzUuMzgyNTUzMSBDMTguMjM3MjY1OSwzNS44ODk3OTA0IDE4LjIzMjM3ODksMzYuNzE3MDcxNiAxNy43MzI3NTYyLDM3LjIxNjY5NDMgTDEyLjk0NzY0MjQsNDIuMDAxODA4MiBMMTcuNzMyNzU2Miw0Ni43ODY5MjIgQzE4LjIzODQ4NzEsNDcuMjkyNjUyOSAxOC4yNDA4MDIzLDQ4LjExMDI4OTYgMTcuNzMwMDI4Niw0OC42MjEwNjMzIEMxNy4yMjI3OTEzLDQ5LjEyODMwMDYgMTYuMzk1NTEsNDkuMTIzNDEzNSAxNS44OTU4ODczLDQ4LjYyMzc5MDkgTDEwLjM3OTgyNTQsNDMuMTA3NzI5IEMxMC4wNzU0MzI0LDQyLjgwMzMzNTkgOS45NTM0MTA5NCw0Mi4zODU5NDkyIDEwLjAxNTg3MDMsNDEuOTkwNDg4MyBaIiBpZD1Db21iaW5lZC1TaGFwZSBzdHJva2U9bm9uZSBmaWxsPSNFRTM2OTYgZmlsbC1ydWxlPWV2ZW5vZGQ+PC9wYXRoPiA8L3N2Zz4gPHN2ZyB3aWR0aD0xNnB4IGhlaWdodD0xNnB4IHZpZXdCb3g9IjAgMCAxNiAxNiIgY2xhc3M9bnhwLWJ1dHRvbi1iYWNrLWFuZHJvaWQ+IDxwb2x5Z29uIGNsYXNzPW54cC1zdmctc2hhcGUgdHJhbnNmb3JtPXRyYW5zbGF0ZSgtNCwtNCkgZmlsbC1ydWxlPWV2ZW5vZGQgZmlsbD0jRUUzNjk2IHBvaW50cz0iMjAgMTEgNy44IDExIDEzLjQgNS40IDEyIDQgNCAxMiAxMiAyMCAxMy40IDE4LjYgNy44IDEzIDIwIDEzIj48L3BvbHlnb24+IDwvc3ZnPiA8aW1nIHNyYz0iIiBjbGFzcz1ucHgtYnV0dG9uLWJhY2stY3VzdG9tPiA8L2J1dHRvbj4gPGRpdiBjbGFzcz1ueHAtYnV0dG9ucy1jb250YWluZXIgaWQ9bnhwLWJ1dHRvbnMtY29udGFpbmVyPjwvZGl2PiA8dWwgY2xhc3M9bnhwLWhlYWRlci10aXRsZXMgaWQ9bnhwLWhlYWRlci10aXRsZXM+PC91bD4g';
var nxp_header_css = 'I25leHBhcS1oZWFkZXJ7ei1pbmRleDoxMDAwMDtwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7d2lkdGg6MTAwdnc7aGVpZ2h0OjQ0cHg7cGFkZGluZzowO2ZvbnQtc2l6ZToxNnB4O2ZvbnQtd2VpZ2h0Om5vcm1hbDtsaW5lLWhlaWdodDo0NHB4O2NvbG9yOiM2MDYwNjA7Zm9udC1mYW1pbHk6Um9ib3RvLCJSb2JvdG8gUmVndWxhciIsVGFob21hLHNhbnMtc2VyaWY7dGV4dC1hbGlnbjpyaWdodDtiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfWJvZHkucGxhdGZvcm0taW9zICNuZXhwYXEtaGVhZGVyOm5vdCgubnhwLW5vLXNoYWRvdyl7Ym9yZGVyLWNvbG9yOiNjOGM3Y2M7Ym9yZGVyLXN0eWxlOnNvbGlkO2JvcmRlci13aWR0aDowIDAgLjVweCAwfWJvZHkucGxhdGZvcm0tYW5kcm9pZCAjbmV4cGFxLWhlYWRlcntoZWlnaHQ6NTVweDtwYWRkaW5nOjAgM3Z3O2xpbmUtaGVpZ2h0OjU1cHg7Y29sb3I6IzYwNjA2MDtmb250LXNpemU6MTVweDtmb250LXdlaWdodDozMDB9Ym9keS5wbGF0Zm9ybS1hbmRyb2lkICNuZXhwYXEtaGVhZGVyOm5vdCgubnhwLW5vLXNoYWRvdyl7Ym94LXNoYWRvdzowIDJweCA0cHggcmdiYSgwLDAsMCwwLjEyKX0jbmV4cGFxLWhlYWRlciBzdmd7d2lkdGg6YXV0b30jbmV4cGFxLWhlYWRlciwjbmV4cGFxLWhlYWRlciAqLCNuZXhwYXEtaGVhZGVyICogKntib3gtc2l6aW5nOmJvcmRlci1ib3h9I25leHBhcS1oZWFkZXIubnhwLWhpZGRlbiwjbmV4cGFxLWhlYWRlciAubnhwLWhpZGRlbntkaXNwbGF5Om5vbmV9I25leHBhcS1oZWFkZXIgYnV0dG9ue3BhZGRpbmc6MDttYXJnaW46MDtiYWNrZ3JvdW5kOjA7Ym9yZGVyOjA7b3V0bGluZTowfSNuZXhwYXEtaGVhZGVyPmgxe3otaW5kZXg6LTE7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7bWFyZ2luOjA7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjE3cHg7bGluZS1oZWlnaHQ6aW5oZXJpdDt0ZXh0LXRyYW5zZm9ybTppbmhlcml0O2NvbG9yOmluaGVyaXQ7Zm9udC13ZWlnaHQ6NDAwO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnR9Ym9keS5wbGF0Zm9ybS1hbmRyb2lkICNuZXhwYXEtaGVhZGVyPmgxe3RleHQtYWxpZ246bGVmdDtmb250LXNpemU6MjBweDtwYWRkaW5nLWxlZnQ6NzBweH1ib2R5LnBsYXRmb3JtLWFuZHJvaWQgI25leHBhcS1oZWFkZXIubnhwLWJhY2stYnV0dG9uLWhpZGRlbj5oMXtwYWRkaW5nLWxlZnQ6MTZweH0jbmV4cGFxLWhlYWRlciAubnhwLWJ0bi1iYWNre3BhZGRpbmc6MCAzdncgIWltcG9ydGFudDtsaW5lLWhlaWdodDppbmhlcml0fWJvZHk6bm90KC5wbGF0Zm9ybS1hbmRyb2lkKSAjbmV4cGFxLWhlYWRlciAubnhwLWJ1dHRvbi1iYWNrLWFuZHJvaWQsYm9keS5wbGF0Zm9ybS1hbmRyb2lkICNuZXhwYXEtaGVhZGVyIC5ueHAtYnV0dG9uLWJhY2staW9ze2Rpc3BsYXk6bm9uZX1ib2R5LnBsYXRmb3JtLWFuZHJvaWQgI25leHBhcS1oZWFkZXIgLm54cC1idG4tYmFjayBzdmd7bWFyZ2luLXRvcDotNHB4fSNuZXhwYXEtaGVhZGVyIC5ucHgtYnV0dG9uLWJhY2stY3VzdG9te2Rpc3BsYXk6bm9uZX0jbmV4cGFxLWhlYWRlci5ueHAtY3VzdG9tLWJhY2stYnV0dG9uIC5ucHgtYnV0dG9uLWJhY2stY3VzdG9te2Rpc3BsYXk6aW5saW5lLWJsb2NrfSNuZXhwYXEtaGVhZGVyLm54cC1jdXN0b20tYmFjay1idXR0b24gLm54cC1idXR0b24tYmFjay1hbmRyb2lkLCNuZXhwYXEtaGVhZGVyLm54cC1jdXN0b20tYmFjay1idXR0b24gLm54cC1idXR0b24tYmFjay1pb3N7ZGlzcGxheTpub25lfSNuZXhwYXEtaGVhZGVyIC5ueHAtYnV0dG9ucy1jb250YWluZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2t9I25leHBhcS1oZWFkZXIgLm54cC1idXR0b25zLWNvbnRhaW5lci5ueHAtYnV0dG9ucy1jb250YWluZXItLWRpc2FibGVke29wYWNpdHk6LjM7cG9pbnRlci1ldmVudHM6bm9uZX0jbmV4cGFxLWhlYWRlciAubnhwLWJ1dHRvbnMtY29udGFpbmVyPmJ1dHRvbntsaW5lLWhlaWdodDppbmhlcml0O3BhZGRpbmc6MCA0dncgIWltcG9ydGFudDtwb3NpdGlvbjpyZWxhdGl2ZX1ib2R5LnBsYXRmb3JtLWlvcyAjbmV4cGFxLWhlYWRlciAubnhwLWJ1dHRvbnMtY29udGFpbmVyPmJ1dHRvbntjb2xvcjojZWUzNjk2O2ZvbnQtc2l6ZToxN3B4fSNuZXhwYXEtaGVhZGVyIC5ueHAtYnV0dG9ucy1jb250YWluZXI+YnV0dG9uIC5ueHAtYnV0dG9uLW51bWJlcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE1JSkgdHJhbnNsYXRlWSgtODUlKTtwYWRkaW5nLXJpZ2h0OjFweDtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7aGVpZ2h0OjE4cHg7bWluLXdpZHRoOjE4cHg7Ym9yZGVyOjJweCBzb2xpZCB3aGl0ZTtib3JkZXItcmFkaXVzOjlweDtiYWNrZ3JvdW5kLWNvbG9yOiMwMWNmOWY7Zm9udC1zaXplOjEwcHg7Y29sb3I6d2hpdGU7bGluZS1oZWlnaHQ6MWVtfSNuZXhwYXEtaGVhZGVyIC5ueHAtYnV0dG9ucy1jb250YWluZXI+YnV0dG9uIC5ueHAtYnV0dG9uLW51bWJlcjplbXB0eXtkaXNwbGF5Om5vbmV9I25leHBhcS1oZWFkZXIgLm54cC1idXR0b25zLWNvbnRhaW5lcj5idXR0b246bGFzdC1jaGlsZHtwYWRkaW5nLXJpZ2h0OjN2dyAhaW1wb3J0YW50fSNuZXhwYXEtaGVhZGVyIC5ueHAtYnRuLWJhY2sgc3ZnLCNuZXhwYXEtaGVhZGVyIC5ueHAtYnRuLWJhY2sgaW1nLCNuZXhwYXEtaGVhZGVyIC5ueHAtYnV0dG9ucy1jb250YWluZXI+YnV0dG9uPnN2ZywjbmV4cGFxLWhlYWRlciAubnhwLWJ1dHRvbnMtY29udGFpbmVyPmJ1dHRvbj5pbWd7dmVydGljYWwtYWxpZ246bWlkZGxlfSNuZXhwYXEtaGVhZGVyIC5ueHAtYnRuLWJhY2t7ZmxvYXQ6bGVmdDttYXgtd2lkdGg6NDRweH0jbmV4cGFxLWhlYWRlci5tdWx0aS10aXRsZT5oMTo6YWZ0ZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y29udGVudDonJzt3aWR0aDowO2hlaWdodDowO21hcmdpbi1sZWZ0OjEwcHg7Ym9yZGVyOjRweCBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItd2lkdGg6NXB4IDRweCAwO2JvcmRlci10b3AtY29sb3I6Y3VycmVudENvbG9yfSNuZXhwYXEtaGVhZGVyLm11bHRpLXRpdGxlLnRpdGxlLXNlbGVjdGluZz5oMTo6YWZ0ZXJ7Ym9yZGVyLXRvcDowO2JvcmRlci1ib3R0b206NXB4IHNvbGlkICM2MDYwNjB9I25leHBhcS1oZWFkZXIgLm54cC1oZWFkZXItdGl0bGVze3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbjowO2ZvbnQtc2l6ZToxN3B4O3RleHQtYWxpZ246bGVmdDtjb2xvcjojNjA2MDYwO2JhY2tncm91bmQtY29sb3I6d2hpdGU7bGlzdC1zdHlsZTpub25lO3BhZGRpbmc6MCAwIDEwcHggMDt3aWR0aDoxMDB2dztoZWlnaHQ6Y2FsYygxMDB2aCAtIDQ0cHgpO21hcmdpbi1sZWZ0Oi0zdnd9I25leHBhcS1oZWFkZXIgLm54cC1oZWFkZXItdGl0bGVzIGxpe2xpbmUtaGVpZ2h0OjQ1cHg7cGFkZGluZzowIDN2dztib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZTRlNGU0fSNuZXhwYXEtaGVhZGVyIC50aXRsZS1zZWxlY3Rpbmd7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2U0ZTRlNH0jbmV4cGFxLWhlYWRlcjpub3QoLnRpdGxlLXNlbGVjdGluZykgLm54cC1oZWFkZXItdGl0bGVze2Rpc3BsYXk6bm9uZX0=';
var svg_injector = 'IWZ1bmN0aW9uKHQsZSl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIHIodCl7dD10LnNwbGl0KCIgIik7Zm9yKHZhciBlPXt9LHI9dC5sZW5ndGgsbj1bXTtyLS07KWUuaGFzT3duUHJvcGVydHkodFtyXSl8fChlW3Rbcl1dPTEsbi51bnNoaWZ0KHRbcl0pKTtyZXR1cm4gbi5qb2luKCIgIil9dmFyIG49ImZpbGU6Ij09PXQubG9jYXRpb24ucHJvdG9jb2wsaT1lLmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoImh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjQmFzaWNTdHJ1Y3R1cmUiLCIxLjEiKSxvPUFycmF5LnByb3RvdHlwZS5mb3JFYWNofHxmdW5jdGlvbih0LGUpe2lmKHZvaWQgMD09PXRoaXN8fG51bGw9PT10aGlzfHwiZnVuY3Rpb24iIT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yO3ZhciByLG49dGhpcy5sZW5ndGg+Pj4wO2ZvcihyPTA7bj5yOysrcilyIGluIHRoaXMmJnQuY2FsbChlLHRoaXNbcl0scix0aGlzKX0sYT17fSxsPTAscz1bXSx1PVtdLGM9e30sZj1mdW5jdGlvbih0KXtyZXR1cm4gdC5jbG9uZU5vZGUoITApfSxwPWZ1bmN0aW9uKHQsZSl7dVt0XT11W3RdfHxbXSx1W3RdLnB1c2goZSl9LGQ9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPTAscj11W3RdLmxlbmd0aDtyPmU7ZSsrKSFmdW5jdGlvbihlKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dVt0XVtlXShmKGFbdF0pKX0sMCl9KGUpfSx2PWZ1bmN0aW9uKGUscil7aWYodm9pZCAwIT09YVtlXSlhW2VdaW5zdGFuY2VvZiBTVkdTVkdFbGVtZW50P3IoZihhW2VdKSk6cChlLHIpO2Vsc2V7aWYoIXQuWE1MSHR0cFJlcXVlc3QpcmV0dXJuIHIoIkJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCIpLCExO2FbZV09e30scChlLHIpO3ZhciBpPW5ldyBYTUxIdHRwUmVxdWVzdDtpLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKDQ9PT1pLnJlYWR5U3RhdGUpe2lmKDQwND09PWkuc3RhdHVzfHxudWxsPT09aS5yZXNwb25zZVhNTClyZXR1cm4gcigiVW5hYmxlIHRvIGxvYWQgU1ZHIGZpbGU6ICIrZSksbiYmcigiTm90ZTogU1ZHIGluamVjdGlvbiBhamF4IGNhbGxzIGRvIG5vdCB3b3JrIGxvY2FsbHkgd2l0aG91dCBhZGp1c3Rpbmcgc2VjdXJpdHkgc2V0dGluZyBpbiB5b3VyIGJyb3dzZXIuIE9yIGNvbnNpZGVyIHVzaW5nIGEgbG9jYWwgd2Vic2VydmVyLiIpLHIoKSwhMTtpZighKDIwMD09PWkuc3RhdHVzfHxuJiYwPT09aS5zdGF0dXMpKXJldHVybiByKCJUaGVyZSB3YXMgYSBwcm9ibGVtIGluamVjdGluZyB0aGUgU1ZHOiAiK2kuc3RhdHVzKyIgIitpLnN0YXR1c1RleHQpLCExO2lmKGkucmVzcG9uc2VYTUwgaW5zdGFuY2VvZiBEb2N1bWVudClhW2VdPWkucmVzcG9uc2VYTUwuZG9jdW1lbnRFbGVtZW50O2Vsc2UgaWYoRE9NUGFyc2VyJiZET01QYXJzZXIgaW5zdGFuY2VvZiBGdW5jdGlvbil7dmFyIHQ7dHJ5e3ZhciBvPW5ldyBET01QYXJzZXI7dD1vLnBhcnNlRnJvbVN0cmluZyhpLnJlc3BvbnNlVGV4dCwidGV4dC94bWwiKX1jYXRjaChsKXt0PXZvaWQgMH1pZighdHx8dC5nZXRFbGVtZW50c0J5VGFnTmFtZSgicGFyc2VyZXJyb3IiKS5sZW5ndGgpcmV0dXJuIHIoIlVuYWJsZSB0byBwYXJzZSBTVkcgZmlsZTogIitlKSwhMTthW2VdPXQuZG9jdW1lbnRFbGVtZW50fWQoZSl9fSxpLm9wZW4oIkdFVCIsZSksaS5vdmVycmlkZU1pbWVUeXBlJiZpLm92ZXJyaWRlTWltZVR5cGUoInRleHQveG1sIiksaS5zZW5kKCl9fSxoPWZ1bmN0aW9uKGUsbixhLHUpe3ZhciBmPWUuZ2V0QXR0cmlidXRlKCJkYXRhLXNyYyIpfHxlLmdldEF0dHJpYnV0ZSgic3JjIik7aWYoIS9cLnN2Zy9pLnRlc3QoZikpcmV0dXJuIHZvaWQgdSgiQXR0ZW1wdGVkIHRvIGluamVjdCBhIGZpbGUgd2l0aCBhIG5vbi1zdmcgZXh0ZW5zaW9uOiAiK2YpO2lmKCFpKXt2YXIgcD1lLmdldEF0dHJpYnV0ZSgiZGF0YS1mYWxsYmFjayIpfHxlLmdldEF0dHJpYnV0ZSgiZGF0YS1wbmciKTtyZXR1cm4gdm9pZChwPyhlLnNldEF0dHJpYnV0ZSgic3JjIixwKSx1KG51bGwpKTphPyhlLnNldEF0dHJpYnV0ZSgic3JjIixhKyIvIitmLnNwbGl0KCIvIikucG9wKCkucmVwbGFjZSgiLnN2ZyIsIi5wbmciKSksdShudWxsKSk6dSgiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgU1ZHIGFuZCBubyBQTkcgZmFsbGJhY2sgd2FzIGRlZmluZWQuIikpfS0xPT09cy5pbmRleE9mKGUpJiYocy5wdXNoKGUpLGUuc2V0QXR0cmlidXRlKCJzcmMiLCIiKSx2KGYsZnVuY3Rpb24oaSl7aWYoInVuZGVmaW5lZCI9PXR5cGVvZiBpfHwic3RyaW5nIj09dHlwZW9mIGkpcmV0dXJuIHUoaSksITE7dmFyIGE9ZS5nZXRBdHRyaWJ1dGUoImlkIik7YSYmaS5zZXRBdHRyaWJ1dGUoImlkIixhKTt2YXIgcD1lLmdldEF0dHJpYnV0ZSgidGl0bGUiKTtwJiZpLnNldEF0dHJpYnV0ZSgidGl0bGUiLHApO3ZhciBkPVtdLmNvbmNhdChpLmdldEF0dHJpYnV0ZSgiY2xhc3MiKXx8W10sImluamVjdGVkLXN2ZyIsZS5nZXRBdHRyaWJ1dGUoImNsYXNzIil8fFtdKS5qb2luKCIgIik7aS5zZXRBdHRyaWJ1dGUoImNsYXNzIixyKGQpKTt2YXIgdj1lLmdldEF0dHJpYnV0ZSgic3R5bGUiKTt2JiZpLnNldEF0dHJpYnV0ZSgic3R5bGUiLHYpO3ZhciBoPVtdLmZpbHRlci5jYWxsKGUuYXR0cmlidXRlcyxmdW5jdGlvbih0KXtyZXR1cm4vXmRhdGEtXHdbXHdcLV0qJC8udGVzdCh0Lm5hbWUpfSk7by5jYWxsKGgsZnVuY3Rpb24odCl7dC5uYW1lJiZ0LnZhbHVlJiZpLnNldEF0dHJpYnV0ZSh0Lm5hbWUsdC52YWx1ZSl9KTt2YXIgZyxtLGIseSxBLHc9e2NsaXBQYXRoOlsiY2xpcC1wYXRoIl0sImNvbG9yLXByb2ZpbGUiOlsiY29sb3ItcHJvZmlsZSJdLGN1cnNvcjpbImN1cnNvciJdLGZpbHRlcjpbImZpbHRlciJdLGxpbmVhckdyYWRpZW50OlsiZmlsbCIsInN0cm9rZSJdLG1hcmtlcjpbIm1hcmtlciIsIm1hcmtlci1zdGFydCIsIm1hcmtlci1taWQiLCJtYXJrZXItZW5kIl0sbWFzazpbIm1hc2siXSxwYXR0ZXJuOlsiZmlsbCIsInN0cm9rZSJdLHJhZGlhbEdyYWRpZW50OlsiZmlsbCIsInN0cm9rZSJdfTtPYmplY3Qua2V5cyh3KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2c9dCxiPXdbdF0sbT1pLnF1ZXJ5U2VsZWN0b3JBbGwoImRlZnMgIitnKyJbaWRdIik7Zm9yKHZhciBlPTAscj1tLmxlbmd0aDtyPmU7ZSsrKXt5PW1bZV0uaWQsQT15KyItIitsO3ZhciBuO28uY2FsbChiLGZ1bmN0aW9uKHQpe249aS5xdWVyeVNlbGVjdG9yQWxsKCJbIit0KycqPSInK3krJyJdJyk7Zm9yKHZhciBlPTAscj1uLmxlbmd0aDtyPmU7ZSsrKW5bZV0uc2V0QXR0cmlidXRlKHQsInVybCgjIitBKyIpIil9KSxtW2VdLmlkPUF9fSksaS5yZW1vdmVBdHRyaWJ1dGUoInhtbG5zOmEiKTtmb3IodmFyIHgsUyxrPWkucXVlcnlTZWxlY3RvckFsbCgic2NyaXB0Iiksaj1bXSxHPTAsVD1rLmxlbmd0aDtUPkc7RysrKVM9a1tHXS5nZXRBdHRyaWJ1dGUoInR5cGUiKSxTJiYiYXBwbGljYXRpb24vZWNtYXNjcmlwdCIhPT1TJiYiYXBwbGljYXRpb24vamF2YXNjcmlwdCIhPT1TfHwoeD1rW0ddLmlubmVyVGV4dHx8a1tHXS50ZXh0Q29udGVudCxqLnB1c2goeCksaS5yZW1vdmVDaGlsZChrW0ddKSk7aWYoai5sZW5ndGg+MCYmKCJhbHdheXMiPT09bnx8Im9uY2UiPT09biYmIWNbZl0pKXtmb3IodmFyIE09MCxWPWoubGVuZ3RoO1Y+TTtNKyspbmV3IEZ1bmN0aW9uKGpbTV0pKHQpO2NbZl09ITB9dmFyIEU9aS5xdWVyeVNlbGVjdG9yQWxsKCJzdHlsZSIpO28uY2FsbChFLGZ1bmN0aW9uKHQpe3QudGV4dENvbnRlbnQrPSIifSksZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpLGUpLGRlbGV0ZSBzW3MuaW5kZXhPZihlKV0sZT1udWxsLGwrKyx1KGkpfSkpfSxnPWZ1bmN0aW9uKHQsZSxyKXtlPWV8fHt9O3ZhciBuPWUuZXZhbFNjcmlwdHN8fCJhbHdheXMiLGk9ZS5wbmdGYWxsYmFja3x8ITEsYT1lLmVhY2g7aWYodm9pZCAwIT09dC5sZW5ndGgpe3ZhciBsPTA7by5jYWxsKHQsZnVuY3Rpb24oZSl7aChlLG4saSxmdW5jdGlvbihlKXthJiYiZnVuY3Rpb24iPT10eXBlb2YgYSYmYShlKSxyJiZ0Lmxlbmd0aD09PSsrbCYmcihsKX0pfSl9ZWxzZSB0P2godCxuLGksZnVuY3Rpb24oZSl7YSYmImZ1bmN0aW9uIj09dHlwZW9mIGEmJmEoZSksciYmcigxKSx0PW51bGx9KTpyJiZyKDApfTsib2JqZWN0Ij09dHlwZW9mIG1vZHVsZSYmIm9iamVjdCI9PXR5cGVvZiBtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1leHBvcnRzPWc6ImZ1bmN0aW9uIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZ30pOiJvYmplY3QiPT10eXBlb2YgdCYmKHQuU1ZHSW5qZWN0b3I9Zyl9KHdpbmRvdyxkb2N1bWVudCk7';
