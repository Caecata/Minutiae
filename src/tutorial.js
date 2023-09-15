import { updateVisualization, initializeFolders, removeVisualization, removeFolders, updateTags } from "./mylegendexperience";
import { getTutorialState, saveTutorialState, saveLegendToDatabase, receiveLegendFromDatabase, receiveTagsFromDatabase, saveToDatabase } from './firebase/dbHandler.js'
//import { connected } from "process";
import { DateTime } from 'luxon';

export const functions = {
  checkToTriggerYJYR: function(parameter) {
    getTutorialState()
      .then((tutorialState) => {
        console.log("in checkToTriggerYJYR:");
        if (tutorialState.addNewCategories === true && tutorialState.deleteUnwantedCategories === true && tutorialState.modifyCategoriesWithColorAndName === true && tutorialState.introducingTags === true) {
        outputTutorialDialogue("yourJourneyYourRules");
        } else {
          closeDialogue();
        }
      })
  },
  updateMenuElements: function(parameter) {
    updateMenuElements(parameter);
  },
  reactivateTodayUrl: function(parameter) {
    console.log("reactivateTodayUrl()");
    const appUrlElement = document.getElementById("app-url");

    if (appUrlElement) {
      appUrlElement.classList.remove("deactivated-link");
      appUrlElement.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "app.html";
      })
    }
  },
  reactivateCalendarUrl: function(parameter) {
    console.log("reactivateCalendarUrl()");
    const calendarUrlElement = document.getElementById("calendar-url");

    if (calendarUrlElement) {
      calendarUrlElement.classList.remove("deactivated-link");
      calendarUrlElement.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "calendar.html";
      })
    }
  },
  reactivateAnalyticsUrl: function(parameter) {
    console.log("reactivateAnalyticsUrl()");
    const analyticsUrlElement = document.getElementById("data-url");

    if (analyticsUrlElement) {
      analyticsUrlElement.classList.remove("deactivated-link");
      analyticsUrlElement.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "data.html";
      })
    } 
  },
  reactivateSettingsUrl: function(parameter) {
    console.log("reactivateSettingsUrl()");
    const settingsUrlElement = document.getElementById("settings-url");

    if (settingsUrlElement) {
      settingsUrlElement.classList.remove("deactivated-link");
      settingsUrlElement.addEventListener("click", function(event) {
      event.preventDefault();
      window.location.href = "settings.html";
    })
    }
  },
  reactivateMyLegendUrl: function(parameter) {
    console.log("reactivateMyLegendUrl()");
    const myLegendUrlElement = document.getElementById("customize-url");

    if (myLegendUrlElement) {
      myLegendUrlElement.classList.remove("deactivated-link");
      myLegendUrlElement.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "customize.html";
      })
    }
  
  },
  advanceProgressBarTo25: function(parameter) {
    console.log("advanceProgressBarTo25()");
    const progressBar = document.querySelector('.minutiae-tutorial');
    progressBar.style.transition = "width 1s linear";
    const spanElement = progressBar.querySelector('span');
    spanElement.textContent = "25%";
    progressBar.style.width = (parseInt(progressBar.style.width || 0) + 25) + '%';
  },
  advanceProgressBarTo50: function(parameter) {
    console.log("advanceProgressBarTo50()");
    const progressBar = document.querySelector('.minutiae-tutorial');
    progressBar.style.width = 0;
    progressBar.style.transition = "width 1s linear";
    const spanElement = progressBar.querySelector('span');
    spanElement.textContent = "50%";
    progressBar.style.width = (parseInt(progressBar.style.width || 0) + 50) + '%';
  },
  advanceProgressBarTo75: function(parameter) {
    console.log("advanceProgressBarTo75()");
    const progressBar = document.querySelector('.minutiae-tutorial');
    progressBar.style.width = 0;
    progressBar.style.transition = "width 1s linear";
    const spanElement = progressBar.querySelector('span');
    spanElement.textContent = "75%";
    progressBar.style.width = (parseInt(progressBar.style.width || 0) + 75) + '%';
  },
  advanceProgressBarTo100: function(parameter) {
    console.log("advanceProgressBarTo100()");
    const progressBar = document.querySelector('.minutiae-tutorial');
    progressBar.style.width = 0;
    progressBar.style.transition = "width 1s linear";
    const spanElement = progressBar.querySelector('span');
    spanElement.textContent = "100%";
    progressBar.style.width = (parseInt(progressBar.style.width || 0) + 100) + '%';
  },
  initializeChoice: function(parameter) {
    initializeChoice();
  },
  directUserToLog: function(parameter) {
    console.log("directUserToLog()");

    applyBlinking("view-log");

    document.getElementById("view-log").addEventListener("click", function() {
      document.getElementById("view-log").classList.remove("blinking");
      document.getElementById("view-log").style.borderColor = "#1b1b1b";
    })
  },
  directUserToDeleteAndModify: function(parameter) {
    console.log("directUserToDeleteAndModify");

    const element = document.querySelector(".log-more-options");

    if (element) {
      element.style.borderColor = "gold";
      element.classList.add("blinking");
    }

    element.addEventListener("click", function(event) {
      element.classList.remove("blinking");
      element.style.borderColor = "transparent";

      outputTutorialDialogue("deleteAndModify");
    })
  },
  continueToNTPFD: function(parameter) {
    console.log("continueToNTPFD()");

    document.getElementById("close-log").addEventListener("click", functions["handleCloseLogClick"]);
  },
  handleCloseLogClick: function(parameter) {
      outputTutorialDialogue("navigateToPreviousFutureDays");

      document.getElementById("close-log").removeEventListener("click", handleCloseLogClick);
  },
  directUserToPreviousFuture: function(parameter) {
    console.log("directUserToPreviousFuture()");
    //call in updateTutorialToday (it will be called once the page reloads with the new data)

    document.getElementById("day-back").classList.add("blinking-no-border");
    document.getElementById("day-forward").classList.add("blinking-no-border");

    document.getElementById("day-back").addEventListener("click", handleDayBackClick);
    document.getElementById("day-forward").addEventListener("click", handleDayForwardClick);

    function handleDayBackClick(event) {
      document.getElementById("day-back").classList.remove("blinking-no-border");
      document.getElementById("day-forward").classList.remove("blinking-no-border");

      outputTutorialDialogue("concludeToday");

      document.getElementById("day-back").removeEventListener("click", handleDayBackClick);
      document.getElementById("day-forward").removeEventListener("click", handleDayForwardClick);
    }

    function handleDayForwardClick(event) {
      document.getElementById("day-forward").classList.remove("blinking-no-border");
      document.getElementById("day-back").classList.remove("blinking-no-border");

      outputTutorialDialogue("concludeToday");

      document.getElementById("day-forward").removeEventListener("click", handleDayForwardClick);
      document.getElementById("day-back").removeEventListener("click", handleDayBackClick);
    }
  },
  uploadSampleData: function(parameter) {
    console.log("uploadSampleData()");
    //reload the page at the end of this function
    //and/or close the dialogue

    getTutorialState()
      .then((tutorialState) => {
        receiveLegendFromDatabase()
          .then((legend) => {

            let detailsArray = [];

            const now = DateTime.now();
            let sevenDaysAgo = now.minus({ days: 7 });

            let dayArray = [];

            for (let i = 0; i < 7; i++) {
              dayArray.push(sevenDaysAgo);
              sevenDaysAgo = sevenDaysAgo.plus({ days: 1 });
            }

            console.log("dayArray:", dayArray);

            const remainingItem = legend.find(item => item.name === "Remaining");
            //the user saved data as their legend
            if (remainingItem.uniqueId === "00001122334455019") {
              console.log("using detailsArraySquared");
              detailsArray = detailsArraySquared;
            } 
            //the user saved data2 as their legend
            if (remainingItem.uniqueId === "00001122334455032") {
              console.log("using detailsArraySquared2");
              detailsArray = detailsArraySquared2;
            }

            console.log("detailsArray:", detailsArray);

            for (let j = 0; j < 7; j++) {
              saveToDatabase(detailsArray[j], dayArray[j]);
            }
            
            tutorialState.upload = true;
            saveTutorialState(tutorialState);
    
            //reload the page 
            location.reload();
      })
    })
  },
  checkToTriggerWDM: function(parameter) {
    getTutorialState()
      .then((tutorialState) => {
        console.log("in checkToTriggerWDM:");
        if (tutorialState.dailyBreakdown === true && tutorialState.activityFrequency === true && tutorialState.timeAllocation === true && tutorialState.categoryShare === true) {

        //removes the blinking effect on the arrow
        document.getElementById("next-chart").classList.remove("blinking-no-border");

        outputTutorialDialogue("weekMonthAndYear");

        } else {
          closeDialogue();
        }
      })
    //checks to trigger week,day,month dialogue after every chart (including the first one just in case the user has logged out before finishing)
  },
  checkToDirectUserToReset: function(parameter) {
    //checks to reactivate the reset button and directs user to the reset button 
    getTutorialState()
      .then((tutorialState) => {
        if (tutorialState.weekMonthAndYear === true && tutorialState.examineTheData === true) {
          document.getElementById("resetButton").classList.remove("deactivated-link");
          applyBlinking("resetButton");

          document.getElementById("resetButton").disabled = false;

          tutorialState.reset = true;
          saveTutorialState(tutorialState);

          document.getElementById("resetButton").addEventListener("click", function() {
            location.reload();
          })
        }
      })
  },
}

export let tutorialDialogue = [
  {
    name: "clickMyLegend",
    mainHeader: "Welcome to Minutiae!",
    subHeader: "",
    trigger: "logging in",
    dialogueArray: 
      ["To begin, let's set up your own personalized legend. This legend will help you categorize your activities and tasks, making it easier to track your time and analyze your habits.", 
      "Click the menu button and navigate to 'My Legend'."
      ],
    endAction: ["close"]
  },
  {
    name: "folderSystem",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "📂 Folder System",
    trigger: "enter My Legend for the first time",
    dialogueArray:
    [
      "Navigate your legend just like you would in a File Explorer. Categories are organized in a nested structure. Some categories might nest under others, creating a hierarchy that mirrors your life's diversity."
    ],
    endAction: ["makeYourChoice"]
  },
  {
    name: "makeYourChoice",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🌟 Make Your Choice",
    trigger: "after folderSystem",
    dialogueArray:
    [
      "Here, you'll see a range of pre-designed templates. Think of this as your starting point - you can modify it later.",
      "Click on the template option (A or B) that resonates with you the most."
    ],
    endAction: ["close", {function: "initializeChoice"}]
  },
  {
    name: "addNewCategories",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🎨 Add New Categories",
    trigger: "after choice is made and add button has been clicked",
    dialogueArray: 
    [
      "Life is diverse, and so are your activities. Whether it's work-related tasks, hobbies, or special projects, you can create new categories that reflect your unique lifestyle. Give it a name, color, and parent, and let the adventure begin!"
    ],
    endAction: [{function: "checkToTriggerYJYR"}]
  },
  {
    name: "deleteUnwantedCategories",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🗑️ Delete Unwanted Categories",
    trigger: "after choice is made and delete button has been clicked",
    dialogueArray: 
    [
      "Times change, and so do our priorities. If a category no longer fits your routine, no worries! With a simple click, you can bid farewell to a category. Just remember, deleting a category will also delete any associated slices which you have logged, so proceed with care."
    ],
    endAction: [{function: "checkToTriggerYJYR"}]
  },
  {
    name: "modifyCategoriesWithColorAndName",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "✏️ Modify Categories with Color and Name",
    trigger: "after choice is made and color or rename button has been clicked",
    dialogueArray:
    [
      "Personalization is key. You can assign a distinctive color and rename each category to match its purpose. This makes it easier to identify activities and adds a touch of your personality to your legend."
    ],
    endAction: [{function: "checkToTriggerYJYR"}]
  },
  {
    name: "introducingTags",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🏷️ Introducing Tags",
    trigger: "after choice is made and add tag button is clicked",
    dialogueArray: 
    [
      "While not part of the template, tags are powerful. They're versatile modifiers that can be attached to any slice. There's no limit to the number of tags you can use on a slice. This means you can capture multiple dimensions of an activity – who you're with, where you are, and even the mood you're in – all with just a few clicks."
    ],
    endAction: [{function: "checkToTriggerYJYR"}]
  },
  {
    name: "yourJourneyYourRules",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🚀 Your Journey, Your Rules",
    trigger: "after tutorial for legend UI",
    dialogueArray: 
    [
      "Remember, the legend you create is your personal time-tracking palette. You have the flexibility to adjust, experiment, and refine as your needs evolve. Every addition, every modification – they're all building blocks of your journey toward better time management and productivity."
    ],
    endAction: ["firstStepCompleted", {function: "advanceProgressBarTo25"}]
  },
  {
    name: "firstStepCompleted",
    mainHeader: "Tailor Your Time Tracking Experience",
    subHeader: "🚀 Your Journey, Your Rules",
    trigger: "after YJYR",
    dialogueArray: 
    [
      "Congratulations! You've completed the first step of your journey."
    ],
    endAction: ["clickToday", {function: "updateMenuElements", parameter: "today"}, {function: "reactivateTodayUrl"}]
  },
  {
    name: "clickToday",
    mainHeader: "",
    subHeader: "",
    trigger: "after tutorial bar progresses one step (which happens simultaneously with yourJourneyYourRules)",
    dialogueArray: 
    [
      "Click the menu button and navigate to 'Today'."
    ],
    endAction: ["close"]
  },
  {
    name: "welcomeToday",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "",
    trigger: "enter Today for the first time",
    dialogueArray: 
    [
      "Welcome to the heart of Minutiae, where you turn your time into insights! Let's get you familiar with its main features."
    ],
    endAction: ["close"]
  },
  {
    name: "formButton",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "📝 Form Button",
    trigger: "form button is clicked",
    dialogueArray:
    [
      "Here, you'll log your activities according to your legend categories. Simply choose a category from the dropdown list and pick the start and end times. Remember, you can also add tags for extra context and even describe the slice.",
      "Try it! Input a slice!"
    ],
    endAction: ["close"]
  }, 
  {
    name: "TwentyFourHourClockAndPieChart",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "⏱️ 24-Hour Clock & Pie Chart",
    trigger: "after inputting a slice",
    dialogueArray: 
    [
      "Nice!",
      "Right at the heart of the 'Today' page, you'll find a 24-hour clock, elegantly doubling as a pie chart. It's a visual delight! Your logged activities paint a picture of how you spend your day."
    ],
    endAction: ["legendBeneathTheClock"]
  }, 
  {
    name: "legendBeneathTheClock",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "🎨 Legend Beneath the Clock",
    trigger: "after TwentyFourHourClockAndPieChart",
    dialogueArray:
    [
      "It's your color-coded map, labeling what each shade means. A quick glance, and you'll understand how your day is unfolding."
    ],
    endAction: ["logButton"]
  },
  {
    name: "logButton",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "📚 Log Button",
    trigger: "after legendBeneathTheClock",
    dialogueArray: 
    [
      "Tap it to see your logged activities organized and neat. But that's not all..."
    ],
    endAction: ["close", {function: "directUserToLog"}, {function: "directUserToDeleteAndModify"}]
  },
  {
    name: "deleteAndModify",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "🗑️ Delete & Modify",
    trigger: "after clicking the see more options button in log",
    dialogueArray: 
    [
      "Now you can delete or modify slices – keeping your log tailored and relevant."
    ],
    endAction: ["close", {function: "continueToNTPFD"}]
  },
  {
    name: "navigateToPreviousFutureDays",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "⏮️⏭️ Navigate to Previous/Future Days",
    trigger: "after deleteAndModify",
    dialogueArray: 
    [
      "You can explore past and future days effortlessly by sliding the touch screen or clicking the arrows. Modify your clock/pie chart for any day to keep your insights accurate.",
      "In this tutorial, I've preloaded some data for the past week. Go check it out!"
    ],
    endAction: [{function: "uploadSampleData"}]
  },
  {
    name: "concludeToday",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "",
    trigger: "after using the back or forward button once",
    dialogueArray:
    [
      "And there you have it! Minutiae’s dashboard is designed to empower you to own your time."
    ],
    endAction: ["secondStepCompleted", {function: "advanceProgressBarTo50"}]
  },
  {
    name: "secondStepCompleted",
    mainHeader: "Navigating Your Minutiae Dashboard",
    subHeader: "🚀 Your Journey, Your Rules",
    trigger: "after concludeToday",
    dialogueArray: 
    [
      "Congratulations! You've completed the second step of your journey."
    ],
    endAction: ["clickCalendar", {function: "updateMenuElements", parameter: "calendar"}, {function: "reactivateCalendarUrl"}]
  },
  {
    name: "clickCalendar",
    mainHeader: "",
    subHeader: "",
    trigger: "after tutorial bar progresses one step (which happens simultaneously with concludeToday)",
    dialogueArray:
    [
      "Click the menu button and navigate to 'Calendar.'"
    ],
    endAction: ["close"]
  },
  {
    name: "chooseADate",
    mainHeader: "Navigating Through Time",
    subHeader: "🗓️ Choose a Date",
    trigger: "enter Calendar for the first time",
    dialogueArray:
    [
      "Simply tap on a date, and you'll instantly jump to that day's clock and pie chart. No need to swipe endlessly – the Calendar is your express route."
    ],
    endAction: ["close"]
  },
  {
    name: "calendarUsed",
    mainHeader: "Navigating Through Time",
    subHeader: "",
    trigger: "used the calendar for the first time",
    dialogueArray: 
    [
      "Once you've landed on your desired day, make tweaks to your clock and pie chart just like before."
    ],
    endAction: ["thirdStepCompleted", {function: "advanceProgressBarTo75"}]
  },
  {
    name: "thirdStepCompleted",
    mainHeader: "Navigating Through Time",
    subHeader: "🚀 Your Journey, Your Rules",
    trigger: "after calendarUsed",
    dialogueArray: 
    [
      "Congratulations! You've completed the third step of your journey."
    ],
    endAction:  ["clickAnalytics", {function: "updateMenuElements", parameter: "analytics"}, {function: "reactivateAnalyticsUrl"}]
  },
  {
    name: "clickAnalytics",
    mainHeader: "",
    subHeader: "",
    trigger: "after tutorial bar progresses one step (which happens simultaneously with calendarUsed)",
    dialogueArray: 
    [
      "Click the menu button and navigate to 'Analytics'."
    ],
    endAction: ["close"]
  },
  {
    name: "welcomeAnalytics",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "",
    trigger: "enter Analytics for the first time",
    dialogueArray:
    [
      "Welcome to the world of data-driven insights! The Minutiae Analytics page is where your tracking efforts transform into meaningful patterns. Let's dive in!"
    ],
    endAction: ["craftingYourCustomReport"]
  },
  {
    name: "craftingYourCustomReport",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📑 Crafting Your Custom Report",
    trigger: "after welcomeAnalytics",
    dialogueArray:
    [
      "Choose a category from your legend that you want to investigate further. This will be the focal point of your report.",
      "Define your time scope with a choice of 'Week,' 'Month,' or 'Year.' For the purpose of this exercise, please choose 'Week'. Lastly, pick a starting date for your report. Please choose 8/27/23."
    ],
    endAction: ["close"]
  }, 
  {
    name: "dailyBreakdown",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📊 Daily Breakdown",
    trigger: "after correct parameters have been submitted for report generation",
    dialogueArray:
    [
      "The bar chart reveals the minutes you've spent on the selected category for each day of your chosen week. The average daily time spent is prominently displayed at the top."
    ],
    endAction: [{function: "checkToTriggerWDM"}]
  },
  {
    name: "activityFrequency",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📊 Activity Frequency",
    trigger: "after clicking the next button and viewing this chart",
    dialogueArray:
    [
      "A frequency bar chart illustrates when you engage in this activity across the hours of the day and the days of the week. Insightful patterns emerge, revealing the timing of your engagement."
    ],
    endAction: [{function: "checkToTriggerWDM"}]
  },
  {
    name: "timeAllocation",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📊 Time Allocation",
    trigger: "after clicking the next button and viewing this chart",
    dialogueArray:
    [
      "A pie chart tells you what percentage of your selected time horizon was dedicated to this activity. It's a snapshot of your focus in the bigger picture."
    ],
    endAction: [{function: "checkToTriggerWDM"}]
  },
  {
    name: "categoryShare",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📊 Category Share",
    trigger: "after clicking the next button and viewing this chart",
    dialogueArray:
    [
      "Another pie chart showcases the activity's contribution to its parent category's overall time share. It's a powerful way to see where your efforts are concentrated within your broader endeavors."
    ],
    endAction: [{function: "checkToTriggerWDM"}]
  },
  {
    name: "weekMonthAndYear",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "📆 Week, Month, and Year",
    trigger: "after viewing all the charts",
    dialogueArray:
    [
      "If you've selected a 'Month,' we consider it as four 7-day weeks (28 days). For a 'Year,' it's equivalent to 12 months or 336 days. This approach ensures equal intervals for precise chart readings. "
    ],
    endAction: ["close", {function: "checkToDirectUserToReset"}]
  },
  {
    name: "examineTheData",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "🔍 Examine the Data",
    trigger: "after See Details button is clicked",
    dialogueArray:
    [
      "When you're engrossed in your analytics report, the 'See Details' button is your window into the finer points. Clicking it reveals an in-depth log of all the data points used to craft your report. "
    ],
    endAction: ["close", {function: "checkToDirectUserToReset"}]
  },
  {
    name: "startingAfresh",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "🔄 Starting Afresh",
    trigger: "after Reset button is clicked",
    dialogueArray:
    [
      "The 'Reset' button refreshes the page and restarts your report generation process so you can explore different categories, time spans, and start dates right away."
    ], 
    endAction: ["embraceTheInsights"]
  },
  {
    name: "embraceTheInsights",
    mainHeader: "Exploring Insights with Minutiae Analytics",
    subHeader: "🌟 Embrace the Insights",
    trigger: "after tutorial for analytics UI and charts have been viewed",
    dialogueArray:
    [
      "As you interact with your report, you'll uncover valuable insights into your routines and habits. The charts tell a story – your story – about how you spend your time."
    ],
    endAction: ["finalMessage", {function: "advanceProgressBarTo100"}]
  },
  {
    name: "finalMessage",
    mainHeader: "",
    subHeader: "",
    trigger: "after tutorial bar progresses one step (which happens simultaneously with embraceTheInsights)",
    dialogueArray: 
    [
      "That's it! Now you understand what Minutiae is all about! Thank you for taking the time to go through this tutorial and good luck to you in your future endeavors!"
    ],
    endAction: ["close", {function: "reactivateSettingsUrl"}]
  }
]

//choice and slice and reset are not bools for tutorialDialogue
//they are bools to check if user has triggered more dialogue through actions like submitting choice of legend, inputting a slice, resetting the page, etc.
//upload is a bool describing whether or not the account has the sample data saved into it
export const tutorialStateInitialization =
{
  clickMyLegend: false,
	folderSystem: false,
	makeYourChoice: false,
  choice: false,
	addNewCategories: false,
	deleteUnwantedCategories: false,
	modifyCategoriesWithColorAndName: false,
	introducingTags: false,
	yourJourneyYourRules: false,
  firstStepCompleted: false,
	clickToday: false,
	welcomeToday: false,
	formButton: false,
  slice: false,
	TwentyFourHourClockAndPieChart: false,
	legendBeneathTheClock: false,
	logButton: false,
	deleteAndModify: false,
	navigateToPreviousFutureDays: false,
  upload: false,
	concludeToday: false,
  secondStepCompleted: false,
	clickCalendar: false,
	chooseADate: false,
	calendarUsed: false,
  thirdStepCompleted: false,
	clickAnalytics: false,
	welcomeAnalytics: false,
	craftingYourCustomReport: false,
	dailyBreakdown: false,
	activityFrequency: false,
	timeAllocation: false,
	categoryShare: false,
	weekMonthAndYear: false,
	examineTheData: false,
	startingAfresh: false,
  reset: false,
	embraceTheInsights: false,
	finalMessage: false
}

export const data = [
  {
    name: "Sleep",
    color: "#5F05B3",
    uniqueId: "00001122334455001"
  },
  {
    name: "Work",
    color: "#09BC8A",
    uniqueId: "00001122334455003"
  },
  {
    name: "Miscellaneous",
    color: "#3587A4",
    uniqueId: "00001122334455007"
  },
  {
    name: "Meal",
    color: "#F21B3F",
    uniqueId: "00001122334455011"
  },
  {
    name: "Play",
    color: "#FF9914",
    uniqueId: "00001122334455016"
  },
  { name: "Remaining", color: "white", uniqueId: "00001122334455019" }
]

export const data2 = [
  {
    name: "Unproductive",
    color: "#FF0000",
    uniqueId: "00001122334455020"
  },
  {
    name: "Productive",
    children: [
      { name: "Work", color: "#00FF00", uniqueId: "00001122334455025" }
    ],
    color: "#00FF00",
    uniqueId: "00001122334455024"
  },
  {
    name: "Essential",
    children: [
      { name: "Sleep", color: "#0000FF", uniqueId: "00001122334455029" },
      { name: "Chores", color: "#0000FF", uniqueId: "00001122334455030" },
      { name: "Self Maintenance", color: "#0000FF", uniqueId: "00001122334455031" },
    ],
    color: "#0000FF", uniqueId: "00001122334455028",
  },
  { name: "Remaining", color: "white", uniqueId: "00001122334455032" }
]

export const detailsArraySquared = [
  //first day
  [
    {
      color: "#5F05B3",
      duration: 360,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455001"
    },
    {
      color: "#F21B3F",
      duration: 60,
      name: "Meal",
      start: 360,
      uniqueId: "00001122334455011"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 420,
      uniqueId: "00001122334455007"
    },
    {
      color: "#09BC8A",
      duration: 240,
      name: "Work",
      start: 480,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 720,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 150,
      name: "Work",
      start: 750,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 900,
      uniqueId: "00001122334455011"
    },
    {
      color: "#3587A4",
      duration: 90,
      name: "Miscellaneous",
      start: 930,
      uniqueId: "00001122334455007"
    },
    {
      color: "#09BC8A",
      duration: 120,
      name: "Work",
      start: 1020,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 60,
      name: "Meal",
      start: 1140,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 120,
      name: "Play",
      start: 1200,
      uniqueId: "00001122334455016"
    },
    {
      color: "#5F05B3",
      duration: 120,
      name: "Sleep",
      start: 1320,
      uniqueId: "00001122334455001"
    }
  ], 
  //second day
  [
    {
      color: "#5F05B3",
      duration: 540,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455001"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 540,
      uniqueId: "00001122334455007"
    },
    {
      color: "#F21B3F",
      duration: 15,
      name: "Meal",
      start: 570,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 135,
      name: "Work",
      start: 585,
      uniqueId: "00001122334455003"
    },
    {
      color: "#5F05B3",
      duration: 60,
      name: "Sleep",
      start: 720,
      uniqueId: "00001122334455001"
    },
    {
      color: "#09BC8A",
      duration: 240,
      name: "Work",
      start: 780,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 1020,
      uniqueId: "00001122334455007"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 1050,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 120,
      name: "Play",
      start: 1080,
      uniqueId: "00001122334455016"
    },
    {
      color: "#09BC8A",
      duration: 90,
      name: "Work",
      start: 1200,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 1290,
      uniqueId: "00001122334455007"
    },
    {
      color: "#FF9914",
      duration: 60,
      name: "Play",
      start: 1350,
      uniqueId: "00001122334455016"
    },
    {
      color: "#09BC8A",
      duration: 30,
      name: "Work",
      start: 1410,
      uniqueId: "00001122334455003"
    }
  ],
  //third day
  [
    {
      color: "#5F05B3",
      duration: 480,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455001"
    },
    {
      color: "#09BC8A",
      duration: 90,
      name: "Work",
      start: 480,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 570,
      uniqueId: "00001122334455011"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 600,
      uniqueId: "00001122334455007"
    },
    {
      color: "#09BC8A",
      duration: 270,
      name: "Work",
      start: 630,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 900,
      uniqueId: "00001122334455007"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 960,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 150,
      name: "Work",
      start: 990,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 1140,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 210,
      name: "Play",
      start: 1170,
      uniqueId: "00001122334455016"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 1380,
      uniqueId: "00001122334455007"
    }
  ],
  //fourth day
  [
    {
      color: "#5F05B3",
      duration: 360,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455001"
    },
    {
      color: "#09BC8A",
      duration: 120,
      name: "Work",
      start: 360,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 480,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 90,
      name: "Work",
      start: 510,
      uniqueId: "00001122334455003"
    },
    {
      color: "#FF9914",
      duration: 30,
      name: "Play",
      start: 600,
      uniqueId: "00001122334455016"
    },
    {
      color: "#09BC8A",
      duration: 60,
      name: "Work",
      start: 630,
      uniqueId: "00001122334455003"
    },
    {
      color: "#FF9914",
      duration: 45,
      name: "Play",
      start: 690,
      uniqueId: "00001122334455016"
    },
    {
      color: "#09BC8A",
      duration: 75,
      name: "Work",
      start: 735,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 810,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 180,
      name: "Work",
      start: 840,
      uniqueId: "00001122334455003"
    },
    {
      color: "#FF9914",
      duration: 180,
      name: "Play",
      start: 1020,
      uniqueId: "00001122334455016"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 1200,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 60,
      name: "Play",
      start: 1230,
      uniqueId: "00001122334455016"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 1290,
      uniqueId: "00001122334455007"
    },
    {
      color: "#5F05B3",
      duration: 120,
      name: "Sleep",
      start: 1320,
      uniqueId: "00001122334455001"
    }
  ],
  //fifth day
  [
    {
      color: "#5F05B3",
      duration: 480,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455001"
    },
    {
      color: "#F21B3F",
      duration: 60,
      name: "Meal",
      start: 480,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 180,
      name: "Work",
      start: 540,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 720,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 90,
      name: "Play",
      start: 750,
      uniqueId: "00001122334455016"
    },
    {
      color: "#3587A4",
      duration: 120,
      name: "Miscellaneous",
      start: 840,
      uniqueId: "00001122334455007"
    },
    {
      color: "#09BC8A",
      duration: 120,
      name: "Work",
      start: 960,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 90,
      name: "Miscellaneous",
      start: 1080,
      uniqueId: "00001122334455007"
    },
    {
      color: "#FF9914",
      duration: 180,
      name: "Play",
      start: 1170,
      uniqueId: "00001122334455016"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 1350,
      uniqueId: "00001122334455007"
    },
    {
      color: "#5F05B3",
      duration: 30,
      name: "Sleep",
      start: 1410,
      uniqueId: "00001122334455001"
    }
  ],
  //sixth day
  [
    {
      color: "#FF9914",
      duration: 120,
      name: "Play",
      start: 0,
      uniqueId: "00001122334455016"
    },
    {
      color: "#5F05B3",
      duration: 300,
      name: "Sleep",
      start: 120,
      uniqueId: "00001122334455001"
    },
    {
      color: "#09BC8A",
      duration: 30,
      name: "Work",
      start: 420,
      uniqueId: "00001122334455003"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 450,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 90,
      name: "Work",
      start: 480,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 570,
      uniqueId: "00001122334455007"
    },
    {
      color: "#09BC8A",
      duration: 240,
      name: "Work",
      start: 600,
      uniqueId: "00001122334455003"
    },
    {
      color: "#5F05B3",
      duration: 90,
      name: "Sleep",
      start: 840,
      uniqueId: "00001122334455001"
    },
    {
      color: "#FF9914",
      duration: 30,
      name: "Play",
      start: 930,
      uniqueId: "00001122334455016"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 960,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 120,
      name: "Work",
      start: 990,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 1110,
      uniqueId: "00001122334455007"
    },
    {
      color: "#5F05B3",
      duration: 30,
      name: "Sleep",
      start: 1170,
      uniqueId: "00001122334455001"
    },
    {
      color: "#FF9914",
      duration: 120,
      name: "Play",
      start: 1200,
      uniqueId: "00001122334455016"
    },
    {
      color: "#F21B3F",
      duration: 60,
      name: "Meal",
      start: 1320,
      uniqueId: "00001122334455011"
    },
    {
      color: "#FF9914",
      duration: 60,
      name: "Play",
      start: 1380,
      uniqueId: "00001122334455016"
    }
  ],
  //seventh day
  [
    {
      color: "#FF9914",
      duration: 30,
      name: "Play",
      start: 0,
      uniqueId: "00001122334455016"
    },
    {
      color: "#5F05B3",
      duration: 480,
      name: "Sleep",
      start: 30,
      uniqueId: "00001122334455001"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 510,
      uniqueId: "00001122334455011"
    },
    {
      color: "#3587A4",
      duration: 180,
      name: "Miscellaneous",
      start: 540,
      uniqueId: "00001122334455007"
    },
    {
      color: "#F21B3F",
      duration: 90,
      name: "Meal",
      start: 720,
      uniqueId: "00001122334455011"
    },
    {
      color: "#09BC8A",
      duration: 180,
      name: "Work",
      start: 810,
      uniqueId: "00001122334455003"
    },
    {
      color: "#FF9914",
      duration: 90,
      name: "Play",
      start: 990,
      uniqueId: "00001122334455016"
    },
    {
      color: "#09BC8A",
      duration: 60,
      name: "Work",
      start: 1080,
      uniqueId: "00001122334455003"
    },
    {
      color: "#3587A4",
      duration: 60,
      name: "Miscellaneous",
      start: 1140,
      uniqueId: "00001122334455007"
    },
    {
      color: "#F21B3F",
      duration: 30,
      name: "Meal",
      start: 1200,
      uniqueId: "00001122334455011"
    },
    {
      color: "#3587A4",
      duration: 90,
      name: "Miscellaneous",
      start: 1230,
      uniqueId: "00001122334455007"
    },
    {
      color: "#FF9914",
      duration: 90,
      name: "Play",
      start: 1320,
      uniqueId: "00001122334455016"
    },
    {
      color: "#3587A4",
      duration: 30,
      name: "Miscellaneous",
      start: 1410,
      uniqueId: "00001122334455007"
    }
  ]
]

export const detailsArraySquared2 = [
  //first day
  [
    {
      color: "#0000FF",
      duration: 420,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455029"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Essential",
      start: 420,
      uniqueId: "00001122334455028"
    },
    {
      color: "#00FF00",
      duration: 90,
      name: "Work",
      start: 450,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 120,
      name: "Chores",
      start: 540,
      uniqueId: "00001122334455030"
    },
    {
      color: "#00FF00",
      duration: 180,
      name: "Work",
      start: 660,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Self Maintenance",
      start: 840,
      uniqueId: "00001122334455031"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Essential",
      start: 900,
      uniqueId: "00001122334455028"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 930,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Self Maintenance",
      start: 1050,
      uniqueId: "00001122334455031"
    },
    {
      color: "#00FF00",
      duration: 60,
      name: "Work",
      start: 1110,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 150,
      name: "Unproductive",
      start: 1170,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Chores",
      start: 1320,
      uniqueId: "00001122334455030"
    },
    {
      color: "#0000FF",
      duration: 90,
      name: "Sleep",
      start: 1350,
      uniqueId: "00001122334455029"
    }
  ],
  //second day
  [
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 0,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Chores",
      start: 120,
      uniqueId: "00001122334455030"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Self Maintenance",
      start: 180,
      uniqueId: "00001122334455031"
    },
    {
      color: "#0000FF",
      duration: 270,
      name: "Sleep",
      start: 210,
      uniqueId: "00001122334455029"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Essential",
      start: 480,
      uniqueId: "00001122334455028"
    },
    {
      color: "#00FF00",
      duration: 180,
      name: "Work",
      start: 540,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 120,
      name: "Essential",
      start: 720,
      uniqueId: "00001122334455028"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 840,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 240,
      name: "Work",
      start: 900,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 90,
      name: "Essential",
      start: 1140,
      uniqueId: "00001122334455028"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 1230,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Self Maintenance",
      start: 1350,
      uniqueId: "00001122334455031"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 1380,
      uniqueId: "00001122334455020"
    }
  ],
  //third day
  [
    {
      color: "#FF0000",
      duration: 90,
      name: "Unproductive",
      start: 0,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Self Maintenance",
      start: 90,
      uniqueId: "00001122334455031"
    },
    {
      color: "#0000FF",
      duration: 420,
      name: "Sleep",
      start: 120,
      uniqueId: "00001122334455029"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Chores",
      start: 540,
      uniqueId: "00001122334455030"
    },
    {
      color: "#00FF00",
      duration: 180,
      name: "Work",
      start: 570,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 750,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 120,
      name: "Work",
      start: 810,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 30,
      name: "Unproductive",
      start: 930,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 180,
      name: "Work",
      start: 960,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Chores",
      start: 1140,
      uniqueId: "00001122334455030"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 1200,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 30,
      name: "Work",
      start: 1320,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 1350,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Self Maintenance",
      start: 1410,
      uniqueId: "00001122334455031"
    }
  ],
  //fourth day
  [
    {
      color: "#0000FF",
      duration: 420,
      name: "Sleep",
      start: 0,
      uniqueId: "00001122334455029"
    },
    {
      color: "#00FF00",
      duration: 60,
      name: "Productive",
      start: 420,
      uniqueId: "00001122334455024"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Sleep",
      start: 480,
      uniqueId: "00001122334455029"
    },
    {
      color: "#00FF00",
      duration: 120,
      name: "Work",
      start: 540,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 30,
      name: "Unproductive",
      start: 660,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 150,
      name: "Work",
      start: 690,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 90,
      name: "Self Maintenance",
      start: 840,
      uniqueId: "00001122334455031"
    },
    {
      color: "#0000FF",
      duration: 150,
      name: "Chores",
      start: 930,
      uniqueId: "00001122334455030"
    },
    {
      color: "#FF0000",
      duration: 180,
      name: "Unproductive",
      start: 1080,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Self Maintenance",
      start: 1260,
      uniqueId: "00001122334455031"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 1320,
      uniqueId: "00001122334455020"
    }
  ],
  //fifth day
  [
    {
      color: "#FF0000",
      duration: 150,
      name: "Unproductive",
      start: 0,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 30,
      name: "Work",
      start: 150,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 480,
      name: "Sleep",
      start: 180,
      uniqueId: "00001122334455029"
    },
    {
      color: "#00FF00",
      duration: 240,
      name: "Work",
      start: 660,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Essential",
      start: 900,
      uniqueId: "00001122334455028"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 930,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 60,
      name: "Work",
      start: 990,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 30,
      name: "Unproductive",
      start: 1050,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 60,
      name: "Work",
      start: 1080,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Essential",
      start: 1140,
      uniqueId: "00001122334455028"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 1200,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 120,
      name: "Work",
      start: 1260,
      uniqueId: "00001122334455025"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Self Maintenance",
      start: 1380,
      uniqueId: "00001122334455031"
    }
  ],
  //sixth day
  [
    {
      color: "#00FF00",
      duration: 60,
      name: "Productive",
      start: 0,
      uniqueId: "00001122334455024"
    },
    {
      color: "#0000FF",
      duration: 480,
      name: "Sleep",
      start: 60,
      uniqueId: "00001122334455029"
    },
    {
      color: "#0000FF",
      duration: 30,
      name: "Self Maintenance",
      start: 540,
      uniqueId: "00001122334455031"
    },
    {
      color: "#00FF00",
      duration: 210,
      name: "Work",
      start: 570,
      uniqueId: "00001122334455025"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 780,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 180,
      name: "Chores",
      start: 900,
      uniqueId: "00001122334455030"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 1080,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 180,
      name: "Productive",
      start: 1200,
      uniqueId: "00001122334455024"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 1380,
      uniqueId: "00001122334455020"
    }
  ],
  //seventh day
  [
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 0,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 420,
      name: "Sleep",
      start: 120,
      uniqueId: "00001122334455029"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 540,
      uniqueId: "00001122334455020"
    },
    {
      color: "#0000FF",
      duration: 60,
      name: "Chores",
      start: 600,
      uniqueId: "00001122334455030"
    },
    {
      color: "#FF0000",
      duration: 360,
      name: "Unproductive",
      start: 660,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 60,
      name: "Productive",
      start: 1020,
      uniqueId: "00001122334455024"
    },
    {
      color: "#FF0000",
      duration: 120,
      name: "Unproductive",
      start: 1080,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 90,
      name: "Productive",
      start: 1200,
      uniqueId: "00001122334455024"
    },
    {
      color: "#FF0000",
      duration: 60,
      name: "Unproductive",
      start: 1290,
      uniqueId: "00001122334455020"
    },
    {
      color: "#00FF00",
      duration: 90,
      name: "Work",
      start: 1350,
      uniqueId: "00001122334455025"
    }
  ]
]

export function initializeChoice() {

  getTutorialState()
    .then((tutorialState) => {
      document.getElementById("initializationUI").style.display = "block";
      document.getElementById("blurred-overlay-legend").style.display = "block";
  
      let initializationOption = "A";

      updateVisualization(data, "#tree-container");
      initializeFolders(data);
    
      document.getElementById("choice-one-button").addEventListener("click", function() {
        console.log("choice one button");
      
        removeVisualization("#tree-container");
        removeFolders();
      
        updateVisualization(data, "#tree-container");
        initializeFolders(data);
      
        initializationOption = "A";
      
      })
      
      document.getElementById("choice-two-button").addEventListener("click", function() {
        console.log("choice one button");
      
        removeVisualization("#tree-container");
        removeFolders();
      
        updateVisualization(data2, "#tree-container");
        initializeFolders(data2);
        
        initializationOption = "B";
      
      })
      
      document.getElementById("submit-initialization").addEventListener("click", function() {
  
        console.log("submit:", initializationOption);

        saveTutorialStateChoice();
  
        if (initializationOption === "A") {
          saveLegendToDatabase(data);

          document.getElementById("initializationUI").style.display = "none";
          document.getElementById("blurred-overlay-legend").style.display = "none";
      
          removeVisualization("#tree-container");
          removeFolders();
      
          updateVisualization(data, "#tree-container");
          initializeFolders(data);
  
        } else if (initializationOption === "B") {
          saveLegendToDatabase(data2);
  
          document.getElementById("initializationUI").style.display = "none";
          document.getElementById("blurred-overlay-legend").style.display = "none";
      
          removeVisualization("#tree-container");
          removeFolders();
      
          updateVisualization(data2, "#tree-container");
          initializeFolders(data2);
        }
      })
    })
}

export function saveTutorialStateChoice() {
  getTutorialState()
    .then((tutorialState) => {
      tutorialState.choice = true;
      saveTutorialState(tutorialState);
    })
}

export function updateCraftingYourCustomReportDialogue(tutorialDialogue) {
  console.log("updateCraftingYourCustomReportDialogue()");

  const now = DateTime.now();
  const sevenDaysAgo = now.minus({ days: 7 });
  const formattedSevenDaysAgo = sevenDaysAgo.toFormat('M/d/yy');

  tutorialDialogue.find(item => item.name === "craftingYourCustomReport").dialogueArray[1] = "Define your time scope with a choice of 'Week,' 'Month,' or 'Year.' For the purpose of this exercise, please choose 'Week'. Lastly, pick a starting date for your report. Please choose " + formattedSevenDaysAgo + ".";
}

export function deactivateElement(elementId) {
  //this will be called on the URL elements on the menu 
  //might not work for existing buttons because we have to handle their existing event listeners

  const element = document.getElementById(elementId);
  
  element.classList.add("deactivated-link");

  const originalClickListener = element.onclick;

  element.removeEventListener("click", originalClickListener);

  /* element.addEventListener("click", function(event) {
    event.preventDefault();
  }) */

  /* return function reactivateElement() {
    element.classList.remove("deactivated-link");

    element.removeEventListener("click", function(event) {
      event.preventDefault();
    })

    element.addEventListener("click", originalClickListener);
  }; */

  /*
    document.getElementById("app-url").classList.add("deactivated-link");
        document.getElementById("app-url").addEventListener("click", function (event) {
          event.preventDefault();
        })
  */

}

export function applyBlinking(elementId) {
  console.log("applyBlinking to:", elementId);
  //this can apply blinking class to an element

  const element = document.getElementById(elementId);

  if (element) {
    element.style.borderColor = "gold";
    element.classList.add("blinking");
  }

  /*
    document.getElementById("menu").style.borderColor = "gold";
    document.getElementById("menu").classList.add("blinking");
  
    document.getElementById("customize-url").style.border = "2px solid gold";
    document.getElementById("customize-url").style.borderRadius = "10px";
    document.getElementById("customize-url").classList.add("blinking");
  */
}

export function updateMenuElements(nextStep) {
  console.log("updateMenuElements()");
  //nextStep is a string: "myLegend", "today", "calendar", "analytics"

    if (nextStep === "myLegend") {
      //apply blinking to myLegend
      //deactivate all the links that are locked

      //because all links are deactivated before anyone logs in, you need to reactivate them before deactivating the appropriate ones for the tutorial
      functions["reactivateMyLegendUrl"]();

      document.getElementById("customize-url").style.border = "2px solid gold";
      document.getElementById("customize-url").style.borderRadius = "10px";
      document.getElementById("customize-url").classList.add("blinking");

      deactivateElement("app-url");
      deactivateElement("data-url");
      deactivateElement("calendar-url");
    
    } else if (nextStep === "today") {
      //apply blinking to today
      //deactivate all the links that are locked

      functions["reactivateMyLegendUrl"]();
      functions["reactivateTodayUrl"]();

      document.getElementById("app-url").style.border = "2px solid gold";
      document.getElementById("app-url").style.borderRadius = "10px";
      document.getElementById("app-url").classList.add("blinking");

      deactivateElement("data-url");
      deactivateElement("calendar-url");

    } else if (nextStep === "calendar") {
      //apply blinking to calendar
      //deactivate all the links that are locked

      functions["reactivateMyLegendUrl"]();
      functions["reactivateTodayUrl"]();
      functions["reactivateCalendarUrl"]();

      document.getElementById("calendar-url").style.border = "2px solid gold";
      document.getElementById("calendar-url").style.borderRadius = "10px";
      document.getElementById("calendar-url").classList.add("blinking");

      deactivateElement("data-url");

    } else if (nextStep === "analytics") {
      //apply blinking to analytics
      //deactivate all the links that are locked

      functions["reactivateMyLegendUrl"]();
      functions["reactivateTodayUrl"]();
      functions["reactivateCalendarUrl"]();
      functions["reactivateAnalyticsUrl"]();

      document.getElementById("data-url").style.border = "2px solid gold";
      document.getElementById("data-url").style.borderRadius = "10px";
      document.getElementById("data-url").classList.add("blinking");
    }

    //apply blinking to the menu
    document.getElementById("menu").style.borderColor = "gold";
    document.getElementById("menu").classList.add("blinking");

    deactivateElement("settings-url");
}

export function updateTutorial(tutorialState) {
  console.log("updateTutorial()");
  if (tutorialState.firstStepCompleted === true && tutorialState.secondStepCompleted === false) {
    functions["advanceProgressBarTo25"]();
  }

  if (tutorialState.secondStepCompleted === true && tutorialState.thirdStepCompleted === false) {
    functions["advanceProgressBarTo50"]();
  }

  if (tutorialState.thirdStepCompleted === true && tutorialState.finalMessage === false) {
    functions["advanceProgressBarTo75"]();
  }

  const currentPage = window.location.pathname;
  console.log("currentPage:", currentPage);
  
  if (currentPage === "/index.html" || currentPage === "/%3Curl-to-redirect-to-on-success%3E" || currentPage === "/") {
    updateTutorialHome(tutorialState);
  } 
  if (currentPage === "/customize.html") {
    updateTutorialLegend(tutorialState);
  }
  if (currentPage === "/app.html") {
    updateTutorialToday(tutorialState);
  }
  if (currentPage === "/calendar.html") {
    updateTutorialCalendar(tutorialState);
  }
  if (currentPage === "/data.html") {
    updateTutorialAnalytics(tutorialState);
  }
}

export function updateTutorialHome(tutorialState) { 
  console.log("updateTutorialHome()");
  let nextStep = "";

  if (tutorialState.firstStepCompleted === false) {
    outputTutorialDialogue("clickMyLegend");
    nextStep = "myLegend";

  } else if (tutorialState.twentyFourHourClockAndPieChart === false || tutorialState.deleteAndModify === false || tutorialState.secondStepCompleted === false) {
    outputTutorialDialogue("clickToday");
    nextStep = "today";
  } else if (tutorialState.thirdStepCompleted === false) {
    outputTutorialDialogue("clickCalendar");
    nextStep = "calendar";
  } else if (tutorialState.startingAfresh === false) {
    outputTutorialDialogue("clickAnalytics");
    nextStep = "analytics";
  } else if (tutorialState.embracingTheInsights === false) {
    outputTutorialDialogue("embracingTheInsights");
  } else if (tutorialState.finalMessage === false) {
    outputTutorialDialogue("finalMessage");
  }

  console.log("nextStep:", nextStep);

  updateMenuElements(nextStep);
}

export function identifyNextStep(tutorialState) {
  let nextStep = "";

   //need the second part so that when you use the calendar for the first time, it doesn't try to redirect you back to the calendar
  let urlParams = new URLSearchParams(window.location.search);
  let dateParam = urlParams.get('date');

  if (tutorialState.firstStepCompleted === false) {
    nextStep = "myLegend";

  } else if (tutorialState.secondStepCompleted === false) {
    nextStep = "today";
  } else if (tutorialState.thirdStepCompleted === false && !dateParam) {
    nextStep = "calendar";
  } else if (tutorialState.startingAfresh === false) {
    nextStep = "analytics";
  }

  return nextStep;
}

export function updateTutorialLegend(tutorialState) {
  console.log("updateTutorialLegend()");
  //My Legend
  /*
    clickMyLegend: false,
    folderSystem: false,
    **makeYourChoice: false,
    choice: false,
    addNewCategories: false,
    deleteUnwantedCategories: false,
    modifyCategoriesWithColorAndName: false,
    introducingTags: false,
    **yourJourneyYourRules: false,
    firstStepCompleted: false
  */

  if (tutorialState.finalMessage === false && tutorialState.firstStepCompleted === true) {
    let nextStep = identifyNextStep(tutorialState);
    updateMenuElements(nextStep);
  } else {
    deactivateElement("app-url");
    deactivateElement("data-url");
    deactivateElement("calendar-url");
    deactivateElement("settings-url");
  }

  if (tutorialState.choice === false) {
    //folderSystem, makeYourChoice
    outputTutorialDialogue("folderSystem");
  } else {
    receiveLegendFromDatabase()
        .then((legend) => {

          updateVisualization(legend, "#tree-container");
          initializeFolders(legend); //must be after createClickHandler();
          receiveTagsFromDatabase()
            .then((tags) => {
              updateTags(tags);
            })
        })
  }
  
  if (tutorialState.addNewCategories === false) {
    applyBlinking("addCategoryButton");
    document.getElementById("addCategoryButton").addEventListener("click", handleAddNewCategoriesClick);
  }

  function handleAddNewCategoriesClick(event) {
    outputTutorialDialogue("addNewCategories");
    document.getElementById("addCategoryButton").classList.remove("blinking");
    document.getElementById("addCategoryButton").style.borderColor = "#1b1b1b";

    document.getElementById("addCategoryButton").removeEventListener("click", handleAddNewCategoriesClick);
  }

  if (tutorialState.deleteUnwantedCategories === false) {
    applyBlinking("deleteButton");
    document.getElementById("deleteButton").addEventListener("click", handleDeleteUnwantedCategoriesClick);
  }

  function handleDeleteUnwantedCategoriesClick(event) {
    outputTutorialDialogue("deleteUnwantedCategories");
    document.getElementById("deleteButton").classList.remove("blinking");
    document.getElementById("deleteButton").style.borderColor = "#1b1b1b";

    document.getElementById("deleteButton").removeEventListener("click", handleDeleteUnwantedCategoriesClick);
  }

  if (tutorialState.modifyCategoriesWithColorAndName === false) {
    applyBlinking("renameButton");
    document.getElementById("renameButton").addEventListener("click", handleModifyCategoriesWithColorAndNameClick);
  }

  function handleModifyCategoriesWithColorAndNameClick(event) {
    outputTutorialDialogue("modifyCategoriesWithColorAndName");
    document.getElementById("renameButton").classList.remove("blinking");
    document.getElementById("renameButton").style.borderColor = "#1b1b1b";

    document.getElementById("renameButton").removeEventListener("click", handleModifyCategoriesWithColorAndNameClick);
  }

  if (tutorialState.introducingTags === false) {
    applyBlinking("addTag");
    document.getElementById("addTag").addEventListener("click", handleIntroducingTagsClick);
  }

  function handleIntroducingTagsClick(event) {
    outputTutorialDialogue("introducingTags");
    document.getElementById("addTag").classList.remove("blinking");
    document.getElementById("addTag").style.borderColor = "#1b1b1b";

    document.getElementById("addTag").removeEventListener("click", handleIntroducingTagsClick);
  }

  if (tutorialState.addNewCategories === true && tutorialState.deleteUnwantedCategories === true && tutorialState.modifyCategoriesWithColorAndName === true && tutorialState.introducingTags === true && tutorialState.choice === true && tutorialState.firstStepCompleted === false) {
    outputTutorialDialogue("yourJourneyYourRules");
  }
}

export function updateTutorialToday(tutorialState) {
  //Today
  /*
    clickToday: false,
    welcomeToday: false,
    formButton: false,
    **TwentyFourHourClockAndPieChart: false,
    legendBeneathTheClock: false,
    logButton: false,
    **deleteAndModify: false,
    navigateToPreviousFutureDays: false,
    upload: false,
    previousFuture: false,
    **concludeToday: false,
    secondStepCompleted: false
  */

  if (tutorialState.finalMessage === false && tutorialState.secondStepCompleted === true) {
    let nextStep = identifyNextStep(tutorialState);
    updateMenuElements(nextStep);
  } else {
    deactivateElement("data-url");
    deactivateElement("calendar-url");
    deactivateElement("settings-url");
  }

  if (tutorialState.TwentyFourHourClockAndPieChart === false) {
    outputTutorialDialogue("welcomeToday");

    applyBlinking("add-slice-button");

    document.getElementById("add-slice-button").addEventListener("click", handleFormClick);

    function handleFormClick(event) {
      outputTutorialDialogue("formButton");
      document.getElementById("add-slice-button").classList.remove("blinking");
      document.getElementById("add-slice-button").style.borderColor = "#1b1b1b";

      document.getElementById("add-slice-button").removeEventListener("click", handleFormClick);
    }

  } else if (tutorialState.TwentyFourHourClockAndPieChart === true && tutorialState.deleteAndModify === false) {
    outputTutorialDialogue("TwentyFourHourClockAndPieChart");
  }

  if (tutorialState.navigateToPreviousFutureDays === true && tutorialState.upload === false) {
    functions["uploadSampleData"]();
  }

  if (tutorialState.navigateToPreviousFutureDays === true && tutorialState.concludeToday === false) {
    functions["directUserToPreviousFuture"]();
  }
}

export function updateTutorialCalendar(tutorialState) {
  //Calendar
  /*
    clickCalendar: false,
    chooseADate: false,
    **calendarUsed: false,
    thirdStepCompleted: false,
  */

  if (tutorialState.finalMessage === false && tutorialState.thirdStepCompleted === true) {
    let nextStep = identifyNextStep(tutorialState);
    updateMenuElements(nextStep);
  } else {
    deactivateElement("data-url");
    deactivateElement("settings-url");
  }

  if (tutorialState.thirdStepCompleted === false) {
    outputTutorialDialogue("chooseADate");
  }
}

export function updateTutorialAnalytics(tutorialState) {
  //Analytics
  /*
    clickAnalytics: false,
    welcomeAnalytics: false,
    craftingYourCustomReport: false,
    dailyBreakdown: false,
    activityFrequency: false,
    timeAllocation: false,
    categoryShare: false,
    weekMonthAndYear: false,
    examineTheData: false,
    **startingAfresh: false,
    reset: false,
    embraceTheInsights: false,
    **finalMessage: false
  */

  deactivateElement("settings-url");

  if (tutorialState.startingAfresh === false && tutorialState.reset === false) {
    document.getElementById("resetButton").classList.add("deactivated-link");
    document.getElementById("resetButton").disabled = true;

    updateCraftingYourCustomReportDialogue(tutorialDialogue);
    outputTutorialDialogue("welcomeAnalytics");
  } else if (tutorialState.startingAfresh === false && tutorialState.reset === true) {
    outputTutorialDialogue("startingAfresh");
  }

  if (tutorialState.examineTheData === false) {
    applyBlinking("seeDetails");
    document.getElementById("seeDetails").addEventListener("click", handleSeeDetailsClick);

    function handleSeeDetailsClick() {
      outputTutorialDialogue("examineTheData");

      document.getElementById("seeDetails").classList.remove("blinking");
      document.getElementById("seeDetails").style.borderColor = "#1b1b1b";

      document.getElementById("seeDetails").removeEventListener("click", handleSeeDetailsClick);
    }
  }

  if (tutorialState.activityFrequency === false || tutorialState.timeAllocation === false || tutorialState.categoryShare === false) {
    document.getElementById("next-chart").classList.add("blinking-no-border");
  }
}

export function closeDialogue() {
  console.log("closeDialogue()");
  const tutorialBlurredOverlay = document.getElementById("tutorial-blurred-overlay");
  const mainHeader = document.getElementById("mainheader-box");
  const dialogueBox = document.getElementById("dialogue-box");
  const progressBar = document.querySelector(".progress-bar-container");
  tutorialBlurredOverlay.style.display = "none";
  mainHeader.style.display = "none";
  dialogueBox.style.display = "none";
  progressBar.style.display = "none";
}

export function showDialogue() {
  console.log("showDialogue()");
  const tutorialBlurredOverlay = document.getElementById("tutorial-blurred-overlay");
  const mainHeader = document.getElementById("mainheader-box");
  const dialogueBox = document.getElementById("dialogue-box");
  const progressBar = document.querySelector(".progress-bar-container");
  const icon = document.getElementById('icon-dialogue');

  tutorialBlurredOverlay.style.display = "block";
  mainHeader.style.display = 'flex';
  mainHeader.style.justifyContent = 'center';
  mainHeader.style.alignItems = 'center';
  dialogueBox.style.display = 'flex';
  dialogueBox.style.flexDirection = 'column';
  progressBar.style.display = "block";
}

export function loopThroughDialogue(dialogue) {
  console.log("loopThroughDialogue()");
  let dialogueLength = dialogue.dialogueArray.length;
  console.log("dialogueLength:", dialogueLength);

  //Note that a different icon is being used for looping through dialogue so that event listeners don't mix
  const icon = document.getElementById("icon-dialogue2");
  icon.style.display = "block";
  const description = document.getElementById('description-box');

  const iconForEndAction = document.getElementById("icon-dialogue");
  iconForEndAction.style.display = "none";

  if (dialogueLength === 1) {

    icon.style.display = "none";

    return;

  } else {
    icon.addEventListener("click", function(event) {
      description.innerHTML = dialogue.dialogueArray[1];

      if (dialogueLength === 2) {

        icon.style.display = "none";
        
        return;

      } else {
        //This didn't work so I'm just keeping every chunk to two parts at most
        icon.addEventListener("click", function(event) {
          description.innerHTML = dialogue.dialogueArray[2];
        })
        
        return;
      }
    })
  }
}

//global variable containing the listeners on the icon-dialogue element
let listenerArray = [];

export function outputTutorialDialogue(tutorialDialogueName) {

  getTutorialState()
    .then((tutorialState) => {
      showDialogue();

      console.log("tutorialState:", tutorialState);
      //console.log("tutorialDialogue:", tutorialDialogue);

      const foundDialogue = tutorialDialogue.find(item => item.name === tutorialDialogueName);
      console.log("foundDialogue:", foundDialogue);
      let dialogueLength = foundDialogue.dialogueArray.length;

      let mainHeader = document.getElementById("mainheader-box");
      let subHeader = document.getElementById("subheader-box");
      let description = document.getElementById("description-box");
      let icon = document.getElementById("icon-dialogue");

      removeAllEventListenersToIcon(listenerArray);

      if (foundDialogue.mainHeader === "") {
        mainHeader.style.display = "none";
      } else {
        mainHeader.innerHTML = foundDialogue.mainHeader;
      }
      subHeader.innerHTML = foundDialogue.subHeader;
      description.innerHTML = foundDialogue.dialogueArray[0];

      loopThroughDialogue(foundDialogue);

      //icon for end action set to block; other icon is set to display: none in loopingThroughDialogue
      icon.style.display = "block";

      tutorialState[tutorialDialogueName] = true;
      saveTutorialState(tutorialState);

      removeAllEventListenersToIcon(listenerArray);
      listenerArray = addIconClickListener();

      function addIconClickListener() {
        const listener = function(event) {
          endAction(foundDialogue);
        }
        icon.addEventListener("click", listener);
    
        let listenerArray = [];
        listenerArray.push(listener);
        return listenerArray;
      }
    
      function removeAllEventListenersToIcon(listenerArray) {
        console.log("removeAllEventListenersToIcon()");
      
        const icon = document.getElementById('icon-dialogue');
    
        listenerArray.forEach(listener => {
          icon.removeEventListener("click", listener);
        });
      }
    
      function endAction(dialogue) {
        dialogue.endAction.forEach(action => {
          if (typeof action === 'string' && action === 'close') {
            closeDialogue();
          } else if (typeof action === 'object' && action.function && action.parameter) {
            const { function: functionName, parameter } = action;
            if (typeof functions[functionName] === 'function') {
              functions[functionName](parameter);
            } else {
              console.error(`Function '${functionName}' is not defined.`);
            } 
          } else if (typeof action === 'object' && action.function && !action.parameter) {
            const { function: functionName } = action;
            if (typeof functions[functionName] === 'function') {
              functions[functionName]();
            } else {
              console.error(`Function '${functionName}' is not defined.`);
            }
          } else if (typeof action === 'string' && action !== 'close') {
            console.log("calling outputTutorialDialogue with ", `${action}`);
            outputTutorialDialogue(`${action}`);
          } else {
            console.error(`Invalid endAction format: ${action}`);
          }
        })
      }
    })
}