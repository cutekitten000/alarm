const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const stopAlarmButton = document.getElementById('stop-alarm');
const messageDisplay = document.getElementById('message');
const alarmSound = document.getElementById('alarm-sound');

let alarmTime = null;
let alarmTimeout = null;

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    hoursDisplay.textContent = hours;
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;

    if (alarmTime && `${hours}:${minutes}` === alarmTime) {
        messageDisplay.textContent = "Wake Up!";
        alarmSound.play();
        showStopButton();
        clearTimeout(alarmTimeout);
    }
}

function setAlarm() {
    const time = alarmTimeInput.value;
    if (!time) {
        alert('Please set a valid time for the alarm.');
        return;
    }

    // Cancel any previous alarm
    clearTimeout(alarmTimeout);

    alarmTime = time;
    messageDisplay.textContent = `Alarm set for ${alarmTime}`;
    alarmTimeout = setTimeout(() => {
        messageDisplay.textContent = "Time's up!";
        alarmSound.play();
        showStopButton();
    }, calculateTimeUntilAlarm());
}

function calculateTimeUntilAlarm() {
    const [hours, minutes] = alarmTime.split(':');
    const now = new Date();
    const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    return alarmDate.getTime() - now.getTime();
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    messageDisplay.textContent = "Alarm stopped";

    // Clear the alarm to prevent it from triggering again
    clearTimeout(alarmTimeout);
    alarmTime = null;
    hideStopButton();
}

function showStopButton() {
    stopAlarmButton.classList.add('show');
}

function hideStopButton() {
    stopAlarmButton.classList.remove('show');
}

setAlarmButton.addEventListener('click', setAlarm);
stopAlarmButton.addEventListener('click', stopAlarm);
setInterval(updateTime, 1000);
