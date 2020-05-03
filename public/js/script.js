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
};


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

const updateStatsDOM = data => {
  const details = document.querySelector('.details');
  details.innerHTML = '';
  console.log('data :>> ', data);
  for (let key in data.tracking) {
    if (data.tracking.hasOwnProperty(key)) {
      const ulDate = document.createElement('ul');
      
      const liDateBar = document.createElement('li');
      const spanDateBarTitle = document.createElement('span');

      ulDate.classList.add('date');
      ulDate.setAttribute('data-date', `${key}`);
      
      liDateBar.classList.add('date-bar');
      
      spanDateBarTitle.innerHTML = `${key}`;
      spanDateBarTitle.classList.add('date-bar-title');
      
      liDateBar.appendChild(spanDateBarTitle);
      ulDate.appendChild(liDateBar);
      
      const ulDateTrack = document.createElement('ul');
      ulDateTrack.classList.add('date-track');
      
      let finish;
      data.tracking[key].forEach(item => {
        const li = document.createElement('li');
        const spanStart = document.createElement('span');
        const spanEnd = document.createElement('span');
        setAttributes(li, {
          'data-type': `${item.type}`,
          'data-start': `${item.time_start}`,
          'data-end': `${item.time_end}`,
          'style': `width:25%`
        });
        setAttributes(spanStart, {'class': 'time-start'});
        setAttributes(spanEnd, {'class': 'time-end'});
        spanStart.innerHTML = `${item.time_start}`;
        spanEnd.innerHTML = `${item.time_end}`;
        li.appendChild(spanStart);
        li.appendChild(spanEnd);
        ulDateTrack.appendChild(li);
        finish = item.time_end;
      })
      const liFinish = document.createElement('li');
      const span = document.createElement('span');
      span.innerHTML = finish;
      liFinish.appendChild(span);
      ulDateTrack.appendChild(liFinish);

      liDateBar.appendChild(ulDateTrack);
      details.appendChild(ulDate);
    }
  }

  let result = `
    <ul class="date" data-date="01/05/2020">
      <li class="date-bar">
        <span class="date-bar-title">01/05/2020</span>
        <ul class="date-track">
            <li data-type="work" data-start="08:00" data-end="15:30" style="width: 78.9474%;"><span class="time-start">08:00</span><span class="time-end">15:30</span></li>
            <li data-type="break" data-start="15:30" data-end="19:15" style="width: 39.4737%;"><span class="time-start">15:30</span><span class="time-end">19:15</span></li>
            <li data-type="work" data-start="19:15" data-end="20:15" style="width: 10.5263%;"><span class="time-start">19:15</span><span class="time-end">20:15</span></li>
            <li style="width: 0px;"><span>20:15</span></li>
        </ul>
      </li>
    </ul>
  `;
  //details.innerHTML = result;
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

const timeToMinutes = time => {
  const a = time.split(':');
  return (+a[0]) * 60 + (+a[1]);
}


const startDayBtn = document.getElementById('start-day');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const dateTrack = document.querySelectorAll('.date-track');

const BASE_URL = 'http://localhost:8080/';
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
  let ulToday = document.querySelector(`[data-date="${getDate(today)}"]`);
  if (!ulToday) {
    ulToday = document.createElement('ul');  
    ulToday.classList.add('date');
    ulToday.setAttribute('data-date', `${getDate(today)}`);
    ulToday.innerHTML = `
      <li class="date-bar">
        <span class="date-bar-title">${getDate(today)}</span>
        <ul class="date-track"></ul>
      </li>
    `;
    document.querySelector('.details').appendChild(ulToday);
  }
  const ulDateTrack = ulToday.querySelector(`.date-track`);
  const li = document.createElement('li');  
  const span = document.createElement('span');
  span.innerHTML = getTime(today);

  li.appendChild(span);

  ulDateTrack.insertBefore(li, ulDateTrack.lastChild);
}

const updateBtnTrackDOM = async () => {
  const data = await fetchQuery(`${BASE_URL}user/tracks`, 'GET', {});
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

  updateDayTracker();
  await fetchQuery(`${BASE_URL}user/start`, 'POST', data);
  updateBtnTrackDOM();
}

const playTrack = async () => {
  const data = {
    date: getDate(today),
    time: getTime(new Date())
  };

  updateDayTracker();
  await fetchQuery(`${BASE_URL}user/play`, 'POST', data);
  updateBtnTrackDOM();
}
const pauseTrack = async () => {
  const data = {
    date: getDate(today),
    time: getTime(new Date())
  };

  updateDayTracker();
  await fetchQuery(`${BASE_URL}user/pause`, 'POST', data);
  updateBtnTrackDOM();
}
