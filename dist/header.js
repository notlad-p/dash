import * as time from '../modules/time.js';
import * as bookmarks from '../modules/bookmarks.js';
import * as weather from '../modules/weather.js';

// load animation
document.body.classList.add('js-loading');

function showPage() {
  document.body.classList.remove('js-loading');
}

showPage();

// Time
time.currentTime();

// Bookmarks
bookmarks.handleDB();

// Weather
weather.updateWeather();
weather.checkApiTime();