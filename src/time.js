import { DateTime } from 'luxon';
import { modernClock } from './modernclock.js'

//Script for Clock
export function updateClock() {
    const now = new Date();

    //Arrays for months and days of the weeks since JavaScript starts on 0
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //Adjustments to hour variable to change 24-hour clock to 12-hour clock with AM/PM
    var hours = now.getHours();
    var afternoon = false;
    var ampm = "AM";

    if (hours >= 12) {
        hours = hours - 12;
        afternoon = true;
        var ampm = "PM";
    }
    if (hours == 0) {
        hours = 12;
    }

    //Getting time values
    //Learned that you should declare var/let for variables that are expected to be updated
    var minutes = now.getMinutes();
    const seconds = String(now.getSeconds());
    const month = months[(now.getMonth())];
    const day = String(now.getDate());
    const year = String(now.getFullYear());
    const dayofweek = days[(now.getDay())];

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    //Outputting time
    document.getElementById('clock').innerHTML = hours + ":" + minutes + ":" + seconds + " " + ampm + "<br>" +
        month + " " + day + ", " + year + "<br>" +
        dayofweek;
}

//This updates the clock each second or 1000 milliseconds
updateClock();
setInterval(updateClock, 1000);

export function handsOfTheClock() {
    const minsHand = document.getElementById('min-hand');
    const hourHand = document.getElementById('hour-hand');

    function setDate() {
        const now = new Date();

        const seconds = now.getSeconds();
        const mins = now.getMinutes();
        const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;

        const hour = now.getHours();
        const hourDegrees = ((hour / 24) * 360) + ((mins / 60) * 15) + 90;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }
    setInterval(setDate, 1000);
    setDate();
}

export function modernStyle() {

    function setTime() {
        const now = new Date();
        const seconds = now.getSeconds();
        const mins = now.getMinutes();
        const hour = now.getHours();

        if (seconds === 0) {
            modernClock(mins, hour);
        }
    }
    setInterval(setTime, 1000);
    setTime();
}

export function noHandsOfTheClock() {
    const minsHand = document.getElementById('min-hand');
    const hourHand = document.getElementById('hour-hand');
    const dot = document.getElementById("clock-face");

    minsHand.classList.add("hidden");
    hourHand.classList.add("hidden"); 
    dot.classList.add("hidden");
}
 