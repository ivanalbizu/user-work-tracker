class detailSelect {
  constructor(container) {
    this.container = document.querySelector(container);
    this.options = document.querySelectorAll(`${container} > .select > .select__option`);
    this.value = this.container.querySelector('summary').textContent;
    this.mouseDown = false;
    this._addEventListeners();
    this._setAria();
    this.updateValue();
  }

  // Private function to set event listeners
  _addEventListeners() {
    this.container.addEventListener('toggle', () => {
      if (this.container.open) return;
      this.updateValue();
    })

    this.container.addEventListener('focusout', e => {
      if (this.mouseDown) return;
      this.container.removeAttribute('open');
    })

    this.options.forEach(opt => {
      opt.addEventListener('mousedown', () => {
        this.mouseDown = true;
      })
      opt.addEventListener('mouseup', () => {
        this.mouseDown = false;
        this.container.removeAttribute('open');
      })
    })

    this.container.addEventListener('keyup', e => {
      const keycode = e.which;
      const current = [...this.options].indexOf(this.container.querySelector('.active'));
      switch (keycode) {
        case 27: // ESC
          this.container.removeAttribute('open');
          break;
        case 35: // END
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[this.options.length - 1].querySelector('input'))
          break;
        case 36: // HOME
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[0].querySelector('input'))
          break;
        case 38: // UP
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[current > 0 ? current - 1 : 0].querySelector('input'));
          break;
        case 40: // DOWN
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[current < this.options.length - 1 ? current + 1 : this.options.length - 1].querySelector('input'));
          break;
      }
    })
  }

  _setAria() {
    this.container.setAttribute('aria-haspopup', 'listbox');
    const selectBox = this.container.querySelector('.select');
    selectBox.setAttribute('role', 'listbox');
    selectBox.querySelector('[type=radio]').setAttribute('role', 'option')
  }

  updateValue(e) {
    const that = this.container.querySelector('input:checked');
    if (!that) return;
    this.setValue(that)
  }

  setChecked(that) {
    that.checked = true;
    this.setValue(that)
  }

  setValue(that) {
    if (this.value == that.value) return;

    this.container.querySelector('summary').textContent = that.parentNode.textContent;
    this.value = that.value;

    this.options.forEach(opt => {
      opt.classList.remove('active');
    })
    that.parentNode.classList.add('active');

    this.container.dispatchEvent(new Event('change'));
  }
}

const setAttributes = (el, attrs) => {
  for(let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

const timeToMinutes = time => {
  const a = time.split(':');
  return (+a[0]) * 60 + (+a[1]);
}

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

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});
const getTime = today => today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

const BASE_URL = 'http://localhost:8080/';

console.log((new Date()).getDay());
const totalDayTime = timeToMinutes('17:30') - timeToMinutes('08:00');

// Not re-send form on refresh page
if (window.history.replaceState) window.history.replaceState(null, null, window.location.href);



////////////
// User Page
const startDayBtn = document.getElementById('start-day');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const stopBtn = document.getElementById('stop');

const updateDayTracker = (target, data, date) => {
  const btns = document.querySelectorAll('.btn--track');
  btns.forEach(btn => btn.classList.remove('btn--disable'));
  document.getElementById(target).classList.add('btn--disable');

  const time_start = data.tracking[date][data.tracking[date].length-1].time_start;
  const ulToday = document.getElementById('current-work-day');
  const lastChild = ulToday.querySelector('[data-type]:last-child');
  const time_end = lastChild?.querySelector('.time-end');
  const li = document.createElement('li');
  let typeLiteral;
  li.innerHTML = '';

  if (target == 'start-day') {
    typeLiteral = 'Trabajo';
    li.setAttribute('data-type', 'work');
  } else if (target == 'pause') {
    typeLiteral = 'Descanso';
    time_end.innerHTML = time_start;
    li.setAttribute('data-type', 'break');
  } else if (target == 'play') {
    typeLiteral = 'Trabajo';
    time_end.innerHTML = time_start;
    li.setAttribute('data-type', 'work');
  } else if (target == 'stop') {
    if (lastChild.getAttribute('data-type') == 'work') {
      playBtn.classList.add('btn--disable');
    } else {
      pauseBtn.classList.add('btn--disable');
    }
    time_end.innerHTML = getTime(new Date());
  }

  if (typeLiteral) {
    li.innerHTML = `
      <div class="state">${typeLiteral}</div>
      <span class="time-start">${time_start}</span>
      <span> - </span>
      <span class="time-end">En curso</span>
    `;
    ulToday.appendChild(li);
  }
}

const startTrack = async () => {
  document.querySelectorAll('.btn--track ~ .btn--track').forEach(btn => btn.style.display = 'flex');
  event.target.style.display = 'none';
  const btnID = event.target.id;
  const now = new Date();
  const data = {
    date: getDate(now),
    time: getTime(now)
  };

  const result = await fetchQuery(`${BASE_URL}user/start`, 'POST', data);
  updateDayTracker(btnID, result, data.date);
  playBtn.classList.add('btn--disable');
}

const playTrack = async () => {
  const btnID = event.target.id;
  const now = new Date();
  const data = {
    date: getDate(now),
    time: getTime(now)
  };

  const result = await fetchQuery(`${BASE_URL}user/play`, 'POST', data);
  updateDayTracker(btnID, result, data.date);
}
const pauseTrack = async () => {
  const btnID = event.target.id;
  const now = new Date();
  const data = {
    date: getDate(now),
    time: getTime(now)
  };

  const result = await fetchQuery(`${BASE_URL}user/pause`, 'POST', data);
  updateDayTracker(btnID, result, data.date);
}
const stopTrack = async () => {
  console.log('Finish date');
  const btnID = event.target.id;
  const now = new Date();
  const data = {
    date: getDate(now),
    time: getTime(now)
  };

  const result = await fetchQuery(`${BASE_URL}user/stop`, 'POST', data);
  updateDayTracker(btnID, result, data.date);
}

if (document.getElementById('user')) {
  const ulToday = document.getElementById('current-work-day');
  const lastTrack = ulToday.querySelector('li:last-child');
  playBtn.addEventListener('mousedown', playTrack.bind(this), false);
  pauseBtn.addEventListener('mousedown', pauseTrack.bind(this), false);
  stopBtn.addEventListener('mousedown', stopTrack.bind(this), false);
  if (lastTrack) {
    document.getElementById('start-day').style.display = 'none';
    const type = lastTrack.getAttribute('data-type');
    if (type == 'break') {
      pauseBtn.classList.add('btn--disable');
    } else if (type == 'work') {
      playBtn.classList.add('btn--disable');
    }
  } else {
    startDayBtn.addEventListener('mousedown', startTrack.bind(this), false);
    document.querySelectorAll('.btn--track ~ .btn--track').forEach(btn => btn.style.display = 'none')
  }
}


//user config
const checkEmptyJournalTime = () => {
  let ok = true;
  const times = document.querySelectorAll(".js-time");

  for (var i = 0; i < times.length; i++) {
    if (!times[i].value) {
      ok = false;
      break;
    }
	}
  return ok;
}

const saveJournal = document.getElementById('save-journal');
if (saveJournal) {
  saveJournal.addEventListener('click', async () => {
    if (checkEmptyJournalTime()) {
      const data = {
        "1": {
          "day": "Lunes",
          "start": document.getElementById('start1').value,
          "end": document.getElementById('end1').value,
        },
        "2": {
          "day": "Martes",
          "start": document.getElementById('start2').value,
          "end": document.getElementById('end2').value,
        },
        "3": {
          "day": "Miércoles",
          "start": document.getElementById('start3').value,
          "end": document.getElementById('end3').value,
        },
        "4": {
          "day": "Jueves",
          "start": document.getElementById('start4').value,
          "end": document.getElementById('end4').value,
        },
        "5": {
          "day": "Viernes",
          "start": document.getElementById('start5').value,
          "end": document.getElementById('end5').value,
        }
      };
    
      const result = await fetchQuery(`${BASE_URL}config`, 'POST', data);
    } else {
      alert('Datos mal rellenos');
    }
  })
}



/////////////
// Stats Page
if (document.getElementById('select-month')) {
  new detailSelect('#select-month');
  const select = document.querySelector('#select-month fieldset');
  select.addEventListener('change', async () => {
    const data = {
      month: event.target.value
    };
  
    const result = await fetchQuery(`${BASE_URL}stats/date`, 'POST', data);
    updateStatsDOM(result);
  })
};
const dateTrack = document.querySelectorAll('.date-track');
dateTrack.forEach(ul => {
  let start, end;
  const lis = ul.querySelectorAll('li');

  lis.forEach(li => {
    start = li.getAttribute('data-start');
    if(li.getAttribute('data-end')) {
      end = li.getAttribute('data-end');
    } else {
      end = getTime(new Date());
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
const updateStatsDOM = data => {
  const details = document.querySelector('.details');
  details.innerHTML = '';

  for (let key in data.tracking) {
    if (data.tracking.hasOwnProperty(key)) {
      const ulDate = document.createElement('ul');
      
      const liDateBar = document.createElement('li');
      const spanDateBarTitle = document.createElement('span');

      setAttributes(ulDate, {
        'class': 'date',
        'data-date': `${key}`
      });
      
      liDateBar.classList.add('date-bar');
      
      spanDateBarTitle.innerHTML = `${key}`;
      spanDateBarTitle.classList.add('date-bar-title');
      
      liDateBar.appendChild(spanDateBarTitle);
      ulDate.appendChild(liDateBar);
      
      const ulDateTrack = document.createElement('ul');
      ulDateTrack.classList.add('date-track');

      const timeStart = data.tracking[key][0].time_start;
      const timeEnd = data.tracking[key][data.tracking[key].length - 1].time_end ? data.tracking[key][data.tracking[key].length - 1].time_end : getTime(new Date());
      let timeTotal = timeToMinutes(timeStart) - timeToMinutes(timeEnd);

      data.tracking[key].forEach(item => {
        const li = document.createElement('li');
        const spanStart = document.createElement('span');
        const spanEnd = document.createElement('span');
        setAttributes(li, {
          'data-type': `${item.type}`,
          'data-start': `${item.time_start}`,
          'data-end': `${item.time_end}`,
          'style': `width: ${((timeToMinutes(item.time_start) - timeToMinutes(data.tracking[key][data.tracking[key].length - 1].time_end ? item.time_end : timeEnd))/timeTotal)*100}%`
        });
        setAttributes(spanStart, {'class': 'time-start'});
        setAttributes(spanEnd, {'class': 'time-end'});
        spanStart.innerHTML = `${item.time_start}`;
        spanEnd.innerHTML = `${item.time_end}`;
        li.appendChild(spanStart);
        li.appendChild(spanEnd);
        ulDateTrack.appendChild(li);
      })
      const liFinish = document.createElement('li');
      liFinish.style.width = '0px';
      const span = document.createElement('span');
      span.innerHTML = timeEnd;
      liFinish.appendChild(span);
      ulDateTrack.appendChild(liFinish);

      liDateBar.appendChild(ulDateTrack);
      details.appendChild(ulDate);
    }
  }

}


/////////
// Config
const btnDownloadCSV = document.getElementById('download-tracking');
if (btnDownloadCSV) {
  btnDownloadCSV.addEventListener('click', async () => {
    const data = {
      date: getDate(new Date())
    };
    const result = await fetchQuery(`${BASE_URL}config/download`, 'POST', data);
    console.log('result :>> ', result);
  })
}


let timeInterval;

const clearInterval = document.getElementById('clearInterval');
if (clearInterval) {
  clearInterval.addEventListener('click', () => {
    console.log('timeInterval :>> ', timeInterval);
    window.clearInterval(timeInterval);
  })
}
function notify(interval) {

  if (!Notification) {
    alert("Este navegador no soporta las notificaciones del sistema");
    return;
  }

  if (Notification.permission !== "granted") Notification.requestPermission();

  const title = 'Simple Title';
  const options = {
    icon: 'https://via.placeholder.com/512x512',
    body: 'Simple piece of body text.\nSecond line of body text :)'
  };

  timeInterval = window.setInterval(() => {
    const notification = new Notification(title, options);
  }, interval);

}


//if windows close Update Time End of current state to now
/*
window.addEventListener('onbeforeunload', async () => {
  //event.preventDefault();
  //event.returnValue = '';
  const now = new Date();
  const data = {
    date: getDate(now),
    time: getTime(now)
  };

  return await fetchQuery(`${BASE_URL}user/close`, 'POST', data);
});
*/