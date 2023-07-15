import { initializeDarkLightMode } from './darklightmodesettings.js'
import { saveSettingsToDatabase, receiveSettingsFromDatabase } from './firebase/dbHandler.js'
import { receiveSettingsFromDatabase } from './firebase/dbHandler.js'
//import { checkDeviceWidth, isMobile } from './responsiveness.js'
import { signOutUser } from './firebase/authentication.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//loading screen
const loadingScreen = document.getElementById('loading-screen');

settings = {};

receiveSettingsFromDatabase()
    .then((receivedSettings) => {
        settings = receivedSettings;
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

            prepopulateSettings(settings);
        }
        loadingScreen.style.display = "none";
    }) 

function prepopulateSettings(settings) {
    if (settings.darkLightMode) {
        document.getElementById("dark-light-mode").value = settings.darkLightMode;
    }
    if (settings.font) {
        document.getElementById("font").value = settings.font;
    }
    if (settings.analogStyle) {
        document.getElementById("analog-style").value = settings.analogStyle;
    }
    if (settings.formType) {
        document.getElementById("form-type").value = settings.formType;
    }
    if (settings.tagsBool) {
        document.getElementById("tags").checked = settings.tagsBool;
    }
    if (settings.descriptionBool) {
        document.getElementById("description").checked = settings.descriptionBool;
    }
}

//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}
//font dropdown
const fontDropdown = document.getElementById("font");

fontDropdown.addEventListener("change", function () {
    let selectedFont = this.value;
    if (selectedFont === "default") {
        selectedFont = "chewy";
        document.documentElement.style.setProperty('--font-family', selectedFont);

    } else {
        document.documentElement.style.setProperty('--font-family', selectedFont);
    }
});

document.getElementById("save-settings").addEventListener("click", function () {
    const darkLightMode = document.querySelector("#dark-light-mode").value;

    const font = document.querySelector("#font").value;
    //Chivo, Roboto, Concert One, Oleo Script, Chewy, Lekton, Raleway, Amarante, Oregano, Combo, Rancho, Lacquer 

    const analogStyle = document.querySelector("#analog-style").value;

    const formType = document.querySelector("#form-type").value;
    console.log("formType:", formType);

    const tagsBool = document.querySelector("#tags").checked;
    const descriptionBool = document.querySelector("#description").checked;

    const settingsObj = {
        analogStyle: analogStyle,
        formType: formType,
        tagsBool: tagsBool,
        descriptionBool: descriptionBool,
        font: font,
        darkLightMode: darkLightMode
    };
    console.log("settingsObj:", settingsObj);

    saveSettingsToDatabase(settingsObj);
})
