import { receiveSettingsFromDatabase } from './firebase/dbHandler.js'
import { uiConfig } from './firebase/authentication.js'
import { checkUserIdExists, saveNewUser, ensureUsersReferenceExists, getTutorialState, saveTutorialState } from './firebase/dbHandler.js'
import { updateTutorial, tutorialDialogue } from './tutorial.js'

//loading screen



//runHomePage();


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

