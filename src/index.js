import { receiveSettingsFromDatabase } from './firebase/dbHandler.js'
import { uiConfig } from './firebase/authentication.js'
import { checkUserIdExists, saveNewUser, ensureUsersReferenceExists, getTutorialState, saveTutorialState } from './firebase/dbHandler.js'
import { updateTutorial, tutorialDialogue } from './tutorial.js'

//loading screen
const loadingScreen = document.getElementById('loading-screen');

let settings = {};

const key = "minutiaeUid";
const userId = window.localStorage.getItem(key);
console.log("userId:", userId);

if (userId !== "null") {
    getTutorialState()
    .then((tutorialState) => {
      console.log("tutorialState:", tutorialState);
      if (tutorialState.finalMessage === false) {
        updateTutorial(tutorialState);
        loadingScreen.style.display = "none";
      } else {
        receiveSettingsFromDatabase()
            .then((receivedSettings) => {
                settings = receivedSettings;
                console.log("settings:", settings);

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
        }
    })
} else {
    let customizeUrl = document.getElementById("customize-url");
    let appUrl = document.getElementById("app-url");
    let calendarUrl = document.getElementById("calendar-url");
    let dataUrl = document.getElementById("data-url");
    let settingsUrl = document.getElementById("settings-url");
    
    customizeUrl.classList.add("deactivated-link");
    const customizeClickListener = customizeUrl.onclick;
    customizeUrl.removeEventListener("click", customizeClickListener);
    
    appUrl.classList.add("deactivated-link");
    const appClickListener = appUrl.onclick;
    appUrl.removeEventListener("click", appClickListener);
    
    calendarUrl.classList.add("deactivated-link");
    const calendarClickListener = calendarUrl.onclick;
    calendarUrl.removeEventListener("click", calendarClickListener);
    
    dataUrl.classList.add("deactivated-link");
    const dataClickListener = dataUrl.onclick;
    dataUrl.removeEventListener("click", dataClickListener);
    
    settingsUrl.classList.add("deactivated-link");
    const settingsClickListener = settingsUrl.onclick;
    settingsUrl.removeEventListener("click", settingsClickListener);
    
    loadingScreen.style.display = "none";    
}


//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

/*
async function handleLogin() {
    console.log("handleLogin()")
    try {
        const userId = await loginWithGoogle();

        //saving userId to localStorage so it is accessible in all pages
        localStorage.setItem('minutiaeUid', userId);
        console.log("userId:", userId);
        await ensureUsersReferenceExists(userId);

        /* const userIdExists = await checkUserIdExists(userId);
        console.log("User ID exists:", userIdExists);

        if (!userIdExists) {
            saveNewUser(userId);
        } 
        return userId;
    } catch (error) {
        console.log("Error:", error);
    }
}
*/
//handleLogin();

/* handleLogin()
    .then((userId) => {
        saveUserIdToDatabase(userId);
    }) 
    .catch((error) => {
        console.log("Error:", error);
    }); */

