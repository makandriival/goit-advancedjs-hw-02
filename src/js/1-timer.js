import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId = null;
let isTimerRunning = false;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function renderTime({ days, hours, minutes, seconds }) {
  daysValue.textContent = String(days).padStart(2, '0');
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isTimerRunning = false;
  datetimePicker.disabled = false;
  startButton.disabled = true;
}

function startCountdown() {
  if (!userSelectedDate || isTimerRunning) {
    return;
  }

  isTimerRunning = true;
  datetimePicker.disabled = true;
  startButton.disabled = true;

  const updateCountdown = () => {
    const now = Date.now();
    const diff = userSelectedDate.getTime() - now;

    if (diff <= 0) {
      renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      stopTimer();
      return;
    }

    renderTime(convertMs(diff));
  };

  updateCountdown();

  intervalId = setInterval(updateCountdown, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      startButton.disabled = true;
      return;
    }

    if (selectedDate <= new Date()) {
      userSelectedDate = null;
      startButton.disabled = true;
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr('#datetime-picker', options);
startButton.addEventListener('click', startCountdown);
renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
