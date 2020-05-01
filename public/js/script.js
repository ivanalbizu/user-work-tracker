const fetchQuery = async (url, method, data) => {
  let config = {};
  if(method == 'POST') {
    config = {
      method: method,
      body: JSON.stringify(data),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  }
  try {
    const res = await fetch(url, config);
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

const timeToMinutes = time => {
  const a = time.split(':');
  return (+a[0]) * 60 + (+a[1]);
}

const submit = document.getElementById('submit');
const loginForm = document.getElementById('login-form');
const wrapperBtns = document.getElementById('wrapper-btns');
const startDayBtn = document.getElementById('start-day');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const dateTrack = document.querySelectorAll('.date-track');

const today = new Date();
const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});
const getTime = today => today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});


console.log(today.toLocaleString(window.navigator.language, {weekday: 'long'}));
const totalDayTime = timeToMinutes('17:30') - timeToMinutes('08:00');

dateTrack.forEach(ul => {
  let start, end;
  const lis = ul.querySelectorAll('li');

  lis.forEach(li => {
    start = li.getAttribute('data-start');
    if(li.getAttribute('data-end')) {
      end = li.getAttribute('data-end');
    } else {
      end = getTime(today);
      li.classList.add('is-now');
    }
    li.style.width = `${((timeToMinutes(end) - timeToMinutes(start)) / totalDayTime) * 100}%`;
  })
  const lastLi = document.createElement('li');
  const span = document.createElement('span');
  span.innerHTML = end;
  lastLi.appendChild(span);
  lastLi.style.width = '0px';
  ul.appendChild(lastLi);
})

const updateDayTracker = () => {
  const ul = document.querySelector(`[data-date="${getDate(today)}"] .date-track`);
  const li = document.createElement('li');  
  const span = document.createElement('span');
  span.innerHTML = getTime(today);

  li.appendChild(span);

  ul.insertBefore(li, ul.lastChild);
}

const updateBtnTrackDOM = async () => {
  const data = await fetchQuery('http://localhost:8080/user/dom', 'GET', {});
  const date = data?.tracking[getDate(today)];

  startDayBtn.style.display = 'none';
  startDayBtn.removeEventListener('click', startTrack);
  playBtn.style.display = 'none';
  playBtn.removeEventListener('click', playTrack);
  pauseBtn.style.display = 'none';
  pauseBtn.removeEventListener('click', pauseTrack);
  if(!date) {
    startDayBtn.style.display = 'flex';
    startDayBtn.addEventListener('click', startTrack);
  } else {
    const item = data?.tracking[getDate(today)][date.length-1]?.time_end;
    if(item) {
      playBtn.style.display = 'flex';
      playBtn.addEventListener('click', playTrack);
    } else {
      pauseBtn.style.display = 'flex';
      pauseBtn.addEventListener('click', pauseTrack);
    }
  }
}

updateBtnTrackDOM();

// Not re-send form on refresh page
if (window.history.replaceState) window.history.replaceState(null, null, window.location.href);

const loginFormSubmit = () => {
  event.preventDefault();
  console.log('submited');
}

const startTrack = async () => {
  const data = {
    date: getDate(today),
    time: getTime(new Date())
  };

  await fetchQuery('http://localhost:8080/user/start', 'POST', data);
  updateBtnTrackDOM();
}

const playTrack = async () => {
  const data = {
    date: getDate(today),
    time: getTime(new Date())
  };
  //updateDayTracker();
  await fetchQuery('http://localhost:8080/user/play', 'POST', data);
  updateBtnTrackDOM();
}
const pauseTrack = async () => {
  const data = {
    date: getDate(today),
    time: getTime(new Date())
  };
  //updateDayTracker();
  await fetchQuery('http://localhost:8080/user/pause', 'POST', data);
  updateBtnTrackDOM();
}


//loginForm?.addEventListener('submit', loginFormSubmit);
