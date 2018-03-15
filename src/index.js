import 'reset-css/reset.css';
import 'material-design-lite/material.min.css';
import './sass/styles.scss';

import 'material-design-lite/material.min.js';
import 'webview-tile-header/WebViewTileHeader.js';

import headerSettingsIcon from './img/icon-settings.svg';

import Settings from './lib/Settings';
import * as Pages from './lib/Pages';
import TemperatureUnit from './enums/TemperatureUnit';

const defaultSettings = {
    units: TemperatureUnit.Celsius
};
Settings.setPrefix('hat');
const settings = Settings.Load(defaultSettings);

Nexpaq.Header._detectCurrentPlatform();
Nexpaq.Header.create('Temperature');
Nexpaq.Header.customize({color: 'white', iconColor:'white', backgroundColor:'#FFB931', borderBottom:'none'});
Nexpaq.Header.hideShadow();
Nexpaq.Header.addButton({image: headerSettingsIcon}, () => Pages.showSettingsPage());
Nexpaq.Header.addEventListener('BackButtonClicked', () => {
    if(Pages.currentPage == 'main') {
        Nexpaq.API.Exit();
    } else {
        Pages.showMainPage();
    }
});
document.getElementById('button-snapshot').addEventListener('click', () => Pages.showSnapshotPage());
document.getElementById('button-cancel').addEventListener('click', () => Pages.showMainPage());