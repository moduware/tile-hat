let _prefix = 'tile';

function setPrefix(prefix) {
    _prefix = prefix;
}

function Load(defaultSettings) {
    const path = _prefix + 'Settings';
    if(typeof(localStorage[path]) != 'undefined') {
        const loadedSettings = JSON.parse(localStorage[path]);
        if(loadedSettings != null) {
            return loadedSettings;
        } else {
            return defaultSettings;
        }
    } else {
        return defaultSettings;
    }
}

function Save(settings) {
    const path = _prefix + 'Settings';
    const jsonSettings = JSON.stringify(settings);
    localStorage[path] = jsonSettings;
}

export default {
    setPrefix,
    Load,
    Save
};