var current_temperature = 'ambient';
/** ================ Handlers == */

function nativeDataUpdateHandler(data) {
	
	if(data.data_source != 'SensorValue') return;

	var ambient_temperature = parseFloat(data.variables.ambient_temperature).toFixed(1);
	var	object_temperature = parseFloat(data.variables.object_temperature).toFixed(1);
	var	humidity = parseFloat(data.variables.humidity).toFixed(1);

	temperature = current_temperature == 'ambient' ? ambient_temperature : object_temperature;
	if(document.getElementById('fahrenheit').checked == true) {
		temperature = Celsius2Farenheit(temperature).toFixed(1);
		var tempValue = parseFloat(document.getElementById('temp-value1').textContent);
		document.getElementById('scale-svg').style.top = ((tempValue-77)*3)+'px';		//setting temperature scale
	} else {
		document.getElementById('scale-svg').style.top = ((temperature-25)*7)+'px';		//setting temperature scale
	}
	
	SetValues(temperature, humidity);
}

/**
 * Convert celsius value to farnheit value
 * @param {float} value [celsius value]
 */
function Celsius2Farenheit(value) {
	return value*1.8 + 32;
}


function SetValues(_temperature, _humidity) {
	document.getElementById('temp-value1').textContent = _temperature+'°';		
	document.getElementById('humidity-value1').textContent = _humidity+'%';
}