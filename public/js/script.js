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


const startDayBtn = document.getElementById('start-day');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const dateTrack = document.querySelectorAll('.date-track');

const today = new Date();
const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});
const getTime = today => today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});


console.log(today.toLocaleString(window.navigator.language, {weekday: 'long'}));
const totalDayTime = timeToMinutes('17:30') - timeToMinutes('08:00');


// Not re-send form on refresh page
if (window.history.replaceState) window.history.replaceState(null, null, window.location.href);


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
  const date = data.tracking[getDate(today)];

  const btns = document.querySelectorAll('.btn--track');
  btns.forEach(btn => {
    btn.style.display = 'none';
    btn.classList.add('btn--disable');
  });
  startDayBtn.removeEventListener('click', startTrack);
  playBtn.removeEventListener('click', playTrack);
  pauseBtn.removeEventListener('click', pauseTrack);

  if(!date) {
    startDayBtn.style.display = 'flex';
    startDayBtn.classList.remove('btn--disable');
    startDayBtn.addEventListener('click', startTrack);
  } else {
    playBtn.style.display = 'flex';
    pauseBtn.style.display = 'flex';
    const item = data.tracking[getDate(today)][date.length-1].time_end;
    if(item) {
      playBtn.classList.remove('btn--disable');
      playBtn.addEventListener('click', playTrack);
    } else {
      pauseBtn.classList.remove('btn--disable');
      pauseBtn.addEventListener('click', pauseTrack);
    }
  }
}

if (document.getElementById('user')) updateBtnTrackDOM();


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
