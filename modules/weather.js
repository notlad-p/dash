// fetch api data 
async function getApiData(api) {
  let response = await fetch(api);

  let data = await response.json();

  return data;
}

// Weather

// check if weather API has been updated in the last 15mins
let apiTime = localStorage.getItem('apiTime');
let timeDiff;

// Check api time
function checkApiTime() {
  setInterval(function() {
    if (!apiTime) {
      console.log('no api time');
      // set initial apiTime
      localStorage.setItem('apiTime', Date.now());
    } else if (apiTime) {
      timeDiff =  Math.round((Date.now() - parseInt(localStorage.getItem('apiTime'))) / 1000);
      // update apiTime, temp, and icon every 15mins 
      if (timeDiff >= 900) { //900
        console.log('api updated');
        localStorage.setItem('apiTime', Date.now());
        currentLocation();
      }
    }
    console.log(timeDiff);
  }, 10000);
}


// get current location and data from OpenWeatherMap API
const locationIcon = document.querySelector('.location-icn');
locationIcon.addEventListener('click', ()=> {
  currentLocation();
});

function currentLocation() {
  let long;
  let lat;

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      // if location permission allowed
      // asign longitude and latitutde
      long = position.coords.longitude;
      lat = position.coords.latitude;
  
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${config.OWM_KEY}`;

      // get api data based on current location
      getApiData(api)
        .then(data => {
          // update info on screen once response from api received
          updateInfo(data.name, Math.round(data.main.temp), data.weather[0].icon);
        })
        .catch(err => console.error(err));
  
      // remove location icon
      locationIcon.style.display = 'none';
    }, () => {
      // if location permission denied
      alert('Allow geolocation to get local weather');
    });
  }
}

// update city name, temperature, and weather icon
const cityInput = document.querySelector('.city');
const tempPar = document.querySelector('.temp');
const weatherIcon = document.querySelector('.weather-icn-container');

function updateInfo(city, temp, icon) {
  localStorage.setItem('city', city);
  localStorage.setItem('temp', temp);
  localStorage.setItem('icon', icon);

  cityInput.innerHTML = city;
  tempPar.innerHTML = `${temp}&degF`;
  weatherIcon.innerHTML = `<img src=${getWeatherIcon(icon)} alt="weather icon" class="weather-icn"></img>`;
}

function getWeatherIcon(icn) {
  const iconsObj = {
    'cloud': 'img/icons/weather/cloud.png',
    'moon': 'img/icons/weather/moon.png',
    'partly cloudy': 'img/icons/weather/partly-cloudy.png',
    'rain': 'img/icons/weather/rain.png',
    'snow': 'img/icons/weather/snow.png',
    'storm': 'img/icons/weather/storm.png',
    'sunny': 'img/icons/weather/sunny.png',
    'wind': 'img/icons/weather/wind.png'
  };

  // desides which icon will be used based on api icon data
  if (icn === '03d' || icn === '03n' || icn === '04d' || icn === '04n'){
    return iconsObj.cloud;
  } else if (icn === '01n') {
    return iconsObj.moon;
  } else if (icn === '02d' || icn === '02n') {
    return iconsObj["partly cloudy"];
  } else if (icn === '09d' || icn === '09n' || icn === '10d' || icn === '10n') {
    return iconsObj.rain;
  } else if (icn === '13d' || icn === '13n') {
    return iconsObj.snow;
  } else if (icn === '11d' || icn === '11n') {
    return iconsObj.storm;
  } else if (icn === '01d') {
    return iconsObj.sunny;
  } else if (icn === '50d' || icn === '50n') {
    return iconsObj.wind;
  }
}

// if local storage variables exist use them on load
function updateWeather() {
  if (localStorage.getItem('city')) {
    console.log('used local storage variables');
    let cityL = localStorage.getItem('city');
    let tempL = localStorage.getItem('temp');
    let iconL = localStorage.getItem('icon');
   
    cityInput.innerHTML = cityL;
    tempPar.innerHTML = `${tempL}&degF`;
    weatherIcon.innerHTML = `<img src=${getWeatherIcon(iconL)} alt="weather icon" class="weather-icn"></img>`;
  
    locationIcon.style.display = 'none';
  } else {
    currentLocation();
  }
}

 export { checkApiTime,  updateWeather};