const alarmNameInput = document.getElementById('alarm-name');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const alarmsList = document.getElementById('alarms-list');
const alarmSound = document.getElementById('alarm-sound');
const currentTimeDisplay = document.getElementById('current-time');

let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let activeAlarm = null;

function displayCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function displayAlarms() {
    alarmsList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';

        const alarmInfo = document.createElement('div');
        alarmInfo.className = 'alarm-info';
        alarmInfo.innerHTML = `<strong>${alarm.name}</strong><br>${alarm.time}`;

        const alarmActions = document.createElement('div');
        alarmActions.className = 'alarm-actions';

        const toggleButton = document.createElement('button');
        toggleButton.className = `toggle-alarm ${alarm.active ? 'active' : ''}`;
        toggleButton.textContent = alarm.active ? 'Deactivate' : 'Activate';
        toggleButton.addEventListener('click', () => toggleAlarm(index));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-alarm';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteAlarm(index));

        alarmActions.appendChild(toggleButton);
        alarmActions.appendChild(deleteButton);

        alarmItem.appendChild(alarmInfo);
        alarmItem.appendChild(alarmActions);

        alarmsList.appendChild(alarmItem);
    });
}

function setAlarm() {
    const name = alarmNameInput.value.trim();
    const time = alarmTimeInput.value;

    if (!name || !time) {
        alert('Please enter a valid name and time for the alarm.');
        return;
    }

    alarms.push({
        name: name,
        time: time,
        active: true,
    });

    localStorage.setItem('alarms', JSON.stringify(alarms));
    displayAlarms();
    alarmNameInput.value = '';
    alarmTimeInput.value = '';
}

function toggleAlarm(index) {
    alarms[index].active = !alarms[index].active;
    if (alarms[index].active) {
        activeAlarm = index;
    } else if (activeAlarm === index) {
        stopAlarm();
    }
    localStorage.setItem('alarms', JSON.stringify(alarms));
    displayAlarms();
}

function deleteAlarm(index) {
    if (activeAlarm === index) {
        stopAlarm();
    }
    alarms.splice(index, 1);
    localStorage.setItem('alarms', JSON.stringify(alarms));
    displayAlarms();
}

function checkAlarms() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    alarms.forEach((alarm, index) => {
        if (alarm.active && alarm.time === currentTime) {
            alarmSound.play();
            //alert(`Alarm: ${alarm.name}`);
            alarms[index].active = false; // Deactivate alarm after it goes off
            activeAlarm = index;
            localStorage.setItem('alarms', JSON.stringify(alarms));
            displayAlarms();
        }
    });
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    activeAlarm = null;
}

setAlarmButton.addEventListener('click', setAlarm);
setInterval(displayCurrentTime, 1000);
setInterval(checkAlarms, 1000);
displayAlarms();
