// live time & date
const time = document.querySelector('.time');
const fullDate = document.querySelector('.date');

function currentTime() {
  let date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  
  hour = checkHour(hour);

  hour = checkZero(hour);
  min = checkZero(min);
  sec = checkZero(sec);

  time.innerHTML = hour + ':' + min + '<span class="seconds">:' + sec + '</span>';

  currentDate();

  let t = setTimeout(currentTime, 500);
}

function checkHour(i) {
  if (i === 0) {
    return 12;
  } else if (i > 12) {
    return i - 12;
  } else {
    return i;
  }
}

function checkZero(k) {
  if (k < 10) {
    return '0' + k;
  } else {
    return k;
  }
}

function currentDate() {
  let date = new Date();
  let day = date.getDate();
  let weekDay = date.getDay();
  let month = date.getMonth();
  let year = date.getFullYear();

  let daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  weekDay = daysOfWeek[weekDay];

  let monthsOfYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  month = monthsOfYear[month];

  fullDate.innerHTML = weekDay + ', ' + month + ' ' + day + ', ' + year;
}

export { currentTime };