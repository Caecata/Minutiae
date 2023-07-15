import { receiveSettingsFromDatabase } from './firebase/dbHandler.js'
import { uiConfig } from './firebase/authentication.js'
import { checkUserIdExists, saveNewUser, ensureUsersReferenceExists } from './firebase/dbHandler.js'

//loading screen
const loadingScreen = document.getElementById('loading-screen');

let settings = {};

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
