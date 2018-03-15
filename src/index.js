import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import './sass/styles.scss';

import 'material-design-lite/material.min.js';
import 'webview-tile-header/WebViewTileHeader.js';

import headerSettingsIcon from './img/icon-settings.svg';

console.log(headerSettingsIcon);

Nexpaq.Header.create('Temperature');
Nexpaq.Header.customize({color: 'white', iconColor:'white', backgroundColor:'#FFB931', borderBottom:'none'});
Nexpaq.Header.hideShadow();
Nexpaq.Header.addButton({image: headerSettingsIcon}, null);