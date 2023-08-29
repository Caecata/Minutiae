import Chart from 'chart.js/auto'
import { DateTime } from 'luxon';
import tinycolor from "tinycolor2";

import { checkDeviceWidth, isMobile } from './responsiveness.js'

import { initializeDarkLightMode } from './darklightmode.js'
import { updateClock, handsOfTheClock, modernStyle, noHandsOfTheClock } from './time.js'
import { traditionalClock } from './traditionalclock.js'
import { minimalClock } from './minimalclock.js'
import { modernClock } from './modernclock.js'

import { legendData } from './templates.js'
import { oneStepForm, finalCategoryOption } from './form.js'
import { retrieveData, saveToDatabase, receiveLegendFromDatabase, receiveSettingsFromDatabase, saveLegendToDatabase, getRemoveArray, saveRemoveArray, receiveTagsFromDatabase, saveTagsToDatabase } from './firebase/dbHandler.js'
import { createLog, updateLog } from './log.js'
import { createLegend } from './legend.js'
import { signOutUser } from './firebase/authentication.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//code to determine what "Remaining" slice looks like
var userObject = {
    uniqueId: "123",
    color: "white",
    name: "Remaining"
};

var blankObject = {
    uniqueId: "123",
    color: "white",
    name: "Remaining"
}
let legend = {};
let removeArray = [];
let tags = [];
let settings = {};

//for keeping track of which dateTime is at the center
var current;

//loading screen
const loadingScreen = document.getElementById('loading-screen');

receiveLegendFromDatabase()
    .then((receivedLegend) => {
        /* loadingScreen.innerHTML = "Loading..."; */
        current = settingCurrent();
        console.log("current after settingCurrent 8/24/23:", current);

        settingYesterdayAndTomorrow(isMobile, current);
        //settingYesterdayAndTomorrow(isMobile) (take off isMobile as a parameter to settingCurrent)

        console.log("receivedLegend:", receivedLegend);
        if (receivedLegend !== null) {
            legend = receivedLegend;
        } else {
            legend = legendData;
        }
        receiveTagsFromDatabase()
            .then((receivedTags) => {
                console.log("receivedTags:", receivedTags);
                tags = receivedTags;
                receiveSettingsFromDatabase()
                    .then((receivedSettings) => {
                        settings = receivedSettings;
                        console.log("settings:", settings);
                        if (settings !== null) {
                            oneStepForm(legend, tags);
            
                            if (settings.font !== "default") {
                                const userFont = `${settings.font}, sans-serif`;
                                changeFontFamily(userFont);
                            }

                            if (settings.analogStyle === "traditional") {
                                handsOfTheClock();
                            } else if (settings.analogStyle === "minimal") {
                                noHandsOfTheClock();
                                minimalClock();
                                chartId.data.datasets[0].cutout = "100%";
                            } else if (settings.analogStyle === "modern") {
                                noHandsOfTheClock();
                                const now = new Date();
                                const mins = now.getMinutes();
                                const hour = now.getHours();
                                modernClock(mins, hour);
                                modernStyle();
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
                        } else {
                            //what the user will experience if they do not have any saved settings
                            console.log("user has no saved settings");
                            oneStepForm(legend, tags);
                            handsOfTheClock();
                            traditionalClock();
                        }

                        if (legend !== null) {
                            findRemaining(legend);
                        }

                        getRemoveArray()
                            .then((receivedRemoveArray) => {
                                removeArray = receivedRemoveArray;
                                console.log("current before loadData inside top code:", current);
                                loadData(current)
                                    .then(() => {
                                        traditionalClock(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);
                                        createLog(detailsArray2, current);
                                        createLegend(detailsArray2);

                                        loadingScreen.style.display = "none";
                                    })
                            })
                    })
            })

    })
//related to dark and light mode
function findRemaining(data) {
    for (const x of data) {
        if (x.name === "Remaining") {
            userObject.uniqueId = x.uniqueId;
            userObject.name = x.name;

            blankObject.uniqueId = x.uniqueId;
            blankObject.name = x.name;
            blankObject.color = x.color;
            userObject.color = x.color;

            /* if (x.color === "white" && document.body.classList.contains('light-mode')) {
                blankObject.color = "black";
                userObject.color = "black";
            } else {
                blankObject.color = x.color;
                userObject.color = x.color;
            } */
            console.log("blankObject:", blankObject);
            console.log("userObject:", userObject);
            return userObject, blankObject;
        }
        if (x.children !== undefined) {
            findRemaining(x.children);
        }
    }
}
/* function togglingSlices(pieData, whiteBool, blackBool) {
    for (let i = 0; i < pieData.labelName.length; i++) {
        let item = pieData.labelName[i];
        if (item === "Remaining") {
            if (whiteBool) {
                console.log("turned to white");
                pieData.categoryColors[i] = "white";
            } else if (blackBool) {
                console.log("turned to black");
                pieData.categoryColors[i] = "black";
            }
        }
    }
} */
/* export function toggleRemaining() {
    let turnToWhite = false;
    let turnToBlack = false;
    if (blankObject.color === "white") {
        turnToBlack = true;
        blankObject.color = "black";
    } else if (blankObject.color === "black") {
        turnToWhite = true;
        blankObject.color = "white";
    }

    if (turnToWhite === true || turnToBlack === true) {

        togglingSlices(dressedData.mainChartData.pieData, turnToWhite, turnToBlack);
        togglingSlices(dressedData.leftChartData.pieData, turnToWhite, turnToBlack);
        togglingSlices(dressedData.rightChartData.pieData, turnToWhite, turnToBlack);

        /* if (turnToWhite) {
           chartId.data.datasets[0].borderColor = "white"; //black
           chartId.data.datasets[1].borderColor = "white"; //black
           chartId2.data.datasets[0].borderColor = "white"; //black
           chartId3.data.datasets[0].borderColor = "white"; //black

       } else if (turnToBlack) {
           chartId.data.datasets[0].borderColor = "black";
           chartId.data.datasets[1].borderColor = "black";
           chartId2.data.datasets[0].borderColor = "black";
           chartId3.data.datasets[0].borderColor = "black";
       }  

        updateMainChartDataManually(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.labelName, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);

        updateSideChartDataManually(chartId2, dressedData.leftChartData.pieData.durations, dressedData.leftChartData.pieData.labelName, dressedData.leftChartData.pieData.categoryColors, dressedData.leftChartData.pieData.angles);

        updateSideChartDataManually(chartId3, dressedData.rightChartData.pieData.durations, dressedData.rightChartData.pieData.labelName, dressedData.rightChartData.pieData.categoryColors, dressedData.rightChartData.pieData.angles);

        for (let k = 0; k < detailsArray2.length; k++) {
            if (detailsArray2[k].name === "Remaining") {
                if (turnToWhite) {
                    detailsArray2[k].color = "white";
                } else if (turnToBlack) {
                    detailsArray2[k].color = "black";
                }
            }
        }
    }
} */
//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

let startTimeMin = 0;
let endTimeMin = 1440;
let duration = 1440;

let startTimeArray = [];
let beforeTimeArray = [0, 1440];
let uniqueStartTimeArray = [];

let beforeDetailsArray = [];
var durations = [1440];
var labelName = [];
var categoryColors = [];
var detailsArray = [];
var detailsArray2 = [];
var angles = [0];

var labelNameYesterday = [];
var durationsYesterday = [];
var categoryColorsYesterday = [];
var anglesYesterday = [];
var startTimeArrayYesterday = [];
var beforeTimeArrayYesterday = [];
var detailsArray2Yesterday = [];

var labelNameTomorrow = [];
var durationsTomorrow = [];
var categoryColorsTomorrow = [];
var anglesTomorrow = [];
var startTimeArrayTomorrow = [];
var beforeTimeArrayTomorrow = [];
var detailsArray2Tomorrow = [];

var key;
var yesterdayKey;
var tomorrowKey;

var selectedCategory;
var selectedSubcategory;
var selectedLocation;
var description;

var dates = {};

var dressedData = {
    mainChartData: {
        pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
        reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
    }, leftChartData: {
        pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
        reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
    }, rightChartData: {
        pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
        reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
    }
};

console.log("dressedData:", dressedData);

var pieOptions = {
    animation: {
        duration: 0
    },
    rotation: angles,
    responsive: false,
    plugins: {
        legend: {
            display: false
        }
    }
};

var pieOptionsYesterday = {
    animation: {
        duration: 0
    },
    rotation: anglesYesterday,
    responsive: false,
    plugins: {
        legend: {
            display: false
        }
    }
};

var pieOptionsTomorrow = {
    animation: {
        duration: 0
    },
    rotation: anglesTomorrow,
    responsive: false,
    plugins: {
        legend: {
            display: false
        }
    }
};

var chrt = document.getElementById("chartId").getContext("2d");
var chartId = new Chart(chrt, {
    type: 'pie',
    data: {
        /* labels: labelName, */
        datasets: [
        /*{
            type: 'doughnut',
            data: durations,
            backgroundColor: categoryColors, //categoryColors,
            hoverOffset: 5,
            borderColor: "black",
            borderWidth: 1, //consider between 0, 1, or 2 

            cutout: '90%' //sets the size of the doughnut  //60%
        }, */
        { 
            type: 'pie',
            //label: "online tutorial subjects",
            data: durations,
            backgroundColor: categoryColors,
            hoverOffset: 5,
            borderColor: "black",
            borderWidth: 0,

            //default is set for mobile device here
            radius: '90%'//sets the size of the pie chart //100% //90%
        }
        ],
    },
    options: pieOptions,
});

var chrt2 = document.getElementById("chartLeft").getContext("2d");
var chartId2 = new Chart(chrt2, {
    type: 'pie',
    data: {
        labels: labelNameYesterday,
        datasets: [{
            type: 'pie',
            //label: "online tutorial subjects",
            data: durationsYesterday,
            backgroundColor: categoryColorsYesterday,
            hoverOffset: 5,
            borderColor: "black",
            borderWidth: 1,


            radius: '100%' //sets the size of the doughnut 
        }],
    },
    options: pieOptionsYesterday,
});
var chrt3 = document.getElementById("chartRight").getContext("2d");
var chartId3 = new Chart(chrt3, {
    type: 'pie',
    data: {
        labels: labelNameTomorrow,
        datasets: [{
            type: 'pie',
            //label: "online tutorial subjects",
            data: durationsTomorrow,
            backgroundColor: categoryColorsTomorrow,
            hoverOffset: 5,
            borderColor: "black",
            borderWidth: 1,


            radius: '100%' //sets the size of the doughnut 
        }],
    },
    options: pieOptionsTomorrow,
});

//settingCurrent();

var parsedData;

async function loadData(current) {

    parsedData = await retrieveData(current);
    console.log('parsedData', parsedData);

    compareReceivedDataToDatabase(parsedData, current);

    console.log("parsedData after compareReceivedDataToLegend:", parsedData);

    dressedData = turnStoredDataToVariables(parsedData);

    console.log("dressedData:", dressedData);

    //if light-mode is set as the default, toggle remaining slices that are white from the database to black
    /* if (document.body.classList.contains('light-mode')) {
        togglingSlices(dressedData.leftChartData.pieData, false, true);
        togglingSlices(dressedData.rightChartData.pieData, false, true);
        togglingSlices(dressedData.mainChartData.pieData, false, true);
    } */

    updateMainChartDataManually(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.labelName, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);

    updateSideChartDataManually(chartId2, dressedData.leftChartData.pieData.durations, dressedData.leftChartData.pieData.labelName, dressedData.leftChartData.pieData.categoryColors, dressedData.leftChartData.pieData.angles);

    updateSideChartDataManually(chartId3, dressedData.rightChartData.pieData.durations, dressedData.rightChartData.pieData.labelName, dressedData.rightChartData.pieData.categoryColors, dressedData.rightChartData.pieData.angles);

    detailsArray2 = dressedData.mainChartData.reiterateData.detailsArray2;
    beforeTimeArray = dressedData.mainChartData.reiterateData.beforeTimeArray;
    console.log("detailsArray2 and beforeTimeArray:", detailsArray2, beforeTimeArray);
}
//functions for checking pie slices against legend and tags
function findDataPointInRemove(data, targetUniqueId) {
    console.log("findDataPointInRemove()");
    for (let j = 0; j < data.length; j++) {
        if (data[j].uniqueId === targetUniqueId) {
            data[j].instances -= 1;
            console.log("instances in ", data[j], " decremented by 1");
            if (data[j].instances === 0) {
                data.splice(j, 1);
                console.log("instances hit 0 so removed it from removeArray");
                return;
            }
        }
        if (data[j].children !== undefined) {
            findDataPointInRemove(data[j].children, targetUniqueId);
        }
    }
    console.log("removeArray at the end of findDataPointInRemove:", data);
}
function findDataPointToCheckAgainstLegend(data, targetUniqueId) {
    for (const x of data) {
        if (x.uniqueId === targetUniqueId) {
            //console.log("dataPoint found:", x);
            return x;
        }
        if (x.children !== undefined) {
            const dataPoint = findDataPointToCheckAgainstLegend(x.children, targetUniqueId);
            if (dataPoint !== undefined) {
                return dataPoint;
            }
        }
    }
    return undefined;
}
function checkAgainstDatabase(data, removeArray, date) {
    console.log("checkAgainstDatabase()");
    let changesMade = false; //a bool that becomes true when changes to slices are made, thereby requiring a save at the end of this function
    if (data !== null) {
        for (let i = 0; i < data.data.detailsArray.length; i++) {
            const targetUniqueId = data.data.detailsArray[i].uniqueId;
            const slice = data.data.detailsArray[i];
            console.log("slice being checked in: ", slice);
            //checking each slice to the legend's
            const dataPoint = findDataPointToCheckAgainstLegend(legend, targetUniqueId);
            if (dataPoint !== undefined) {
                console.log("dataPoint found so checking if properties match", dataPoint);
                if (dataPoint.color !== data.data.detailsArray[i].color) {
                    console.log("colors mismatch, therefore changing color of slice to legend's");
                    data.data.detailsArray[i].color = dataPoint.color;
                    changesMade = true;
                }
                if (dataPoint.name !== data.data.detailsArray[i].name) {
                    console.log("names mismatch, therefore changing name of slice to legend's");
                    data.data.detailsArray[i].name = dataPoint.name;
                    changesMade = true;
                }
            } else {
                console.log("dataPoint was not found so turning slice to remaining");
                data.data.detailsArray[i].color = blankObject.color;
                data.data.detailsArray[i].name = blankObject.name;
                data.data.detailsArray[i].uniqueId = blankObject.uniqueId;
                changesMade = true;
                findDataPointInRemove(removeArray, targetUniqueId);
            }
            //checking if there is a "tags" property and if there is, check if tags are still existing. if not, delete
            if (slice.tags !== undefined) {
                console.log('slice contains a tags property; checking if tag(s) exists');
                for (let k = 0; k < slice.tags.length; k++) {
                    let sliceTagUid = slice.tags[k].uniqueId;
                    const dataPointForTag = findDataPointToCheckAgainstLegend(tags, sliceTagUid);
                    if (dataPointForTag !== undefined) {
                        console.log("tag exists");
                        if (dataPointForTag.tagName !== slice.tags[k].tagName) {
                            console.log("renaming of tag occurred");
                            slice.tags[k].tagName = dataPointForTag.tagName;
                            changesMade = true;
                        }
                    }
                    else {
                        console.log("tag does not exist anymore; therefore removing tag from slice");
                        slice.tags.splice(k, 1);
                        console.log('slice:', slice);
                        findDataPointInRemove(removeArray, sliceTagUid);
                        changesMade = true;
                    }
                }
            }
        }
    } else {
        console.log("data was undefined so data left untouched");
    }
    if (changesMade) {
        saveToDatabase(data.data.detailsArray, date);
        //recently added to both app.js and data.js (I think there should be a save to legend and tags if changes are made to them)
        saveLegendToDatabase(legend);
        saveTagsToDatabase(tags);
    }
    console.log("data after saving:", data);
}
function compareReceivedDataToDatabase(parsedData, current) {
    console.log("compareReceivedDataToDatabase()");
    checkAgainstDatabase(parsedData.parsedToday, removeArray, current);
    console.log("parsedData.parsedToday after function:", parsedData.parsedToday);
    let yesterday = current.minus({ days: 1 });
    checkAgainstDatabase(parsedData.parsedYesterday, removeArray, yesterday);
    console.log("parsedData.parsedYesterday after function:", parsedData.parsedYesterday);
    let tomorrow = current.plus({ days: 1 });
    checkAgainstDatabase(parsedData.parsedTomorrow, removeArray, tomorrow);
    console.log("parsedData.parsedTomorrow after function:", parsedData.parsedTomorrow);
    console.log("removeArray:", removeArray);
    saveRemoveArray(removeArray);
}

//loads blank pies before the database finishes loading

updateMainChartDataManually(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.labelName, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);

updateSideChartDataManually(chartId2, dressedData.leftChartData.pieData.durations, dressedData.leftChartData.pieData.labelName, dressedData.leftChartData.pieData.categoryColors, dressedData.leftChartData.pieData.angles);

updateSideChartDataManually(chartId3, dressedData.rightChartData.pieData.durations, dressedData.rightChartData.pieData.labelName, dressedData.rightChartData.pieData.categoryColors, dressedData.rightChartData.pieData.angles);

detailsArray2 = dressedData.mainChartData.reiterateData.detailsArray2;
beforeTimeArray = dressedData.mainChartData.reiterateData.beforeTimeArray;

console.log("detailsArray2 and beforeTimeArray:", detailsArray2, beforeTimeArray);

//multi-step form - going to DEPRECATE
/* const submitButton = document.getElementById("submit-time-inputs");
submitButton.addEventListener("click", function (event) {
    console.log("multi-step form submit btn");

    event.preventDefault();

    //EXTRACTING DATA FROM USER
    console.log("finalCategoryOption:", finalCategoryOption);

    const startTimeInput = document.getElementById("start-time-input");
    const startTimeValue = startTimeInput.value;
    const startTime = new Date(`1970-01-01T${startTimeValue}:00`);
    startTimeMin = startTime.getHours() * 60 + startTime.getMinutes();

    const endTimeInput = document.getElementById("end-time-input");
    const endTimeValue = endTimeInput.value;
    const endTime = new Date(`1970-01-01T${endTimeValue}:00`);
    endTimeMin = endTime.getHours() * 60 + endTime.getMinutes();

    const tagsElement = document.querySelectorAll('input[name="tag"]:checked');
    let tagsArray = [];

    if (tagsElement.length > 0) {
        for (let i = 0; i < tagsElement.length; i++) {
            let temp = JSON.parse(tagsElement[i].value);
            let tempObj = {
                tagName: temp.tagName,
                uniqueId: temp.uniqueId
            };
            tagsArray.push(tempObj);
        }
    }
    
    const descriptionElement = document.getElementById("description-input-field");
    const description = descriptionElement ? descriptionElement.value : "";
    console.log("description:", description);

    beforeDetailsArray = detailsArray2.slice();
    console.log("beforedetailsArray in Add:", beforeDetailsArray);

    if (endTimeMin < startTimeMin) {
        endTimeMin += 1440;
    }
    if (endTimeMin == startTimeMin) {
        endTimeMin = 1440;
    }
    duration = endTimeMin - startTimeMin;

    userObject = {
        uniqueId: finalCategoryOption.uniqueId,
        name: finalCategoryOption.name,
        color: finalCategoryOption.color
    };

    userObject.tags = tagsArray;

    if (description) {
        userObject.description = description;
    }

    angles = [0];
    console.log("userObject:", userObject);
    console.log("beforeDetailsArray:", beforeDetailsArray);
    updateChartData(startTimeMin, endTimeMin, duration, userObject, legend);
}); */

//one-step form
const submitBtn = document.getElementById("submit-inputs");
submitBtn.addEventListener("click", function (event) {
    console.log("submit button for one-step form");

    event.preventDefault();

    //EXTRACTING DATA FROM USER
    const obj = JSON.parse(document.querySelector("#one-step-dropdown").value);

    const startTimeInput = document.getElementById("start-time-input-for-one-step-form");
    const startTimeValue = startTimeInput.value;
    const startTime = new Date(`1970-01-01T${startTimeValue}:00`);
    startTimeMin = startTime.getHours() * 60 + startTime.getMinutes();

    const endTimeInput = document.getElementById("end-time-input-for-one-step-form");
    const endTimeValue = endTimeInput.value;
    const endTime = new Date(`1970-01-01T${endTimeValue}:00`);
    endTimeMin = endTime.getHours() * 60 + endTime.getMinutes();

    const tagsElement = document.querySelectorAll('input[name="tag"]:checked');

    let tagsArray = [];

    if (tagsElement.length > 0) {
        for (let i = 0; i < tagsElement.length; i++) {
            let temp = JSON.parse(tagsElement[i].value);
            let tempObj = {
                tagName: temp.tagName,
                uniqueId: temp.uniqueId
            };
            tagsArray.push(tempObj);
        }
    }

    const descriptionElement = document.getElementById("description-input-field");
    const description = descriptionElement ? descriptionElement.value : "";

    beforeDetailsArray = detailsArray2.slice();
    console.log("beforedetailsArray in Add:", beforeDetailsArray);

    if (endTimeMin < startTimeMin) {
        endTimeMin += 1440;
    }
    if (endTimeMin == startTimeMin) {
        endTimeMin = 1440;
    }
    duration = endTimeMin - startTimeMin;

    userObject = {
        uniqueId: obj.uniqueId,
        name: obj.name,
        color: obj.color
    };

    userObject.tags = tagsArray;

    if (description) {
        userObject.description = description;
    }

    console.log('userObject:', userObject);

    angles = [0];
    updateChartData(startTimeMin, endTimeMin, duration, userObject, legend);
})

function updateChartData(startTimeMin, endTimeMin, duration, userObject, legend) {
    userObject ??= blankObject;

    startTimeMin ??= 0;
    if (endTimeMin == undefined) {
        endTimeMin = 1440;
    }
    if (duration == undefined) {
        duration = 1440;
    }

    console.log("startTimeMin:", startTimeMin);
    console.log("endTimeMin:", endTimeMin);
    console.log("duration:", duration);

    console.log("startTimeArray before reset:", startTimeArray);
    uniqueStartTimeArray = beforeTimeArray.concat(startTimeMin, endTimeMin);
    uniqueStartTimeArray = [... new Set(uniqueStartTimeArray)];
    uniqueStartTimeArray.sort((a, b) => a - b);
    console.log("uniqueStartTimeArray:", uniqueStartTimeArray);
    startTimeArray = [];

    var switchCase;
    var remove = [];
    var count = 0;
    var switchCaseDetermined = false;
    //var firstCase = false; what was this for? 
    if (startTimeMin === 0 && endTimeMin === 1440) {
        firstCase = true;
    }

    for (const num of uniqueStartTimeArray) {
        console.log("num:", num);

        if (num === startTimeMin) {
            for (let i = 0; i < beforeTimeArray.length; i++) {
                let before = beforeTimeArray[i];
                let next = beforeTimeArray[i + 1];
                let nextNext = beforeTimeArray[i + 2];
                //console.log("beforeTimeArray in for:", beforeTimeArray);

                if (next !== undefined) {
                    if (startTimeMin > before && startTimeMin < next && endTimeMin > before && endTimeMin < next) {
                        switchCase = "inside";
                        console.log("switchCase:", switchCase);
                    }
                    if (beforeTimeArray.includes(startTimeMin) && beforeTimeArray.includes(endTimeMin) && count === 0) {
                        switchCase = "fillComplete";
                        console.log("fillComplete is true");
                        switchCaseDetermined = true;
                    }
                    console.log("before, startTimeMin, next, endTimeMin, nextNext:", before, startTimeMin, next, endTimeMin, nextNext);
                    if (before > startTimeMin && before < endTimeMin) {
                        count++;
                        remove.push(before);
                        console.log("value removed:", before);
                        console.log("# of points in between:", count);
                    }
                    if ((startTimeMin == before && endTimeMin < next) || (startTimeMin > before && endTimeMin == next)) {
                        switchCase = "partialBoth";
                        console.log("switchCase:", switchCase);
                    }
                    if (next !== undefined && nextNext !== undefined) {
                        if (startTimeMin > before && startTimeMin < next && endTimeMin > next && endTimeMin < nextNext) {
                            switchCase = "partialBoth";
                            console.log("switchCase:", switchCase);
                        }
                        if ((startTimeMin == before && startTimeMin < next && endTimeMin > next && endTimeMin < nextNext) || (startTimeMin > before && startTimeMin < next && endTimeMin > next && endTimeMin == nextNext)) {
                            switchCase = "onePointFive";
                            console.log("switchCase:", switchCase);
                            switchCaseDetermined = true;
                        }
                    }
                    if (before > startTimeMin && before < endTimeMin && next > startTimeMin && next < endTimeMin && switchCaseDetermined !== true) {
                        switchCase = "complete";
                        console.log("switchCase:", switchCase);
                        switchCaseDetermined = true;
                    }
                }
            }
        }
        if (remove.includes(num)) {
        } else {
            startTimeArray.push(num);
        }
        console.log("startTimeArray in progress:", startTimeArray);
    }

    createDurations(startTimeArray);

    let k = startTimeArray.indexOf(startTimeMin);
    //console.log("detailsArray2 before switch:", detailsArray2);
    //console.log("categoryLegendIndex:", categoryLegendIndex);
    console.log("values of beforedetailsArray and k before switch", beforeDetailsArray, ", ", k);
    console.log("detailsArray2:", detailsArray2);

    switch (switchCase) {
        case "inside":
            console.log("inside switchCase");
            detailsArray2.splice(k - 1, 1, beforeDetailsArray[k - 1], userObject, beforeDetailsArray[k - 1]);
            updateInstances(beforeDetailsArray[k - 1], 1);
            updateInstances(userObject, 1);
            //console.log("detailsArray2:", detailsArray2);
            break;
        case "onePointFive":
            console.log("onePointFive switchCase");
            detailsArray2.splice(k, 1, userObject);
            switchCaseDetermined = false;
            updateInstances(userObject, 1);
            updateInstances(beforeDetailsArray[k], -1);
            //console.log("detailsArray2:", detailsArray2);
            break;
        case "partialBoth":
            console.log("partialBoth switchCase");
            detailsArray2.splice(k, 0, userObject);
            updateInstances(userObject, 1);
            //console.log("detailsArray2:", detailsArray2);
            break;
        case "complete":
            console.log("complete switchCase");
            console.log("count:", count);
            if (beforeTimeArray.includes(startTimeMin) && !beforeTimeArray.includes(endTimeMin)) {
                console.log("if beforeTimeArray.includes(startTimeMin)");
                detailsArray2.splice(k, count, userObject);

                for (let i = 0; i < count; i++) {
                    updateInstances(beforeDetailsArray[k + i], -1);
                }
                updateInstances(userObject, 1);

            } else if (beforeTimeArray.includes(endTimeMin) && !beforeTimeArray.includes(startTimeMin)) {
                console.log("if beforeTimeArray.includes(endTimeMin)");
                detailsArray2.splice(k, count, userObject);

                for (let i = 0; i < count; i++) {
                    updateInstances(beforeDetailsArray[k + i], -1);
                }
                updateInstances(userObject, 1);

            } else {
                detailsArray2.splice(k, count - 1, userObject);
                console.log("else complete switchCase");

                for (let i = 0; i < count - 1; i++) {
                    updateInstances(beforeDetailsArray[k + i], -1);
                }
                updateInstances(userObject, 1);
            }
            //console.log("detailsArray2:", detailsArray2);
            break;
        case "fillComplete":
            console.log("fillComplete switchCase");
            detailsArray2.splice(k, count + 1, userObject);
            for (let i = 0; i < count + 1; i++) {
                updateInstances(beforeDetailsArray[k + i], -1);
            }
            updateInstances(userObject, 1);
            break;
        default:
            console.log("default switchCase");
            detailsArray2.push(userObject);
            break;
    }

    beforeTimeArray = startTimeArray.slice();
    //console.log("beforeTimeArray:", beforeTimeArray);

    console.log("detailsArray2 before splice:", detailsArray2);
    console.log("detailsArray before splice:", detailsArray);

    appendDurationsAndStartTimes(startTimeArray, durations, detailsArray2);

    detailsArray.splice(0, detailsArray.length, ...detailsArray2);

    //SAVING THE DATA 
    //console.log("current in updateChartData:", current);
    console.log("detailsArray being passed into saveToDatabase:", detailsArray);
    updateLog(detailsArray2, current);

    const userId = window.localStorage.getItem("minutiaeUid");

    if (userId !== "null") {
        saveToDatabase(detailsArray, current);
        saveLegendToDatabase(legend);
        saveTagsToDatabase(tags);
    } 

    angles = checkToCombineRemaining(durations, detailsArray, angles, startTimeArray);

    convertIndexToLegend(detailsArray, categoryColors, labelName);

    console.log("durations:", durations);
    console.log("labelName:", labelName);
    console.log("categoryColors:", categoryColors);

    chartId.data.datasets[0].data = durations;
    chartId.data.labels = labelName;
    chartId.data.datasets[0].backgroundColor = categoryColors;
    chartId.options.rotation = angles;

    //chartId.data.datasets[1].data = durations;
    //chartId.data.datasets[1].backgroundColor = categoryColors;

    chartId.update();
    traditionalClock(durations, categoryColors, angles);
    createLegend(detailsArray2);
    closeAllForms();
}

//close all forms when new slice is submitted
function closeAllForms() {
    document.getElementById("log").style.display = "none";
    document.getElementById("one-step-form").style.display = "none";
    document.getElementById("blurred-overlay").style.display = "none";
    document.getElementById("view-log").style.display = "block";
    document.getElementById("add-slice-button").style.display = "block";
}

function updateInstances(obj, delta) {
    const targetUniqueId = obj.uniqueId;
    if (obj.tags) {
        for (let i = 0; i < obj.tags.length; i++) {
            let tagUid = obj.tags[i].uniqueId;
            findDataPoint(tags, tagUid, delta);
        }
    }
    findDataPoint(legend, targetUniqueId, delta);
}

function findDataPoint(data, targetUniqueId, delta) {
    for (const x of data) {
        if (x.uniqueId === targetUniqueId) {
            if (x.instances === undefined) {
                console.log("instances is undefined");
                x.instances = delta;
            } else {
                x.instances += delta;
                console.log("instances exists")
            }
        }
        if (x.children !== undefined) {
            findDataPoint(x.children, targetUniqueId, delta);
        }
    }
}

function createDurations(startTimeArray) {
    durations = [];
    for (let i = 0; i < startTimeArray.length - 1; i++) {
        let second = startTimeArray[i + 1];
        let first = startTimeArray[i];
        durations.push(second - first);
        //console.log("durations pushed:", durations);
    }
}

function checkToCombineRemaining(array1, array2, array3, array4) {
    //if (array2[0].index == 5 && array2[array2.length - 1].index == 5 && array2.length >= 3) {
    if (array2[0].name === "Remaining" && array2[array2.length - 1].name === "Remaining" && array2.length >= 3) {
        array1[array1.length - 1] += array1[0];
        array1.splice(0, 1);
        array2.splice(0, 1);
        array3 = [(array4[1] / 1440) * 360];
    }
    return array3;
}

function convertIndexToLegend(detailsArray, categoryColors, labelName) { //detailsArray, categoryColors, labelName
    categoryColors.length = 0;
    labelName.length = 0;
    categoryColors.push(...detailsArray.map(obj => obj.color));
    labelName.push(...detailsArray.map(obj => obj.name));

    //categoryColors.push(...detailsArray.map(obj => legend[obj.index].color));
    //labelName.push(...detailsArray.map(obj => legend[obj.index].name));
}

function appendDurationsAndStartTimes(startTimeArray, durations, detailsArray) {

    console.log("startTimeArray, durations, and detailsArray BEFORE:", startTimeArray, durations, detailsArray);

    for (let i = 0; i < detailsArray.length; i++) {
        //const newDetailObj = detailsArray[i];
        const newDetailObj = { ...detailsArray[i] }
        newDetailObj.start = startTimeArray[i];
        newDetailObj.duration = durations[i];
        detailsArray[i] = newDetailObj;
    }
}

//experiment to put the drag event listeners on the outside of this function to make them exportable and accessible to other js files\
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const dateElement = document.getElementById('date');
    var dayElement = document.getElementById("dayOfWeek");

    const difference = touchEndX - touchStartX;
    const swipeThreshold = 50; // Adjust this value to control the swipe sensitivity

    if (difference > swipeThreshold) {
        // Swiped right (go back one day)
        // Add slide-out-right class to the elements
        document.getElementById('chartId').classList.add('slide-out-right');
        document.getElementById('clock-face').classList.add('slide-out-right');
        document.getElementById('canvas-modern').classList.add('slide-out-right');
        document.getElementById('canvas-minimal').classList.add('slide-out-right');
        document.getElementById('canvas-traditional').classList.add('slide-out-right');  

        var yesterday = current.minus({ days: 1 });
        current = yesterday;
        var formattedDate = yesterday.toFormat('M/d/yy');
        dateElement.innerHTML = formattedDate;
        var dayOfWeekName = current.weekdayLong;
        dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
        dayElement.innerHTML = dayOfWeekName;
        loadData(current).then(() => {
            traditionalClock(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);

            // Remove slide-out-right class and add slide-in-left class after loading data
            document.getElementById('chartId').classList.remove('slide-out-right');
            document.getElementById('clock-face').classList.remove('slide-out-right');
            document.getElementById('canvas-modern').classList.remove('slide-out-right');
            document.getElementById('canvas-minimal').classList.remove('slide-out-right');
            document.getElementById('canvas-traditional').classList.remove('slide-out-right');

            // Add slide-in-left class
            document.getElementById('chartId').classList.add('slide-in-left');
            document.getElementById('clock-face').classList.add('slide-in-left');
            document.getElementById('canvas-modern').classList.add('slide-in-left');
            document.getElementById('canvas-minimal').classList.add('slide-in-left');
            document.getElementById('canvas-traditional').classList.add('slide-in-left');

            updateLog(detailsArray2, current);
            createLegend(detailsArray2);
            // Remove slide-in-left class after animation completes
            setTimeout(() => {
                document.getElementById('chartId').classList.remove('slide-in-left');
                document.getElementById('clock-face').classList.remove('slide-in-left');
                document.getElementById('canvas-modern').classList.remove('slide-in-left');
                document.getElementById('canvas-minimal').classList.remove('slide-in-left');
                document.getElementById('canvas-traditional').classList.remove('slide-in-left');
            }, 500); // Adjust the time to match the animation duration

        });
    } else if (difference < -swipeThreshold) {
        // Swiped left (go forward one day)
        // Add slide-out-left class to the elements
        document.getElementById('chartId').classList.add('slide-out-left');
        document.getElementById('clock-face').classList.add('slide-out-left');
        document.getElementById('canvas-modern').classList.add('slide-out-left');
        document.getElementById('canvas-minimal').classList.add('slide-out-left');
        document.getElementById('canvas-traditional').classList.add('slide-out-left');

        var tomorrow = current.plus({ days: 1 });
        current = tomorrow;
        formattedDate = tomorrow.toFormat('M/d/yy');
        dateElement.innerHTML = formattedDate;
        var dayOfWeekName = current.weekdayLong;
        dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
        dayElement.innerHTML = dayOfWeekName;
        loadData(current).then(() => {
            traditionalClock(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);

            // Remove slide-out-left class and add slide-in-right class after loading data
            document.getElementById('chartId').classList.remove('slide-out-left');
            document.getElementById('clock-face').classList.remove('slide-out-left');
            document.getElementById('canvas-modern').classList.remove('slide-out-left');
            document.getElementById('canvas-minimal').classList.remove('slide-out-left');
            document.getElementById('canvas-traditional').classList.remove('slide-out-left');

            // Add slide-in-right class
            document.getElementById('chartId').classList.add('slide-in-right');
            document.getElementById('clock-face').classList.add('slide-in-right');
            document.getElementById('canvas-modern').classList.add('slide-in-right');
            document.getElementById('canvas-minimal').classList.add('slide-in-right');
            document.getElementById('canvas-traditional').classList.add('slide-in-right');

            updateLog(detailsArray2, current);
            createLegend(detailsArray2);

            // Remove slide-in-right class after animation completes
            setTimeout(() => {
                document.getElementById('chartId').classList.remove('slide-in-right');
                document.getElementById('clock-face').classList.remove('slide-in-right');
                document.getElementById('canvas-modern').classList.remove('slide-in-right');
                document.getElementById('canvas-minimal').classList.remove('slide-in-right');
                document.getElementById('canvas-traditional').classList.remove('slide-in-right');
            }, 500); // Adjust the time to match the animation duration
        });
    }
}

export function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

export function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
}

export function disableSwipeOnApp() {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
}

export function enableSwipeOnApp() {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
}

function settingCurrent() {
    var dateElement = document.getElementById("date");
    var dayElement = document.getElementById("dayOfWeek");
    var longDateElement = document.getElementById("long-date-day");

    let urlParams = new URLSearchParams(window.location.search);
    let dateParam = urlParams.get('date');

    if (dateParam) {
        var now = DateTime.fromISO(dateParam);

        //sets the date parameter to null so that the calendar gives a one-time-pass to a specified date
        history.replaceState(null, '', 'app.html');

        var formattedDate = now.toFormat('M/d/yy');
        dateElement.innerHTML = formattedDate;

        var dayOfWeekName = now.weekdayLong;
        dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
        dayElement.innerHTML = dayOfWeekName;

        var longFormattedDate = now.toFormat('MMMM d yyyy, EEEE');
        longDateElement.innerHTML = longFormattedDate;

    } else {
        var now = DateTime.local();
        var today = now.toISODate();

        var formattedDate = now.toFormat('M/d/yy');
        dateElement.innerHTML = formattedDate;

        var dayOfWeekName = now.weekdayLong;
        dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
        dayElement.innerHTML = dayOfWeekName;

        var longFormattedDate = now.toFormat('MMMM d yyyy, EEEE');
        longDateElement.innerHTML = longFormattedDate;
    }
    /* var yesterday;
    var tomorrow; */

    current = now;
    console.log("current in settingCurrent:", current);

    return current;
    //put an end to this function to start a new one
}

function settingYesterdayAndTomorrow(swipeEffect, current) {
    console.log("current in settingYesterdayAndTomorrow:", current);

    var yesterday;
    var tomorrow;

    handleSwipeEffect(swipeEffect, current);

    function handleSwipeEffect(swipeEffect, current) {
        const goBackOneDayBtn = document.getElementById('day-back');
        const goForwardOneDayBtn = document.getElementById('day-forward');
        const dateElement = document.getElementById('date');
        var dayElement = document.getElementById("dayOfWeek");
        var longDateElement = document.getElementById("long-date-day");

        if (swipeEffect) {
            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchend', handleTouchEnd);
        } else {
            goBackOneDayBtn.addEventListener("click", function (event) {
                event.preventDefault();
                yesterday = current.minus({ days: 1 });
                current = yesterday;
                var formattedDate = yesterday.toFormat('M/d/yy');
                dateElement.innerHTML = formattedDate;
                var dayOfWeekName = current.weekdayLong;
                dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
                dayElement.innerHTML = dayOfWeekName;
                var longFormattedDate = current.toFormat('MMMM d yyyy, EEEE');
                longDateElement.innerHTML = longFormattedDate;

                console.log("current after changing value:", current);

                loadData(current)
                    .then(() => {
                        traditionalClock(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);
                        updateLog(detailsArray2, current);
                        createLegend(detailsArray2);
                    })

            });

            goForwardOneDayBtn.addEventListener("click", function (event) {
                event.preventDefault();
                tomorrow = current.plus({ days: 1 });
                current = tomorrow;
                var formattedDate = tomorrow.toFormat('M/d/yy');
                dateElement.innerHTML = formattedDate;
                var dayOfWeekName = current.weekdayLong;
                dayOfWeekName = dayOfWeekName.substr(0, 1).toUpperCase() + dayOfWeekName.substr(1);
                dayElement.innerHTML = dayOfWeekName;
                var longFormattedDate = current.toFormat('MMMM d yyyy, EEEE');
                longDateElement.innerHTML = longFormattedDate;

                console.log("current after changing value:", current);

                loadData(current)
                    .then(() => {
                        console.log("loadData is done");
                        console.log("dressedData:", dressedData);
                        traditionalClock(dressedData.mainChartData.pieData.durations, dressedData.mainChartData.pieData.categoryColors, dressedData.mainChartData.pieData.angles);
                        updateLog(detailsArray2, current);
                        createLegend(detailsArray2);
                    })

                //console.log("detailsArray2 and beforeTimeArray:", detailsArray2, beforeTimeArray)
            });
        }
    }
}

function turnStoredDataToVariables() {
    console.log(parsedData)
    var mainChartData = {};
    var leftChartData = {};
    var rightChartData = {};
    var pieData = {};
    var reiterateData = {};

    if (parsedData.parsedToday == undefined) {
        mainChartData = {
            pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
            reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
        };
    } else {
        mainChartData = createVariables(parsedData.parsedToday.data.detailsArray, durations, startTimeArray, detailsArray2, angles, beforeTimeArray, labelName, categoryColors);
    }
    if (parsedData.parsedYesterday == undefined) {
        leftChartData = {
            pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
            reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
        };
    } else {
        leftChartData = createVariables(parsedData.parsedYesterday.data.detailsArray, durationsYesterday, startTimeArrayYesterday, detailsArray2Yesterday, anglesYesterday, beforeTimeArrayYesterday, labelNameYesterday, categoryColorsYesterday);
    };
    if (parsedData.parsedTomorrow == undefined) {
        rightChartData = {
            pieData: { durations: [1440], labelName: ["Remaining"], categoryColors: [`${blankObject.color}`], angles: [0] },
            reiterateData: { detailsArray2: [blankObject], beforeTimeArray: [0, 1440], angles: [0] }
        };
    } else {
        rightChartData = createVariables(parsedData.parsedTomorrow.data.detailsArray, durationsTomorrow, startTimeArrayTomorrow, detailsArray2Tomorrow, anglesTomorrow, beforeTimeArrayTomorrow, labelNameTomorrow, categoryColorsTomorrow);
    }
    var dressedData = { mainChartData, leftChartData, rightChartData };
    return dressedData;
}

function createVariables(parsedData, durations, startTimeArray, detailsArray2, angles, beforeTimeArray, labelName, categoryColors) {
    //console.log("parsedData:", parsedData);
    detailsArray2 = parsedData.slice();
    detailsArray = parsedData.slice();

    durations = parsedData.map(obj => obj.duration);
    startTimeArray = parsedData.map(obj => obj.start);
    angles = [0];
    angles = checkToCombineRemaining(durations, detailsArray, angles, startTimeArray);

    const minValue = Math.min(...startTimeArray);
    const calculatedValue = minValue + 1440;
    startTimeArray.push(calculatedValue);
    beforeTimeArray = startTimeArray.slice();

    convertIndexToLegend(detailsArray, categoryColors, labelName);
    var pieData = { durations, labelName, categoryColors, angles };
    angles = [0];
    var reiterateData = { detailsArray2, beforeTimeArray, angles };
    return { pieData, reiterateData };
}

function adjustBrightness(color, brightness) {
    /* const adjustedColor = tinycolor(color).brighten(brightness * 100).toString();
    return adjustedColor; */
    const adjustedColor = brightness >= 0
        ? tinycolor(color).brighten(brightness * 100).toString()
        : tinycolor(color).darken(Math.abs(brightness) * 100).toString();
    return adjustedColor;
}

function adjustBrightnessArray(colors, brightness) {
    console.log("colors:", colors);
    return colors.map(color => adjustBrightness(color, brightness));
}


function updateMainChartDataManually(durations, labelName, categoryColors, angles) {

    let adjustedColors = adjustBrightnessArray(categoryColors, 0); // -0.2
    console.log("adjustedColors:", adjustedColors);

    chartId.data.datasets[0].data = durations;
    chartId.data.labels = labelName;
    chartId.data.datasets[0].backgroundColor = adjustedColors;
    chartId.options.rotation = angles; //[0]

    //chartId.data.datasets[1].data = durations;
    //chartId.data.datasets[1].backgroundColor = categoryColors;

    if (durations.length === 1) {
        chartId.data.datasets[0].borderWidth = 0;
        //chartId.data.datasets[1].borderWidth = 0;
    } else {
        chartId.data.datasets[0].borderWidth = 0;
        //chartId.data.datasets[1].borderWidth = 1;
    }

    if (isMobile) {
        //keep radius at 90%;
    } else {
        chartId.data.datasets[0].radius = "70%";
    }
    chartId.update();
}

function updateSideChartDataManually(chartId, durations, labelName, categoryColors, angles) {
    chartId.data.datasets[0].data = durations;
    chartId.data.labels = labelName;
    chartId.data.datasets[0].backgroundColor = categoryColors;
    chartId.options.rotation = angles;
    if (durations.length === 1) {
        chartId.data.datasets[0].borderWidth = 0;
    } else {
        chartId.data.datasets[0].borderWidth = 1;
    }
    chartId.update();
}

export function deleteSlice(slice) {
    console.log("deleteSlice()");
    const deleteDuration = (slice.start + slice.duration) - (slice.start);

    //console.log('detailsArray2:', detailsArray2);

    beforeDetailsArray = detailsArray2.slice();

    updateChartData(slice.start, slice.start + slice.duration, deleteDuration, blankObject, legend);
}
