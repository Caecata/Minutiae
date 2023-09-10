import { app } from './firebase.js'
import { getAuth, signOut, signInAnonymously } from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { checkUserIdExists, saveNewUser, ensureUsersReferenceExists, getTutorialState, saveTutorialState } from './dbHandler.js'
import { updateTutorial } from '../../src/tutorial.js'

//Temp variable to hold the anonymous user data if needed.
//var data = null;
//Hold a reference to the anonymous current user.
//var anonymousUser = firebase.auth().currentUser;
//console.log("anonymousUser:", anonymousUser);

const auth = getAuth(app);
var ui = new firebaseui.auth.AuthUI(getAuth(app)); 
//var ui = new firebaseui.auth.AuthUI(firebase.auth(app));

var uiConfig = {
  //autoUpgradeAnonymousUsers: true,

  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      console.log("signInSuccessWithAuthResult");
      console.log('authResult:', authResult);
      console.log('redirectUrl:', redirectUrl);
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';

      // Add a custom event listener to the "Continue as guest" button
      var continueAsGuestButton = document.querySelector('[data-provider-id="anonymous"]');
      continueAsGuestButton.addEventListener('click', function () {
        // Trigger signInAnonymously when "Continue as guest" is clicked
        signInAnonymously(getAuth(app))
          .then(() => {
            // Handle the successful anonymous sign-in
            console.log("signInAnonymously success");
            // Add your logic for handling anonymous sign-in here
          })
          .catch((error) => {
            console.log("error in signing in anonymously:", error);
          });
        })
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '', //<url-to-redirect-to-on-success>
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

const currentPage = window.location.pathname;
console.log("currentPage:", currentPage);
if (currentPage === "/index.html" || currentPage === "/%3Curl-to-redirect-to-on-success%3E" || currentPage === "/") {
  ui.start('#firebaseui-auth-container', uiConfig);
}

const initApp = function () {
  getAuth(app).onAuthStateChanged(function (user) {
    if (user) {
      console.log("user present");
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      user.getIdToken().then(function (accessToken) {
        document.getElementById('firebaseui-auth-container').style.display = "none";

        //document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        /* document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  '); */

        let accountDetails = {
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }
        console.log("accountDetails:", accountDetails);

        localStorage.setItem('minutiaeUid', uid);
        localStorage.setItem('minutiaeAccessToken', accessToken);
        //this will set up the 'users' reference if first user is being created
        ensureUsersReferenceExists(uid)
          .then(() => {
            console.log("userId:", uid);
            console.log("accessToken:", accessToken);

            //this will check if user already exists in database
            checkUserIdExists(uid)
              .then((userIdExists) => {
                console.log("User ID exists:", userIdExists);

                if (uid === "gcL5lX1avOO2eY228ymBEZCfbC22") {
                  //this is my account
                  let tutorialState =
                        {
                          clickMyLegend: true,
                          folderSystem: true,
                          makeYourChoice: true,
                          choice: true,
                          addNewCategories: true,
                          deleteUnwantedCategories: true,
                          modifyCategoriesWithColorAndName: true,
                          introducingTags: true,
                          yourJourneyYourRules: true,
                          firstStepCompleted: true,
                          clickToday: true,
                          welcomeToday: true,
                          formButton: true,
                          slice: true,
                          TwentyFourHourClockAndPieChart: true,
                          legendBeneathTheClock: true,
                          logButton: true,
                          deleteAndModify: true,
                          navigateToPreviousFutureDays: true,
                          upload: true,
                          concludeToday: true,
                          secondStepCompleted: true,
                          clickCalendar: true,
                          chooseADate: true,
                          calendarUsed: true,
                          thirdStepCompleted: true,
                          clickAnalytics: true,
                          welcomeAnalytics: true,
                          craftingYourCustomReport: true,
                          dailyBreakdown: true,
                          activityFrequency: true,
                          timeAllocation: true,
                          categoryShare: true,
                          weekMonthAndYear: true,
                          examineTheData: true,
                          startingAfresh: true,
                          reset: true,
                          embraceTheInsights: true,
                          finalMessage: true
                        }
                  saveTutorialState(tutorialState);
                }

                if (!userIdExists) {
                  saveNewUser(uid);
                  getTutorialState()
                    .then((tutorialState) => {
                      updateTutorial(tutorialState);
                    })
                }
              })
          })
      });
    } else {
      console.log("no user");
      // User is signed out.
      document.getElementById('firebaseui-auth-container').style.display = "block";
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('sign-in').style.display = "none";
    }
  }, function (error) {
    console.log(error);
  });
}; 

window.addEventListener('load', function () {
  initApp()
});

let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

export function signOutUser() {
  if (signInBtn.textContent === 'Sign out') {
    signOut(getAuth(app)).then(() => {
      window.location.href = 'index.html';
      localStorage.setItem('minutiaeUid', null);
      localStorage.setItem('minutiaeAccessToken', null)
    }).catch((error) => {
      // An error happened.
    });
  }
}