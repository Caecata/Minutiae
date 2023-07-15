import { DateTime } from 'luxon';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get, query, orderByChild, equalTo, update, push, once } from "firebase/database";
import { app } from './firebase.js'

const analytics = getAnalytics(app);
const database = getDatabase(app);

export function saveTagsToDatabase(tagArray) {
    console.log("saveTagsToDatabase()");
    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    const newData = {};

    newData.tags = tagArray;

    update(ref(database, `users/userid-${userId}`), newData);
}

export function receiveTagsFromDatabase() {
    console.log("receiveTagsFromDatabase()");

    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const tagArrayRef = ref(database, `users/userid-${userId}/tags`);

        get(tagArrayRef) 
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const tagArray = snapshot.val();
                    resolve(tagArray);
                } else {
                    const tagArray = [];
                    resolve(tagArray);
                }
            })
    })
}
export function saveRemoveArray(removeArray) {
    console.log("saveRemoveArray()");
    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    const newData = {};

    newData.removeArray = removeArray;

    update(ref(database, `users/userid-${userId}`), newData);

}

export function getRemoveArray() {
    console.log("getRemoveArray()");

    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const removeArrayRef = ref(database, `users/userid-${userId}/removeArray`);

        get(removeArrayRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const removeArray = snapshot.val();
                    resolve(removeArray);
                } else {
                    const removeArray = [];
                    resolve(removeArray);
                }
            })
    })
}

export function saveLegendToDatabase(data) {
    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    const newData = {};

    newData.legend = data;

    update(ref(database, 'users/' + `userid-${userId}`), newData);
}
export function setPlaceholderToFalse() {
    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);
    const newData = { placeholder: false };
    update(ref(database, `users/userid-${userId}/`), newData);
}

export function saveSettingsToDatabase(data) {
    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    const newData = {};

    newData.settings = data;

    update(ref(database, 'users/' + `userid-${userId}`), newData);

}

export async function receiveSettingsFromDatabase() {
    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const settingsRef = ref(database, 'users/' + `userid-${userId}` + '/settings');

        get(settingsRef)
            .then((snapshot) => {
                let settings = snapshot.val();
                resolve(settings);
            })
    })
}

export async function receiveLegendFromDatabase() {

    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const legendRef = ref(database, 'users/' + `userid-${userId}` + '/legend');

        get(legendRef)
            .then((snapshot) => {
                let legend = snapshot.val();
                resolve(legend);
            })
    })
}

export function checkDatabaseForFirstTime() {

    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const userRef = ref(database, 'users/' + `userid-${userId}`);

        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const placeholderValue = userData.placeholder;
                    console.log("placeholderValue:", placeholderValue);
                    resolve(placeholderValue);
                } else {
                    reject(new Error("User could not be found."));
                }
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export async function ensureUsersReferenceExists(userId) {
    console.log("ensureUsersReferenceExists()");
    const usersRef = ref(database, 'users');

    try {
        const snapshot = await get(usersRef);

        if (!snapshot.exists()) {
            console.log("users ref does not exist");

            const firstUserData = { placeholder: true };

            const saveState = `userid-${userId}`;

            const firstUserRef = ref(database, 'users/' + saveState);

            set(firstUserRef, firstUserData);
            console.log("Users reference created with the first user");
        } else {
            console.log("Users reference already exists");
        }
    } catch (error) {
        console.log("Error:", error);
        throw error;
    }
}

export function saveNewUser(userId) {
    console.log("saveNewUser()");

    const firstUserData = { placeholder: true };
    const saveState = `userid-${userId}`;

    const userRef = ref(database, 'users/' + saveState);

    update(userRef, firstUserData);
}
export async function checkUserIdExists(userId) {
    console.log("checkUserIdExists()");

    return new Promise((resolve, reject) => {
        const key = "minutiaeUid";
        const userId = window.localStorage.getItem(key);

        const userRef = ref(database, `users/userid-${userId}`);

        get(userRef) 
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log("user exists");
                    resolve(true);
                } else {
                    console.log("user does not exist")
                    resolve(false);
                }
            })
    })
}

export async function retrieveData(current) {

    console.log("current in retrieveData:", current);

    let key = current.toISODate();
    let yesterdayKey = current.minus({ days: 1 }).toISODate();
    let tomorrowKey = current.plus({ days: 1 }).toISODate();

    console.log("key:", key);
    console.log("yesterdayKey:", yesterdayKey);
    console.log("tomorrowKey:", tomorrowKey);

    return {
        parsedToday: await retrieveToday(key),
        parsedYesterday: await retrieveYesterday(yesterdayKey),
        parsedTomorrow: await retrieveTomorrow(tomorrowKey)
    }
}

export async function retrieveToday(todayKey) {
    //console.log("in retrieveToday");

    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    var parsedData;
    const dataRefToday = ref(database, 'users/' + `userid-${userId}` + '/dates/' + todayKey);

    const snapshot = await get(dataRefToday);

    parsedData = snapshot.val();

    return parsedData;

}

export async function retrieveYesterday(yesterdayKey) {
    console.log("in retrieveYesterday");

    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    var parsedDataYesterday;

    const dataRefYesterday = ref(database, 'users/' + `userid-${userId}` + '/dates/' + yesterdayKey);

    const snapshot = await get(dataRefYesterday);

    parsedDataYesterday = snapshot.val();

    return parsedDataYesterday;
}

export async function retrieveTomorrow(tomorrowKey) {
    console.log("in retrieveTomorrow");

    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    var parsedDataTomorrow;

    const dataRefTomorrow = ref(database, 'users/' + `userid-${userId}` + '/dates/' + tomorrowKey);

    const snapshot = await get(dataRefTomorrow);

    parsedDataTomorrow = snapshot.val();

    return parsedDataTomorrow;
}

export function saveToDatabase(array, current) {
    console.log("in to saveToDatabase");
    console.log("detailsArray:", array);

    const key = "minutiaeUid";
    const userId = window.localStorage.getItem(key);

    const newData = {};

    const saveState = current.toISODate();
    console.log("saveState:", saveState);

    const midnight = current.startOf("day");
    const timezone = current.zoneName;

    newData.dates = {};
    newData.dates[saveState] = {};

    newData.dates[saveState].data = {
        detailsArray: array,
        timestamp: midnight,
        timezone: timezone,
    }
    window.localStorage.setItem(saveState, JSON.stringify(newData));

    const databaseRef = ref(database, `users/userid-${userId}/dates/${saveState}`);
    update(databaseRef, newData.dates[saveState]);
}