var degree = "c";

function setTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  document.getElementById('time').textContent = hours + ':' + minutes + ' ' + ampm;;
}

function setDate(date) {
  var month = date.getMonth()+1;
  month = month <= 9 ? '0' + month : month;       // add 0 for single digit numbers
  document.getElementById('date').textContent = month + "/" + date.getDate() + "/" + date.getFullYear() + " — ";
}

function Celsius2Farenheit(value) {
  return value*1.8 + 32;
}

function Farenheit2Celsius(value) {
  return (value-32)/1.8;
}

function changeMeasureTypeHandler(e) {
  document.getElementById('button-object').classList.toggle('active');
  if(document.getElementById('button-object').classList.contains('active')) {
    current_temperature = 'object';
    document.getElementById('temp-title').textContent = "Object Temperature";
  }
  else {
    current_temperature = 'ambient';
    document.getElementById('temp-title').textContent = "Ambient Temperature";
  }
}

function settingsHandler(e) {
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('snapshot-screen').classList.add('hidden');
  document.getElementById('settings-screen').classList.remove('hidden');
  Nexpaq.Header.setTitle("Settings");
  Nexpaq.Header.cleanButtons();
}

function cloudUploadHandler() {
  try {
    var cardTitle = document.getElementById("label").value;
    var resultHumid = window.current_humidity;
    var resultTemp = window.current_temp;
    if(resultHumid != undefined) {
      var name1 = "nexpaq.hat.humidity";
      var params1 = {value:resultHumid};
      if (cardTitle != "") {
        params1.title = cardTitle;
      }
      console.log(params1);
      Nexpaq.API.saveDataset(name1,params1,cloudResponse, cloudError);
    }
    if(resultTemp != undefined) {
      var name2 = "nexpaq.hat.temperature";
      var params2 = {value:resultTemp};
      if (cardTitle != "") {
        params2.title = cardTitle;
      }
      console.log(params2);
      Nexpaq.API.saveDataset(name2,params2,cloudResponse, cloudError);
    }
  }
  catch(e) {
      var x = document.getElementById("snackbar");
      x.textContent = "Failed!";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}

function cloudResponse(response) {
  if(JSON.parse(response).state == 'success') {
    console.log("saved");
    var x = document.getElementById("snackbar");
    x.textContent = "Saved";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}

function cloudError(error) {
  var x = document.getElementById("snackbar");
  x.textContent = "Error " + JSON.parse(error).error_code + " : " + JSON.parse(error).message;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function beforeExitActions() {
  Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StopSensor', []);
  
}

document.addEventListener('NexpaqAPIReady', function(event) {
    SetValues(0, 0);
    Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartSensor', []);
        
    Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
      // we don't care about data not related to our module
      if(event.module_uuid != Nexpaq.Arguments[0]) return;
      nativeDataUpdateHandler(event);

    });  
    Nexpaq.API.addEventListener('BeforeExit', beforeExitActions);
});  

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
  Nexpaq.Header.create("Temperature");
  Nexpaq.Header.customize({color: "white", iconColor:"white", backgroundColor:"#FFB931", borderBottom:"none"});
	Nexpaq.Header.addButton({image:"img/icon-settings.svg"}, settingsHandler);
  Nexpaq.Header.hideShadow();

  document.getElementById('celsius').addEventListener('click', function() {
    if(document.getElementById('fahrenheit').checked == true) {
      document.getElementById('temp-value1').textContent = Farenheit2Celsius(parseInt(document.getElementById('temp-value1').textContent)).toFixed(1)+"°";
    }
    document.getElementById('fahrenheit').checked = false;
    document.getElementById('celsius').checked = true;
  });

  document.getElementById('fahrenheit').addEventListener('click', function() {
    if(document.getElementById('celsius').checked == true) {
      document.getElementById('temp-value1').textContent = Celsius2Farenheit(parseInt(document.getElementById('temp-value1').textContent)).toFixed(1)+"°";
    }
    document.getElementById('celsius').checked = false;
    document.getElementById('fahrenheit').checked = true;
  });
	
  document.getElementById('button-object').addEventListener('click', changeMeasureTypeHandler);
  document.getElementById('button-snapshot').addEventListener('click', function() {
    var current_date = new Date();
    setDate(current_date);
    setTime(current_date);
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('snapshot-screen').classList.remove('hidden');
    document.getElementById('measurement_table').classList.remove('slideright');
    document.getElementById('measurement_table').classList.remove('slideleft');
    document.getElementById('measurement_table').classList.add('slidedown');
    document.getElementById('temp-value2').textContent = document.getElementById('temp-value1').textContent;
    document.getElementById('humidity-value2').textContent = document.getElementById('humidity-value1').textContent;

  });

    document.getElementById('button-cancel').addEventListener('click', function() {
    document.getElementById('measurement_table').classList.remove('slidedown');
    document.getElementById('measurement_table').classList.remove('slideright');
    document.getElementById('measurement_table').classList.add('slideleft');
    setTimeout(function() {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById("label").value = "";
      document.getElementById('result-screen').classList.remove('hidden');
    },1000);
  });

  document.getElementById('button-history').addEventListener('click', function() {
    cloudUploadHandler();
  
    document.getElementById('measurement_table').classList.remove('slideleft');
    document.getElementById('measurement_table').classList.remove('slidedown');
    document.getElementById('measurement_table').classList.add('slideright');
    setTimeout(function() {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById("label").value = "";
      document.getElementById('result-screen').classList.remove('hidden');
    },1000);
  });

  Nexpaq.Header.addEventListener('BackButtonClicked', function(e) {
    if(!document.getElementById('settings-screen').classList.contains('hidden')) {
      Nexpaq.Header.setTitle("Temperature");
      Nexpaq.Header.cleanButtons();
      Nexpaq.Header.addButton({image:"img/icon-settings.svg"}, settingsHandler);
      document.getElementById('settings-screen').classList.add('hidden');
      document.getElementById('result-screen').classList.remove('hidden');
      if(document.getElementById('fahrenheit').checked) {
        document.getElementById('scale-svg').style.backgroundImage = "url('./img/fahrenheit_scale.svg')";
        document.getElementById('svg-container').style.width = "79px";
        document.getElementById('line-svg').style.left = "57%";
        var tempValue = parseFloat(document.getElementById('temp-value1').textContent);
        document.getElementById('scale-svg').style.top = ((tempValue-77)*3)+'px';
      } else {
        document.getElementById('scale-svg').style.backgroundImage = "url('./img/celsius_scale.svg')";
        document.getElementById('svg-container').style.width = "73px";
        document.getElementById('line-svg').style.left = "54%";
        var tempValue = parseFloat(document.getElementById('temp-value1').textContent);
        document.getElementById('scale-svg').style.top = ((tempValue-25)*7)+'px';
      }
    }
      else if(document.getElementById('result-screen').classList.contains('hidden')) {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById('result-screen').classList.remove('hidden');
    } else {
        Nexpaq.API.Exit();
    }
  });
	
});
