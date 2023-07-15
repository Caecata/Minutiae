import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCvFsT4_fkPXBJ_gHkywFgiEL3XRP1Eu3U",
    authDomain: "minutiae-44b38.firebaseapp.com",
    projectId: "minutiae-44b38",
    storageBucket: "minutiae-44b38.appspot.com",
    messagingSenderId: "3235494640",
    appId: "1:3235494640:web:5472c3869b3a38d14ca035",
    measurementId: "G-D8H933HTXT",
    databaseURL: "https://minutiae-44b38-default-rtdb.firebaseio.com"
  };

export const app = initializeApp(firebaseConfig);
