// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZEmVuRjr99CZ-KBQEnA4h2nNwAqSY6rU",
  authDomain: "test-project-9045d.firebaseapp.com",
  projectId: "test-project-9045d",
  storageBucket: "test-project-9045d.appspot.com",
  messagingSenderId: "35308982662",
  appId: "1:35308982662:web:ceba0f718e2028fa1e5c07",
  measurementId: "G-8DPCGJ06FD",
  databaseURL: "https://test-project-9045d-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);


const listDataRef = ref(database, 'data')

/*onValue(listDataRef, (snapshot) => {
    const data = snapshot.val();
    console.log("data:", data);
}, { onlyOnce: true});
*/


//dbHandler.js
async function getListData() {
    const snapshot = await get(listDataRef);
    return snapshot.val();
}

//index.js
let listData = [];

async function displayData() {
    const newListData = await getListData()
    //console.log("newListData:", newListData);

    listData = newListData;
    //stop the loading
}

displayData();
//set(ref(database, 'data'), ["pizza", "sushi", "ice cream"]);
console.log(listData)

setTimeout(() => console.log(listData), 1000)