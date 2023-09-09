import { initializeDarkLightMode } from './darklightmodecalendar.js'
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { receiveSettingsFromDatabase, getTutorialState, saveTutorialState } from './firebase/dbHandler.js'
//import { checkDeviceWidth, isMobile } from './responsiveness.js'
import { signOutUser } from './firebase/authentication.js'
import { updateTutorial, outputTutorialDialogue } from './tutorial.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//loading screen
const loadingScreen = document.getElementById('loading-screen');

getTutorialState()
    .then((tutorialState) => {
        updateTutorial(tutorialState);
        receiveSettingsFromDatabase()
            .then((settings) => {
                if (settings !== null) {
                    if (settings.font !== "default") {
                        const userFont = `${settings.font}, sans-serif`;
                        changeFontFamily(userFont);
                    }
                    if (settings.darkLightMode === "dark-mode") {
                    } else if (settings.darkLightMode === "light-mode") {
                        document.body.classList.remove("dark-mode");
                        document.body.classList.add('light-mode');
                        const darkModeElements = document.querySelectorAll(".dark-mode");
                        darkModeElements.forEach((element) => {
                            element.classList.remove("dark-mode");
                            element.classList.add("light-mode");
            
                            const modeSwitcher = document.getElementById("mode-switcher");
                            modeSwitcher.querySelector(".mode-text").textContent = "Light Mode";
                            modeSwitcher.querySelector(".dark-icon").classList.add("hidden");
                            modeSwitcher.querySelector(".light-icon").classList.remove("hidden")
                        });
                    }
                }
                loadingScreen.style.display = "none";
            }) 
    })


//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        plugins: [interactionPlugin],

        dateClick: function (info) {
            console.log("info:", info);

            // Redirect to app.html and pass info.dateStr as a query parameter
            window.location.href = 'app.html?date=' + encodeURIComponent(info.dateStr);

            //alert('Clicked on: ' + info.dateStr);
            //alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            //alert('Current view: ' + info.view.type);
            //change the day's background color just for fun
            info.dayEl.style.backgroundColor = '#F7F0F5';
        }
    });
    calendar.render();
});