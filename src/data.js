import { initializeDarkLightMode } from './darklightmodedata.js'
import { checkDeviceWidth, isMobile } from './responsiveness.js'
import { receiveLegendFromDatabase, saveLegendToDatabase, retrieveToday, receiveSettingsFromDatabase, getRemoveArray, saveToDatabase, receiveTagsFromDatabase, saveTagsToDatabase } from './firebase/dbHandler.js'
import Chart from 'chart.js/auto'
//import { seeDetailsLog } from './log.js'
import { DateTime } from 'luxon';
import { signOutUser } from './firebase/authentication.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//loading screen
const loadingScreen = document.getElementById('loading-screen');

let removeArray = [];
let legend = {};
var blankObject = {
    uniqueId: ""
}
let tags = [];
let settings = {};

//if slices are overwritten, it is overwritten with properties from remaining (this derives the color)
function findRemaining(data) {
    for (const x of data) {
        if (x.name === "Remaining") {

            blankObject.uniqueId = x.uniqueId;
            blankObject.name = x.name;
            blankObject.color = x.color;

            return blankObject;
        }
        if (x.children !== undefined) {
            findRemaining(x.children);
        }
    }
}

receiveSettingsFromDatabase()
    .then((receivedSettings) => {
        settings = receivedSettings;
        if (settings !== null) {
            if (settings.font !== "default") {
                const userFont = `${settings.font}, sans-serif`;
                changeFontFamily(userFont);
            }
        }
        //setDateInputFont();
        receiveLegendFromDatabase()
            .then((receivedLegend) => {
                legend = receivedLegend;

                if (settings !== null) {
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

                findRemaining(legend);
                formInitialization(legend);
                receiveTagsFromDatabase()
                    .then((receivedTags) => {
                        tags = receivedTags;
                        getRemoveArray()
                            .then((receivedRemoveArray) => {
                                removeArray = receivedRemoveArray;
                                loadingScreen.style.display = "none";
                            })
                    })
            })
    })

//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

//Charts 
var ctx = document.getElementById('barChartForTotals').getContext('2d');

var barChartForTotals = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: [], //'Bar Chart For Totals'
            data: [],
            backgroundColor: [],
            //borderColor: "black", //'rgba(75, 192, 192, 1)'
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.formattedValue + ' minutes';
                        return label;
                    }
                }
            }
        }
    }
})
barChartForTotals.update();

var ctx2 = document.getElementById('barChartForFrequency').getContext('2d');

var barChartForFrequency = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: [], //'Bar Chart for Frequency'
            data: [],
            backgroundColor: [],
            //borderColor: "black",
            //borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Rotate bars horizontally
        scales: {
            x: {
                //min: 0,
                //max: 7,
                ticks: {
                    stepSize: 1
                },
                beginAtZero: true
            }
        }, 
        plugins: {
            legend: {
                display: false
            }
        }
    },
    //options: {
    //    responsive: true,
    //    maintainAspectRatio: false,
    //    scales: {
    //        y: {
    //            min: 0,
    //            max: 24, //24
    //            ticks: {
    //                stepSize: 1,
    //                //callback: function(value) {
    //                //    return ((value / 60) + " o'clock"); //+ '%'; // Convert value to percentage format
    //                //  }
    //            },//
    //            beginAtZero: true
    //        }
    //    }
    //},
    /* plugins: {
        tooltip: {
            enabled: false
        }
    } */
});

barChartForFrequency.update();

var ctx3 = document.getElementById("pieChartForPercentageOfWeek").getContext("2d");
var pieChartForPercentageOfWeek = new Chart(ctx3, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            type: 'pie',
            label: [], //"Pie Chart For Percentage of Week"
            data: [],
            backgroundColor: [],
            hoverOffset: 5,
            borderColor: "black",

            radius: '100%'
        }
        ],
    },
    options: {
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        rotation: 0,
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

pieChartForPercentageOfWeek.update();

var ctx4 = document.getElementById("pieChartForPercentageOfParent").getContext("2d");
var pieChartForPercentageOfParent = new Chart(ctx4, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            type: 'pie',
            label: [], //"Pie Chart For Percentage of Parent"
            data: [],
            backgroundColor: [],
            hoverOffset: 5,
            borderColor: "black",

            radius: '100%'
        }
        ],
    },
    options: {
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        rotation: 0,
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

pieChartForPercentageOfParent.update();

const rawDataFromDatabase = [];
let parentSelection = {};
const uidArrayForMain = [];
const uidArrayForParent = []; //note when it is time to process for totals; main gets the most work, parent gets a function that just looks for total for week, same function for parent is used on siblings
const mainObj = {
    aboutObj: {},
    dateArray: []
}
const parentObj = {
    aboutObj: {},
    dateArray: []
}
const siblingArray = []; //an array of sibling objects

let totalsArrayForMain = [];
let totalsValueForMain = 0;
let totalsValueForParent = 0;
let totalsForParentSibling = 0; //total time spent in the parent (for pie chart relating to time spent within the parent)
let totalTime = 0;
let totalsArrayForSiblings = [];
let totalOfSiblings = 0;
let totalsArrayForParentPie = [];
let labelsForParentPie = [];
let colorsForParentPie = [];

//for factoids
let average = 0;
let frequency = 0;
let percentageOfWeek = 0;
let percentageOfParent = 0;

//for month
let gradientDateArray = [];

//from user input
let timeUnitSelection;

const neutralColor = 'rgba(75, 192, 192, 0.2)';

//global elements
const spaceForChart = document.getElementById("spaceForChart");
const spaceForChart2 = document.getElementById("spaceForChart2");
const spaceForChart3 = document.getElementById("spaceForChart3");
const spaceForChart4 = document.getElementById("spaceForChart4");

const spaceForFact = document.getElementById("spaceForFact");
const spaceForFact2 = document.getElementById("spaceForFact2");
const spaceForFact3 = document.getElementById("spaceForFact3");
const spaceForFact4 = document.getElementById("spaceForFact4");

//for backdrop report
let currentStep = 0;

//for frequency chart tooltip
let frequencyArray = [];

function formInitialization(legend) {
    console.log("formInitialization()");

    //dropdown for selecting category/subcategory
    const selectElementForCategory = document.getElementById("dropdownForCategory");

    const arrayOfOptions = [];
    createDropdownOptions(legend);
    //sorts in alphabetical order
    arrayOfOptions.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    //creates an option for each value in the array
    for (let i = 0; i < arrayOfOptions.length; i++) {
        if (arrayOfOptions[i].name === "Remaining") {
        } else {
            const option = document.createElement('option');
            option.value = JSON.stringify(arrayOfOptions[i]);
            option.textContent = arrayOfOptions[i].name;
            selectElementForCategory.appendChild(option);
        }
    }

    //creates arrayOfOptions (an array of objects, created from the legend), which will be assigned as the value of each option of the dropdown
    function createDropdownOptions(data) {
        for (const x of data) {
            let obj = {}

            obj = x;

            arrayOfOptions.push(obj);
            if (x.children !== undefined) {
                createDropdownOptions(x.children)
            }
        }
    }
}

//These two lines were here before. I'm guessing it is to declare them as global variables.
const dropdownForTimeUnit = document.getElementById("dropdownForTimeUnit");
// const timeIntervalInput = document.getElementById("timeIntervalInput");

//sets the date input's font to var(--font-family) --> DEPRECATING soon
function setDateInputFont() {
    const form = document.getElementById("dataTypeForm");
    const timeIntervalInput = document.createElement("div");
    timeIntervalInput.id = "timeIntervalInput";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "time-input";

    timeIntervalInput.appendChild(dateInput);
    form.appendChild(timeIntervalInput);

    const input = document.getElementById("time-input");

    input.addEventListener('input', function () {
        const computedStyle = getComputedStyle(document.documentElement);
        const fontFamily = computedStyle.getPropertyValue('--font-family');
        this.style.fontFamily = fontFamily;
    });

    input.dispatchEvent(new Event('input'));
}

//When the user submits inputs for data processing
document.getElementById("submit").addEventListener("click", function () {
    event.preventDefault();
    console.log("submitted form");

    //put a loading screen right here
    loadingScreen.style.display = "flex";
    loadingScreen.style.justifyContent = "center";
    loadingScreen.style.alignItems = "center";

    document.getElementById("make-your-choice").style.display = "none";
    document.getElementById("dataTypeForm").style.display = "none";

    const categorySelection = JSON.parse(dropdownForCategory.value);
    timeUnitSelection = dropdownForTimeUnit.value;

    const intervalSelection = timeIntervalInput.querySelectorAll("input");
    const intervalValues = Array.from(intervalSelection).map(function (input) {
        return input.value;
    })

    console.log("categorySelection:", categorySelection);
    console.log("timeUnitSelection:", timeUnitSelection);
    console.log("intervalValues:", intervalValues);

    let start, end;
    start = DateTime.fromISO(intervalValues[0]);
    //end = DateTime.fromISO(intervalValues[1]);

    if (timeUnitSelection === "week") {
        end = start.plus({ days: 7 });

        totalTime = 10080; //sets it based on the # of minutes in a week

        const startDate = start.toISODate();
        const endDate = end.toISODate();

        retrieveRange(startDate, endDate)
            .then(() => {
                console.log("rawDataFromDatabase:", rawDataFromDatabase);

                uidArrayForMain.push(categorySelection.uniqueId);
                if (categorySelection.children) {
                    createUidArray(categorySelection.children, uidArrayForMain);
                }
                mainObj.aboutObj = categorySelection;
                getSlices(uidArrayForMain, mainObj);
                console.log("mainObj:", mainObj);

                findParentAndSiblings(legend, null, categorySelection.uniqueId);
                console.log("parentSelection:", parentSelection);
                uidArrayForParent.push(parentSelection.uniqueId);
                createUidArray(parentSelection.children, uidArrayForParent);
                parentObj.aboutObj = parentSelection;
                getSlices(uidArrayForParent, parentObj);
                console.log("parentObj:", parentObj);
                createSiblingArray();
                createUidArraysForSiblings();
                getSlicesForSiblings();

                //find totals
                createTotalsForMain();
                console.log("totalsArrayForMain:", totalsArrayForMain);
                totalsValueForMain = findTotalsValueForMain(totalsValueForMain);
                console.log("totalsValueForMain:", totalsValueForMain);
                totalsValueForParent = findTotals(parentObj);
                console.log("totalsValueForParent:", totalsValueForParent);
                findTotalsForSiblings();
                console.log("siblingArray:", siblingArray);
                totalOfSiblings = findTotalOfSiblings(totalOfSiblings);
                console.log("totalOfSiblings:", totalOfSiblings);
                totalsForParentSibling = setValueForParentSibling();
                console.log("totalsForParentSibling:", totalsForParentSibling);
                totalsArrayForSiblings = siblingArray.map(obj => obj.total);
                console.log("totalsArrayForSiblings:", totalsArrayForSiblings);

                totalsArrayForParentPie = totalsArrayForSiblings.slice();
                totalsArrayForParentPie.push(totalsForParentSibling);
                labelsForParentPie = siblingArray.map(obj => obj.aboutObj.name);
                labelsForParentPie.push(parentObj.aboutObj.name);
                colorsForParentPie = siblingArray.map(obj => obj.aboutObj.color);
                colorsForParentPie.push(parentObj.aboutObj.color);

                //Adjusting Factoids
                let averageFactoid = document.getElementById("averageFactoid");
                let frequencyFactoid = document.getElementById("frequencyFactoid");
                let percentageOfWeekFactoid = document.getElementById("percentageOfWeekFactoid");
                let percentageOfParentFactoid = document.getElementById("percentageOfParentFactoid");

                average = Math.round(totalsValueForMain / 7 * 1) / 1;
                frequency = getFrequency();
                percentageOfWeek = Math.round(totalsValueForMain / totalTime * 100) * 100 / 100;
                percentageOfParent = Math.round(totalsValueForMain / totalsValueForParent * 100) * 100 / 100;

                averageFactoid.innerHTML = "On the average day, " + average + " minutes are spent on " + mainObj.aboutObj.name + ".";
                frequencyFactoid.innerHTML = mainObj.aboutObj.name + " was performed " + frequency + " times during the week.";
                percentageOfWeekFactoid.innerHTML = percentageOfWeek + "% of the week from " + startDate + " to " + endDate + " was spent on " + mainObj.aboutObj.name + ".";
                percentageOfParentFactoid.innerHTML = mainObj.aboutObj.name + " composed " + percentageOfParent + "% of time spent in " + parentObj.aboutObj.name + " for the week.";

                //CHARTS
                barChartForTotals.data.labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
                barChartForTotals.data.datasets[0].data = totalsArrayForMain;
                barChartForTotals.data.datasets[0].backgroundColor = [mainObj.aboutObj.color];

                // Adjust the chart options based on the device condition
                if (isMobile) {
                    barChartForTotals.options.indexAxis = 'y';
                    // Reverse the x and y axes for horizontal bars
                    barChartForTotals.options.scales = {
                        x: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                        y: {
                            type: 'category',
                        },
                    };

                    // Set the chart height to auto
                    barChartForTotals.options.plugins = {
                        legend: {
                            display: false,
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                    };
                } else {
                    // Reset the chart options to default for vertical bars
                    barChartForTotals.options.indexAxis = 'x';
                    barChartForTotals.options.scales = {
                        x: {
                            type: 'category',
                        },
                        y: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                    };

                    // Set the fixed height for the chart
                    /* barChartForTotals.options.plugins = {
                        legend: {
                            display: false,
                        },
                        responsive: false,
                        maintainAspectRatio: true,
                        aspectRatio: 2, // Adjust the aspect ratio as per your requirement
                    };  */
                }

                barChartForTotals.update();

                frequencyArray = mainObj.dateArray.map(innerArray => innerArray.length);
                var tooltips = barChartForFrequency.options.plugins.tooltip;
                tooltips.callbacks = {
                    label: function (context) {
                        var index = context.dataIndex;
                        var frequency = frequencyArray[index];
                        var label = frequency + (frequency === 1 ? ' time' : ' times');
                        return label;
                    }
                }; 

                barChartForFrequency.data.labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
                barChartForFrequency.data.datasets[0].data = [24, 24, 24, 24, 24, 24, 24];

                // Adjust the chart options based on the device condition
                /* if (isMobile) {
                    // Reset the chart options to default for vertical bars
                    barChartForFrequency.options.indexAxis = 'x';
                    barChartForFrequency.options.scales = {
                        x: {
                            type: 'category'
                        }, 
                        y: {
                            type: 'linear',
                            ticks: {
                                stepSize: 4

                            },
                            beginAtZero: true,
                        },
                    }; 
                } else {
                    barChartForFrequency.options.indexAxis = 'y';
                    barChartForFrequency.options.scales = {
                        x: {
                            type: 'linear',
                            ticks: {
                                stepSize: 1
                            },
                            beginAtZero: true,
                        }, 
                        y: {
                            type: 'category',
                        },
                    }
                }   */

                const gradients = getGradient(ctx2, barChartForFrequency.chartArea, barChartForFrequency.scales);
                console.log("gradients:", gradients);
                barChartForFrequency.data.datasets[0].backgroundColor = gradients;
                barChartForFrequency.update();

                pieChartForPercentageOfWeek.data.labels = [mainObj.aboutObj.name, "Other"];
                pieChartForPercentageOfWeek.data.datasets[0].data = [totalsValueForMain, totalTime - totalsValueForMain];
                pieChartForPercentageOfWeek.data.datasets[0].backgroundColor = [mainObj.aboutObj.color, neutralColor];
                pieChartForPercentageOfWeek.update();

                pieChartForPercentageOfParent.data.labels = labelsForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].data = totalsArrayForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].backgroundColor = colorsForParentPie;
                pieChartForPercentageOfParent.update();

                loadingScreen.style.display = "none";
                const backdrop = document.getElementById("backdropForReport");
                backdrop.style.visibility = "visible";
                currentStep = 1;
                hideExcept(currentStep);
                showButtons(currentStep);
                seeDetailsLog(mainObj.dateArray, timeUnitSelection);
            })

        //}
    } else if (timeUnitSelection === "month") {

        end = start.plus({ days: 28 });

        totalTime = 40320; //sets it based on the # of minutes in 28 days

        const startDate = start.toISODate();
        const endDate = end.toISODate();

        retrieveRange(startDate, endDate)
            .then(() => {
                console.log("rawDataFromDatabase:", rawDataFromDatabase);

                uidArrayForMain.push(categorySelection.uniqueId);
                if (categorySelection.children) {
                    createUidArray(categorySelection.children, uidArrayForMain);
                }
                mainObj.aboutObj = categorySelection;
                getSlicesForMonth(uidArrayForMain, mainObj, start);
                console.log("mainObj:", mainObj);

                findParentAndSiblings(legend, null, categorySelection.uniqueId);
                console.log("parentSelection:", parentSelection);
                uidArrayForParent.push(parentSelection.uniqueId);
                createUidArray(parentSelection.children, uidArrayForParent);
                parentObj.aboutObj = parentSelection;
                getSlicesForMonth(uidArrayForParent, parentObj, start);
                console.log("parentObj:", parentObj);
                createSiblingArray();
                createUidArraysForSiblings();
                getSlicesForSiblingsForMonth(start);

                //find totals
                createTotalsForMain();
                console.log("totalsArrayForMain:", totalsArrayForMain);
                totalsValueForMain = findTotalsValueForMain(totalsValueForMain);
                console.log("totalsValueForMain:", totalsValueForMain);
                totalsValueForParent = findTotals(parentObj);
                console.log("totalsValueForParent:", totalsValueForParent);
                findTotalsForSiblings();
                console.log("siblingArray:", siblingArray);
                totalOfSiblings = findTotalOfSiblings(totalOfSiblings);
                console.log("totalOfSiblings:", totalOfSiblings);
                totalsForParentSibling = setValueForParentSibling();
                console.log("totalsForParentSibling:", totalsForParentSibling);
                totalsArrayForSiblings = siblingArray.map(obj => obj.total);
                console.log("totalsArrayForSiblings:", totalsArrayForSiblings);

                totalsArrayForParentPie = totalsArrayForSiblings.slice();
                totalsArrayForParentPie.push(totalsForParentSibling);
                labelsForParentPie = siblingArray.map(obj => obj.aboutObj.name);
                labelsForParentPie.push(parentObj.aboutObj.name);
                colorsForParentPie = siblingArray.map(obj => obj.aboutObj.color);
                colorsForParentPie.push(parentObj.aboutObj.color);

                //Adjusting Factoids
                let averageFactoid = document.getElementById("averageFactoid");
                let frequencyFactoid = document.getElementById("frequencyFactoid");
                let percentageOfWeekFactoid = document.getElementById("percentageOfWeekFactoid");
                let percentageOfParentFactoid = document.getElementById("percentageOfParentFactoid");

                average = Math.round(totalsValueForMain / 4 * 1) / 1;
                frequency = getFrequency();
                percentageOfWeek = Math.round(totalsValueForMain / totalTime * 100) * 100 / 100;
                percentageOfParent = Math.round(totalsValueForMain / totalsValueForParent * 100) * 100 / 100;

                averageFactoid.innerHTML = "On the average week, " + average + " minutes are spent on " + mainObj.aboutObj.name + ".";
                frequencyFactoid.innerHTML = mainObj.aboutObj.name + " was performed " + frequency + " times during the month.";
                percentageOfWeekFactoid.innerHTML = percentageOfWeek + "% of the month from " + startDate + " to " + endDate + " was spent on " + mainObj.aboutObj.name + ".";
                percentageOfParentFactoid.innerHTML = mainObj.aboutObj.name + " composed " + percentageOfParent + "% of time spent in " + parentObj.aboutObj.name + " for the month.";

                //CHARTS
                barChartForTotals.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                barChartForTotals.data.datasets[0].data = totalsArrayForMain;
                barChartForTotals.data.datasets[0].backgroundColor = [mainObj.aboutObj.color];

                // Adjust the chart options based on the device condition
                if (isMobile) {
                    barChartForTotals.options.indexAxis = 'y';
                    // Reverse the x and y axes for horizontal bars
                    barChartForTotals.options.scales = {
                        x: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                        y: {
                            type: 'category',
                        },
                    };
                } else {
                }

                barChartForTotals.update();

                frequencyArray = mainObj.dateArray.map(innerArray => innerArray.length);
                var tooltips = barChartForFrequency.options.plugins.tooltip;
                tooltips.callbacks = {
                    label: function (context) {
                        var index = context.dataIndex;
                        var frequency = frequencyArray[index];
                        var label = frequency + (frequency === 1 ? ' time' : ' times');
                        return label;
                    }
                };

                barChartForFrequency.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                barChartForFrequency.data.datasets[0].data = [7, 7, 7, 7];
                gradientDateArray = JSON.parse(JSON.stringify(mainObj.dateArray));

                adjustDataForMonthGradient(start);
                console.log('gradientDateArray:', gradientDateArray);
                const gradients = getGradientForMonth(ctx2, barChartForFrequency.chartArea);
                barChartForFrequency.data.datasets[0].backgroundColor = gradients;

                barChartForFrequency.update();

                pieChartForPercentageOfWeek.data.labels = [mainObj.aboutObj.name, "Other"];
                pieChartForPercentageOfWeek.data.datasets[0].data = [totalsValueForMain, totalTime - totalsValueForMain];
                pieChartForPercentageOfWeek.data.datasets[0].backgroundColor = [mainObj.aboutObj.color, neutralColor];
                pieChartForPercentageOfWeek.update();

                pieChartForPercentageOfParent.data.labels = labelsForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].data = totalsArrayForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].backgroundColor = colorsForParentPie;
                pieChartForPercentageOfParent.update();

                loadingScreen.style.display = "none";
                const backdrop = document.getElementById("backdropForReport");
                backdrop.style.visibility = "visible";
                currentStep = 1;
                hideExcept(currentStep);
                showButtons(currentStep);
                seeDetailsLog(mainObj.dateArray, timeUnitSelection);

            })

    } else if (timeUnitSelection === "year") {

        end = start.plus({ days: 336 }); //28 x 12

        totalTime = 483840; //sets it based on the # of minutes in 28 days x 12 months

        const startDate = start.toISODate();
        const endDate = end.toISODate();

        retrieveRange(startDate, endDate)
            .then(() => {
                console.log("rawDataFromDatabase:", rawDataFromDatabase);

                uidArrayForMain.push(categorySelection.uniqueId);
                if (categorySelection.children) {
                    createUidArray(categorySelection.children, uidArrayForMain);
                }
                mainObj.aboutObj = categorySelection;
                getSlicesForYear(uidArrayForMain, mainObj, start);
                console.log("mainObj:", mainObj);

                findParentAndSiblings(legend, null, categorySelection.uniqueId);
                console.log("parentSelection:", parentSelection);
                uidArrayForParent.push(parentSelection.uniqueId);
                createUidArray(parentSelection.children, uidArrayForParent);
                parentObj.aboutObj = parentSelection;
                getSlicesForYear(uidArrayForParent, parentObj, start);
                console.log("parentObj:", parentObj);
                createSiblingArray();
                createUidArraysForSiblings();
                getSlicesForSiblingsForYear(start);

                //find totals
                createTotalsForMain();
                console.log("totalsArrayForMain:", totalsArrayForMain);
                totalsValueForMain = findTotalsValueForMain(totalsValueForMain);
                console.log("totalsValueForMain:", totalsValueForMain);
                totalsValueForParent = findTotals(parentObj);
                console.log("totalsValueForParent:", totalsValueForParent);
                findTotalsForSiblings();
                console.log("siblingArray:", siblingArray);
                totalOfSiblings = findTotalOfSiblings(totalOfSiblings);
                console.log("totalOfSiblings:", totalOfSiblings);
                totalsForParentSibling = setValueForParentSibling();
                console.log("totalsForParentSibling:", totalsForParentSibling);
                totalsArrayForSiblings = siblingArray.map(obj => obj.total);
                console.log("totalsArrayForSiblings:", totalsArrayForSiblings);

                totalsArrayForParentPie = totalsArrayForSiblings.slice();
                totalsArrayForParentPie.push(totalsForParentSibling);
                labelsForParentPie = siblingArray.map(obj => obj.aboutObj.name);
                labelsForParentPie.push(parentObj.aboutObj.name);
                colorsForParentPie = siblingArray.map(obj => obj.aboutObj.color);
                colorsForParentPie.push(parentObj.aboutObj.color);

                //Adjusting Factoids
                let averageFactoid = document.getElementById("averageFactoid");
                let frequencyFactoid = document.getElementById("frequencyFactoid");
                let percentageOfWeekFactoid = document.getElementById("percentageOfWeekFactoid");
                let percentageOfParentFactoid = document.getElementById("percentageOfParentFactoid");

                average = Math.round(totalsValueForMain / 4 * 1) / 1;
                frequency = getFrequency();
                percentageOfWeek = Math.round(totalsValueForMain / totalTime * 100) * 100 / 100;
                percentageOfParent = Math.round(totalsValueForMain / totalsValueForParent * 100) * 100 / 100;

                averageFactoid.innerHTML = "On the average month, " + average + " minutes are spent doing " + mainObj.aboutObj.name + ".";
                frequencyFactoid.innerHTML = mainObj.aboutObj.name + " was performed " + frequency + " times during the year.";
                percentageOfWeekFactoid.innerHTML = percentageOfWeek + "% of the year from " + startDate + " to " + endDate + " was spent on " + mainObj.aboutObj.name + ".";
                percentageOfParentFactoid.innerHTML = mainObj.aboutObj.name + " composed " + percentageOfParent + "% of time spent in " + parentObj.aboutObj.name + " for the year.";

                //CHARTS
                barChartForTotals.data.labels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
                barChartForTotals.data.datasets[0].data = totalsArrayForMain;
                barChartForTotals.data.datasets[0].backgroundColor = [mainObj.aboutObj.color];

                // Adjust the chart options based on the device condition
                if (isMobile) {
                    barChartForTotals.options.indexAxis = 'y';
                    // Reverse the x and y axes for horizontal bars
                    barChartForTotals.options.scales = {
                        x: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                        y: {
                            type: 'category',
                        },
                    };
                } else {
                }

                barChartForTotals.update();

                frequencyArray = mainObj.dateArray.map(innerArray => innerArray.length);
                var tooltips = barChartForFrequency.options.plugins.tooltip;
                tooltips.callbacks = {
                    label: function (context) {
                        var index = context.dataIndex;
                        var frequency = frequencyArray[index];
                        var label = frequency + (frequency === 1 ? ' time' : ' times');
                        return label;
                    }
                };

                barChartForFrequency.data.labels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
                barChartForFrequency.data.datasets[0].data = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
                //gradientDateArray = mainObj.dateArray.slice();
                gradientDateArray = JSON.parse(JSON.stringify(mainObj.dateArray));
                adjustDataForYearGradient(start);
                console.log('gradientDateArray:', gradientDateArray);
                const gradients = getGradientForYear(ctx2, barChartForFrequency.chartArea);
                barChartForFrequency.data.datasets[0].backgroundColor = gradients;
                barChartForFrequency.update();

                pieChartForPercentageOfWeek.data.labels = [mainObj.aboutObj.name, "Other"];
                pieChartForPercentageOfWeek.data.datasets[0].data = [totalsValueForMain, totalTime - totalsValueForMain];
                pieChartForPercentageOfWeek.data.datasets[0].backgroundColor = [mainObj.aboutObj.color, neutralColor];
                pieChartForPercentageOfWeek.update();

                pieChartForPercentageOfParent.data.labels = labelsForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].data = totalsArrayForParentPie;
                pieChartForPercentageOfParent.data.datasets[0].backgroundColor = colorsForParentPie;
                pieChartForPercentageOfParent.update();

                loadingScreen.style.display = "none";
                const backdrop = document.getElementById("backdropForReport");
                backdrop.style.visibility = "visible";
                currentStep = 1;
                hideExcept(currentStep);
                showButtons(currentStep);
                seeDetailsLog(mainObj.dateArray, timeUnitSelection);
            }
            )
    }
})

//Event listeners for the arrows (to view each chart one at a time) and the see details button and the reset button
const nextChartBtn = document.getElementById("next-chart");
const backChartBtn = document.getElementById("chart-back");
const resetButton = document.getElementById('resetButton');

nextChartBtn.addEventListener("click", function () {
    currentStep++;
    showButtons(currentStep);
    hideExcept(currentStep);
})

backChartBtn.addEventListener("click", function () {
    currentStep--;
    showButtons(currentStep);
    hideExcept(currentStep);
})

resetButton.addEventListener('click', function () {
    location.reload(); // Reload the page
});

function showButtons(currentStep) {
    if (currentStep === 1) {
        backChartBtn.style.display = "none";
        nextChartBtn.style.display = "block";
    }
    if (currentStep === 2) {
        backChartBtn.style.display = "block";
        nextChartBtn.style.display = "block";
    }
    if (currentStep === 3) {
        backChartBtn.style.display = "block";
        nextChartBtn.style.display = "block";
    }
    if (currentStep === 4) {
        backChartBtn.style.display = "block";
        nextChartBtn.style.display = "none";
    }
}

function hideExcept(currentStep) {
    if (currentStep === 1) {
        spaceForChart.style.display = "block";
        spaceForFact.style.display = "block";
        spaceForChart2.style.display = "none";
        spaceForFact2.style.display = "none";
        spaceForChart3.style.display = "none";
        spaceForFact3.style.display = "none";
        spaceForChart4.style.display = "none";
        spaceForFact4.style.display = "none";
    }
    if (currentStep === 2) {
        spaceForChart.style.display = "none";
        spaceForFact.style.display = "none";
        spaceForChart2.style.display = "block";
        spaceForFact2.style.display = "block";
        spaceForChart3.style.display = "none";
        spaceForFact3.style.display = "none";
        spaceForChart4.style.display = "none";
        spaceForFact4.style.display = "none";
    }
    if (currentStep === 3) {
        spaceForChart.style.display = "none";
        spaceForFact.style.display = "none";
        spaceForChart2.style.display = "none";
        spaceForFact2.style.display = "none";
        spaceForChart3.style.display = "block";
        spaceForFact3.style.display = "block";
        spaceForChart4.style.display = "none";
        spaceForFact4.style.display = "none";
    }
    if (currentStep === 4) {
        spaceForChart.style.display = "none";
        spaceForFact.style.display = "none";
        spaceForChart2.style.display = "none";
        spaceForFact2.style.display = "none";
        spaceForChart3.style.display = "none";
        spaceForFact3.style.display = "none";
        spaceForChart4.style.display = "block";
        spaceForFact4.style.display = "block";
    }
}
//Functions from app.js that check slices to see if they need to be overwritten (recolored/renamed/deleted)
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

//Functions that create the data
async function retrieveRange(startDate, endDate) {
    if (startDate === endDate) {
        console.log("end of retrieval of data, saving removeArray")
        //saveRemoveArray
        return;
    } else {
        const rawData = await retrieveToday(startDate);

        //check if slices need to be altered (renamed/recolored/deleted) before processing
        const start = DateTime.fromISO(startDate);
        checkAgainstDatabase(rawData, removeArray, start);

        if (rawData === null) {
            console.log("no Data for: ", startDate);
        } else {
            rawDataFromDatabase.push(rawData);
            const next = (DateTime.fromISO(startDate)).plus({ days: 1 });
            const nextDate = next.toISODate();
            await retrieveRange(nextDate, endDate);
        }
    }
}
function createUidArray(childrenOfSelectedObj, uidArray) {
    for (const x of childrenOfSelectedObj) {
        uidArray.push(x.uniqueId);
        if (x.children) {
            createUidArray(x.children, uidArray);
        }
    }
}
function getSlices(uidArray, obj) {
    for (let i = 0; i < rawDataFromDatabase.length; i++) {
        const dayArray = [];
        let daySlices = rawDataFromDatabase[i].data.detailsArray;
        let timestamp = DateTime.fromISO(rawDataFromDatabase[i].data.timestamp);
        const date = timestamp.toFormat('yyyy-MM-dd');
        for (let j = 0; j < daySlices.length; j++) {
            daySlices[j].date = date;
            const sliceId = daySlices[j].uniqueId;
            if (uidArray.includes(sliceId)) {
                dayArray.push(daySlices[j]);
            }
        }
        obj.dateArray.push(dayArray);
    }
}
function getSlicesForMonth(uidArray, obj, start) {
    let weekArray = [];
    const week2Start = start.plus({ days: 7 });
    const week2Date = week2Start.toFormat('yyyy-MM-dd');
    const week3Start = week2Start.plus({ days: 7 });
    const week3Date = week3Start.toFormat('yyyy-MM-dd');
    const week4Start = week3Start.plus({ days: 7 });
    const week4Date = week4Start.toFormat('yyyy-MM-dd');

    for (let i = 0; i < rawDataFromDatabase.length; i++) {
        let daySlices = rawDataFromDatabase[i].data.detailsArray;
        let timestamp = DateTime.fromISO(rawDataFromDatabase[i].data.timestamp);
        const date = timestamp.toFormat('yyyy-MM-dd');

        if (date == week2Date) {
            obj.dateArray.push(weekArray);
            weekArray = [];
        } else if (date == week3Date) {
            obj.dateArray.push(weekArray);
            weekArray = [];
        } else if (date == week4Date) {
            obj.dateArray.push(weekArray);
            weekArray = [];
        } else if (i === rawDataFromDatabase.length - 1) {
            obj.dateArray.push(weekArray);
            weekArray = [];
        }
        for (let j = 0; j < daySlices.length; j++) {
            daySlices[j].date = date;
            const sliceId = daySlices[j].uniqueId;
            if (uidArray.includes(sliceId)) {
                weekArray.push(daySlices[j]);
            }
        }
    }
}
function getSlicesForYear(uidArray, obj, start) {
    console.log("getSlicesForYear");
    let monthArray = [];
    const month2Start = start.plus({ days: 28 });
    const month2Date = month2Start.toFormat('yyyy-MM-dd');
    const month3Start = month2Start.plus({ days: 28 });
    const month3Date = month3Start.toFormat('yyyy-MM-dd');
    const month4Start = month3Start.plus({ days: 28 });
    const month4Date = month4Start.toFormat('yyyy-MM-dd');
    const month5Start = month4Start.plus({ days: 28 });
    const month5Date = month5Start.toFormat('yyyy-MM-dd');
    const month6Start = month5Start.plus({ days: 28 });
    const month6Date = month6Start.toFormat('yyyy-MM-dd');
    const month7Start = month6Start.plus({ days: 28 });
    const month7Date = month7Start.toFormat('yyyy-MM-dd');
    const month8Start = month7Start.plus({ days: 28 });
    const month8Date = month8Start.toFormat('yyyy-MM-dd');
    const month9Start = month8Start.plus({ days: 28 });
    const month9Date = month9Start.toFormat('yyyy-MM-dd');
    const month10Start = month9Start.plus({ days: 28 });
    const month10Date = month10Start.toFormat('yyyy-MM-dd');
    const month11Start = month10Start.plus({ days: 28 });
    const month11Date = month11Start.toFormat('yyyy-MM-dd');
    const month12Start = month11Start.plus({ days: 28 });
    const month12Date = month12Start.toFormat('yyyy-MM-dd');

    for (let i = 0; i < rawDataFromDatabase.length; i++) {
        let monthSlices = rawDataFromDatabase[i].data.detailsArray;
        let timestamp = DateTime.fromISO(rawDataFromDatabase[i].data.timestamp);
        const date = timestamp.toFormat('yyyy-MM-dd');

        if (date == month2Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month3Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month4Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month5Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month6Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month7Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month8Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month9Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month10Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month11Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (date == month12Date) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        } else if (i === rawDataFromDatabase.length - 1) {
            obj.dateArray.push(monthArray);
            monthArray = [];
        }
        for (let j = 0; j < monthSlices.length; j++) {
            monthSlices[j].date = date;
            const sliceId = monthSlices[j].uniqueId;
            if (uidArray.includes(sliceId)) {
                monthArray.push(monthSlices[j]);
            }
        }
    }
}
function findParentAndSiblings(data, aboutObj, uniqueIdOfMain) {
    for (const x of data) {
        if (x.uniqueId === uniqueIdOfMain) {
            parentSelection = aboutObj;
        }
        if (x.children) {
            findParentAndSiblings(x.children, x, uniqueIdOfMain);
        }
    }
    if (parentSelection === null) {
        console.log("user selected a category with no direct parent");
        parentSelection = {
            name: "all activities",
            color: "gray",
            children: legend,
            uniqueId: "00000"
        }
    }
}
function createSiblingArray() {
    for (let i = 0; i < parentObj.aboutObj.children.length; i++) {
        const sibling = {
            aboutObj: parentObj.aboutObj.children[i],
            uidArray: [],
            dateArray: [],
            total: 0
        };
        siblingArray.push(sibling);
    }
}
function createUidArraysForSiblings() {
    for (i = 0; i < siblingArray.length; i++) {
        siblingArray[i].uidArray.push(siblingArray[i].aboutObj.uniqueId);
        if (siblingArray[i].aboutObj.children) {
            createUidArray(siblingArray[i].aboutObj.children, siblingArray[i].uidArray);
        }
    }
}
function getSlicesForSiblings() {
    for (i = 0; i < siblingArray.length; i++) {
        getSlices(siblingArray[i].uidArray, siblingArray[i]);
    }
}
function getSlicesForSiblingsForMonth(start) {
    for (i = 0; i < siblingArray.length; i++) {
        getSlicesForMonth(siblingArray[i].uidArray, siblingArray[i], start);
    }
}
function getSlicesForSiblingsForYear(start) {
    console.log('getSlicesForSiblingsForYear');
    for (i = 0; i < siblingArray.length; i++) {
        getSlicesForYear(siblingArray[i].uidArray, siblingArray[i], start);
    }
}
//Functions that process the data
function createTotalsForMain() {
    for (i = 0; i < mainObj.dateArray.length; i++) {
        let totalForDay = 0;
        for (j = 0; j < mainObj.dateArray[i].length; j++) {
            totalForDay += mainObj.dateArray[i][j].duration;
        }
        totalsArrayForMain.push(totalForDay);
    }
}
function findTotalsValueForMain(totalsValue) {
    for (let i = 0; i < totalsArrayForMain.length; i++) {
        totalsValue += totalsArrayForMain[i];
    }
    return totalsValue;
}
function findTotals(obj) {
    let total = 0;
    for (i = 0; i < obj.dateArray.length; i++) {
        for (j = 0; j < obj.dateArray[i].length; j++) {
            total += obj.dateArray[i][j].duration;
        }
    }
    return total;
}
function findTotalsForSiblings() {
    for (let i = 0; i < siblingArray.length; i++) {
        let totalForSibling = findTotals(siblingArray[i]);
        siblingArray[i].total = totalForSibling;
    }
}
function findTotalOfSiblings(totalOfSiblings) {
    for (let i = 0; i < siblingArray.length; i++) {
        totalOfSiblings += siblingArray[i].total;
    }
    return totalOfSiblings;
}
function setValueForParentSibling() {
    if (totalOfSiblings === totalsValueForParent) {
        totalsForParentSibling = 0;
    } else {
        totalsForParentSibling = totalsValueForParent - totalOfSiblings;
    }
    return totalsForParentSibling;
}
//Miscellaneous Functions
function getFrequency() {
    let count = 0;
    for (let i = 0; i < mainObj.dateArray.length; i++) {
        for (let j = 0; j < mainObj.dateArray[i].length; j++) {
            if (mainObj.dateArray[i][j]) {
                count++;
            }
        }
    }
    return count;
}
function getGradient(ctx2, chartArea, scales) {
    const colorForSlice = mainObj.aboutObj.color;
    const neutralColor = 'rgba(75, 192, 192, 0.2)'; //Note: putting an rgba color into chart.js makes it automatically dark/light mode  
    const gradients = [];
    for (let i = 0; i < mainObj.dateArray.length; i++) {
        /* let gradientForDay;
        if (isMobile) {
            gradientForDay = ctx2.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        } else {
            gradientForDay = ctx2.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        }  */
        const gradientForDay = ctx2.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        let previousEnd = 0;
        for (let j = 0; j < mainObj.dateArray[i].length; j++) {
            const numberOfSliceInDay = mainObj.dateArray[i].length;
            const slice = mainObj.dateArray[i][j];
            //first slice code
            if (slice) {
                if (j === 0 && slice.start === 0) {
                    gradientForDay.addColorStop(0, colorForSlice);
                    //console.log("gradientForDay.addColorStop(0, colorForSlice)");
                    const colorStop = slice.duration / 1440;
                    gradientForDay.addColorStop(colorStop, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    previousEnd = slice.duration;
                } else if (j === 0 && slice.start !== 0) {
                    gradientForDay.addColorStop(0, neutralColor);
                    //console.log("gradientForDay.addColorStop(0, neutralColor)");
                    const colorStop = slice.start / 1440;
                    const colorStop2 = (slice.start + slice.duration) / 1440;
                    gradientForDay.addColorStop(colorStop, neutralColor);
                    gradientForDay.addColorStop(colorStop, colorForSlice);
                    gradientForDay.addColorStop(colorStop2, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start === previousEnd) {
                    const lineToSeparate = previousEnd / 1440; //NOTE I DID NOT PUT CONSOLE.LOGs for gradients relating to this separator 
                    gradientForDay.addColorStop(lineToSeparate, neutralColor);
                    gradientForDay.addColorStop(lineToSeparate + 0.003, neutralColor);
                    gradientForDay.addColorStop(lineToSeparate + 0.003, colorForSlice);
                    const colorStop = (slice.start + slice.duration) / 1440;
                    gradientForDay.addColorStop(colorStop - 0.003, colorForSlice);
                    gradientForDay.addColorStop(colorStop - 0.003, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start !== previousEnd) {
                    const colorStop = previousEnd / 1440;
                    const colorStop2 = slice.start / 1440;
                    const colorStop3 = (slice.start + slice.duration) / 1440;
                    gradientForDay.addColorStop(colorStop, neutralColor);
                    gradientForDay.addColorStop(colorStop2, neutralColor);
                    gradientForDay.addColorStop(colorStop2, colorForSlice);
                    gradientForDay.addColorStop(colorStop3, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop3, ", colorForSlice)");
                    previousEnd = slice.start + slice.duration;
                }
                if (j === numberOfSliceInDay - 1) {
                    if (previousEnd === 1440) {

                    } else if (previousEnd !== 1440) {
                        const colorStop = previousEnd / 1440;
                        gradientForDay.addColorStop(colorStop, neutralColor);
                        gradientForDay.addColorStop(1, neutralColor);
                        //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                        //console.log("gradientForDay.addColorStop(1, neutralColor)");
                    }
                }
            } else {
                gradientForDay.addColorStop(0, neutralColor);
                gradientForDay.addColorStop(1, neutralColor);
                //console.log("gradientForDay.addColorStop(0, neutralColor)");
                //console.log("gradientForDay.addColorStop(1, colorForSlice)");
            }
        }
        gradients.push(gradientForDay);
    }
    return gradients;
}
function getGradientForMonth(ctx2, chartArea) {
    const colorForSlice = mainObj.aboutObj.color;
    const neutralColor = 'rgba(75, 192, 192, 0.2)';
    const gradients = [];
    for (let i = 0; i < gradientDateArray.length; i++) {
        const gradientForWeek = ctx2.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        let previousEnd = 0;
        for (let j = 0; j < gradientDateArray[i].length; j++) {
            const numberOfSliceInWeek = gradientDateArray[i].length;
            const slice = gradientDateArray[i][j];
            //first slice code
            if (slice) {
                if (j === 0 && slice.start === 0) {
                    gradientForWeek.addColorStop(0, colorForSlice);
                    //console.log("gradientForDay.addColorStop(0, colorForSlice)");
                    const colorStop = slice.duration / 10080;
                    gradientForWeek.addColorStop(colorStop, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    previousEnd = slice.duration;
                } else if (j === 0 && slice.start !== 0) {
                    gradientForWeek.addColorStop(0, neutralColor);
                    //console.log("gradientForDay.addColorStop(0, neutralColor)");
                    const colorStop = slice.start / 10080;
                    const colorStop2 = (slice.start + slice.duration) / 10080;
                    gradientForWeek.addColorStop(colorStop, neutralColor);
                    gradientForWeek.addColorStop(colorStop, colorForSlice);
                    gradientForWeek.addColorStop(colorStop2, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start === previousEnd) {
                    const lineToSeparate = previousEnd / 10080; //NOTE I DID NOT PUT CONSOLE.LOGs for gradients relating to this separator 
                    gradientForWeek.addColorStop(lineToSeparate, neutralColor);
                    gradientForWeek.addColorStop(lineToSeparate + 0.003, neutralColor);
                    gradientForWeek.addColorStop(lineToSeparate + 0.003, colorForSlice);
                    const colorStop = (slice.start + slice.duration) / 10080;
                    gradientForWeek.addColorStop(colorStop - 0.003, colorForSlice);
                    gradientForWeek.addColorStop(colorStop - 0.003, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //previousEnd += slice.duration;
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start !== previousEnd) {
                    const colorStop = previousEnd / 10080;
                    const colorStop2 = slice.start / 10080;
                    const colorStop3 = (slice.start + slice.duration) / 10080;
                    gradientForWeek.addColorStop(colorStop, neutralColor);
                    gradientForWeek.addColorStop(colorStop2, neutralColor);
                    gradientForWeek.addColorStop(colorStop2, colorForSlice);
                    gradientForWeek.addColorStop(colorStop3, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop3, ", colorForSlice)");
                    //const difference = slice.start - previousEnd;
                    //previousEnd = difference + slice.duration;
                    previousEnd = slice.start + slice.duration;
                }
                if (j === numberOfSliceInWeek - 1) {
                    if (previousEnd === 10080) {

                    } else if (previousEnd !== 10080) {
                        const colorStop = previousEnd / 10080;
                        gradientForWeek.addColorStop(colorStop, neutralColor);
                        gradientForWeek.addColorStop(1, neutralColor);
                        //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                        //console.log("gradientForDay.addColorStop(1, neutralColor)");
                    }
                }
            } else {
                gradientForWeek.addColorStop(0, neutralColor);
                gradientForWeek.addColorStop(1, neutralColor);
                //console.log("gradientForDay.addColorStop(0, neutralColor)");
                //console.log("gradientForDay.addColorStop(1, colorForSlice)");
            }
        }
        gradients.push(gradientForWeek);
    }
    return gradients;
}
function getGradientForYear(ctx2, chartArea) {
    console.log("getGradientForYear");

    const colorForSlice = mainObj.aboutObj.color;
    const neutralColor = 'rgba(75, 192, 192, 0.2)';
    const gradients = [];
    for (let i = 0; i < gradientDateArray.length; i++) {
        const gradientForMonth = ctx2.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        let previousEnd = 0;
        console.log("Month ", i + 1);
        for (let j = 0; j < gradientDateArray[i].length; j++) {
            const numberOfSliceInMonth = gradientDateArray[i].length;
            const slice = gradientDateArray[i][j];
            //first slice code
            if (slice) {
                if (j === 0 && slice.start === 0) {
                    gradientForMonth.addColorStop(0, colorForSlice);
                    //console.log("gradientForDay.addColorStop(0, colorForSlice)");
                    const colorStop = slice.duration / 40320;
                    gradientForMonth.addColorStop(colorStop, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    previousEnd = slice.duration;
                } else if (j === 0 && slice.start !== 0) {
                    gradientForMonth.addColorStop(0, neutralColor);
                    //console.log("gradientForDay.addColorStop(0, neutralColor)");
                    const colorStop = slice.start / 40320;
                    const colorStop2 = (slice.start + slice.duration) / 40320;
                    gradientForMonth.addColorStop(colorStop, neutralColor);
                    gradientForMonth.addColorStop(colorStop, colorForSlice);
                    gradientForMonth.addColorStop(colorStop2, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start === previousEnd) {
                    const lineToSeparate = previousEnd / 40320; //NOTE I DID NOT PUT CONSOLE.LOGs for gradients relating to this separator 
                    gradientForMonth.addColorStop(lineToSeparate, neutralColor);
                    gradientForMonth.addColorStop(lineToSeparate + 0.003, neutralColor);
                    gradientForMonth.addColorStop(lineToSeparate + 0.003, colorForSlice);
                    const colorStop = (slice.start + slice.duration) / 40320;
                    gradientForMonth.addColorStop(colorStop - 0.003, colorForSlice);
                    gradientForMonth.addColorStop(colorStop - 0.003, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop, ", colorForSlice)");
                    //previousEnd += slice.duration;
                    previousEnd = slice.start + slice.duration;
                } else if (slice.start !== previousEnd) {
                    const colorStop = previousEnd / 40320;
                    const colorStop2 = slice.start / 40320;
                    const colorStop3 = (slice.start + slice.duration) / 40320;
                    gradientForMonth.addColorStop(colorStop, neutralColor);
                    gradientForMonth.addColorStop(colorStop2, neutralColor);
                    gradientForMonth.addColorStop(colorStop2, colorForSlice);
                    gradientForMonth.addColorStop(colorStop3, colorForSlice);
                    //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", neutralColor)");
                    //console.log("gradientForDay.addColorStop(", colorStop2, ", colorForSlice)");
                    //console.log("gradientForDay.addColorStop(", colorStop3, ", colorForSlice)");
                    //const difference = slice.start - previousEnd;
                    //previousEnd = difference + slice.duration;
                    previousEnd = slice.start + slice.duration;
                }
                if (j === numberOfSliceInMonth - 1) {
                    if (previousEnd === 40320) {

                    } else if (previousEnd !== 40320) {
                        const colorStop = previousEnd / 40320;
                        gradientForMonth.addColorStop(colorStop, neutralColor);
                        gradientForMonth.addColorStop(1, neutralColor);
                        //console.log("gradientForDay.addColorStop(", colorStop, ", neutralColor)");
                        //console.log("gradientForDay.addColorStop(1, neutralColor)");
                    }
                }
            } else {
                gradientForMonth.addColorStop(0, neutralColor);
                gradientForMonth.addColorStop(1, neutralColor);
                //console.log("gradientForDay.addColorStop(0, neutralColor)");
                //console.log("gradientForDay.addColorStop(1, colorForSlice)");
            }
        }
        gradients.push(gradientForMonth);
    }
    return gradients;
}
function adjustDataForMonthGradient(start) {
    const week2Start = start.plus({ days: 7 });
    const week3Start = week2Start.plus({ days: 7 });
    const week4Start = week3Start.plus({ days: 7 });

    for (let i = 0; i < gradientDateArray.length; i++) {
        let stop = start;
        if (i === 1) {
            stop = week2Start;
        }
        if (i === 2) {
            stop = week3Start;
        }
        if (i === 3) {
            stop = week4Start
        }

        for (let j = 0; j < gradientDateArray[i].length; j++) {

            const objDateTime = DateTime.fromFormat(gradientDateArray[i][j].date, 'yyyy-MM-dd');
            const diffDays = objDateTime.diff(stop, 'days').days;

            gradientDateArray[i][j].start = (diffDays * 1440) + gradientDateArray[i][j].start;
        }
    }
}
function adjustDataForYearGradient(start) {
    console.log("adjustDataForYearGradient");
    const month2Start = start.plus({ days: 28 });
    const month3Start = month2Start.plus({ days: 28 });
    const month4Start = month3Start.plus({ days: 28 });
    const month5Start = month4Start.plus({ days: 28 });
    const month6Start = month5Start.plus({ days: 28 });
    const month7Start = month6Start.plus({ days: 28 });
    const month8Start = month7Start.plus({ days: 28 });
    const month9Start = month8Start.plus({ days: 28 });
    const month10Start = month9Start.plus({ days: 28 });
    const month11Start = month10Start.plus({ days: 28 });
    const month12Start = month11Start.plus({ days: 28 });

    for (let i = 0; i < gradientDateArray.length; i++) {
        let stop = start;
        if (i === 1) {
            stop = month2Start;
        }
        if (i === 2) {
            stop = month3Start;
        }
        if (i === 3) {
            stop = month4Start;
        }
        if (i === 4) {
            stop = month5Start;
        }
        if (i === 5) {
            stop = month6Start;
        }
        if (i === 6) {
            stop = month7Start;
        }
        if (i === 7) {
            stop = month8Start;
        }
        if (i === 8) {
            stop = month9Start;
        }
        if (i === 9) {
            stop = month10Start;
        }
        if (i === 10) {
            stop = month11Start;
        }
        if (i === 11) {
            stop = month12Start;
        }

        for (let j = 0; j < gradientDateArray[i].length; j++) {

            const objDateTime = DateTime.fromFormat(gradientDateArray[i][j].date, 'yyyy-MM-dd');
            const diffDays = objDateTime.diff(stop, 'days').days;

            gradientDateArray[i][j].start = (diffDays * 1440) + gradientDateArray[i][j].start;
        }
    }

}

//ASK JANSEN WHAT IS WRONG WITH IMPORTING THIS FROM LOG.JS

function seeDetailsLog(dateArray, unit) {
    console.log("seeDetailsLog()");
    console.log("dateArray:", dateArray);
    console.log("unit:", unit);

    const dataLog = document.getElementById("data-log");
    const seeDetailsBtn = document.getElementById("seeDetails");
    let logOpen = false;

    seeDetailsBtn.addEventListener("click", function () {

        if (logOpen === false) {
            dataLog.style.display = "block";
            logOpen = true;
        } else {
            dataLog.style.display = "none";
            logOpen = false;
        }
    })

    function convertMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return DateTime.fromObject({ hour: hours, minute: mins }).toLocaleString(DateTime.TIME_SIMPLE);
    }

    let unitLabel = "";
    if (unit === "week") {
        unitLabel = "Day";
    } else if (unit === "month") {
        unitLabel = "Week";
    } else {
        unitLabel = "Month";
    }

    for (let i = 0; i < dateArray.length; i++) {
        //iterating through each day/week/month
        const newSection = document.createElement("div");
        newSection.classList.add("log-section");
        newSection.style.position = "relative";
        newSection.textContent = unitLabel + " " + (i + 1);
        for (let j = 0; j < dateArray[i].length; j++) {
            let dateEntry;
            let newDate = false;
            //iterating through each slice/day/week within each day/week/month
            //checking if a new element needs to be created for a new day
            if (j === 0) {
                dateEntry = document.createElement("div");
                dateEntry.classList.add("date-entry");
                dateEntry.style.position = "relative";
                dateEntry.textContent = dateArray[i][j].date;
                newDate = true;
            } else if (dateArray[i][j].date !== dateArray[i][j - 1].date) {
                dateEntry = document.createElement("div");
                dateEntry.classList.add("date-entry");
                dateEntry.style.position = "relative";
                dateEntry.textContent = dateArray[i][j].date;
                newDate = true;
            }
            //inputting log elements for the slice
            const logEntry = document.createElement("div");
            logEntry.classList.add("log-entry");
            logEntry.style.position = "relative"

            const coreDiv = document.createElement("div");
            coreDiv.classList.add("core-div");
            coreDiv.style.position = "relative";

            const label = document.createElement("div");
            label.classList.add("log-label");
            label.textContent = dateArray[i][j].name;
            label.style.color = dateArray[i][j].color;

            if (dateArray[i][j].name.length > 15) {
                label.style.fontSize = "0.8em";
            }

            if (dateArray[i][j].name.length > 30) {
                label.style.fontSize = "0.6em";
            }

            let convertedDataPoints = {
                start: convertMinutesToTime(dateArray[i][j].start),
                end: convertMinutesToTime(((dateArray[i][j].start) + (dateArray[i][j].duration)))
            }

            const time = document.createElement("div");
            time.classList.add("log-time-label");
            time.textContent = convertedDataPoints.start + " - " + convertedDataPoints.end;

            const description = document.createElement("div");
            description.classList.add("log-description");

            if (dateArray[i][j].description !== undefined) {
                description.textContent = dateArray[i][j].description;
            }

            const tags = document.createElement("div");
            tags.classList.add("log-tags");

            if (dateArray[i][j].tags !== undefined) {
                for (k = 0; k < dateArray[i][j].tags.length; k++) {
                    const tag = document.createElement("span");
                    tag.classList.add("tag");
                    tag.textContent = dateArray[i][j].tags[k].tagName;
                    tags.appendChild(tag);
                }
            }

            //append all things pertaining to the slice to a log entry
            coreDiv.appendChild(label);
            coreDiv.appendChild(time);
            logEntry.appendChild(coreDiv);
            logEntry.appendChild(description);
            logEntry.appendChild(tags);

            //if a new date has started, append the new date to the section
            if (newDate === true) {
                newSection.appendChild(dateEntry);
            }

            //append the logEntry to the section
            newSection.appendChild(logEntry);
        }

        //append the entire section to the log after each complete "unit"
        dataLog.appendChild(newSection);
    }
}
