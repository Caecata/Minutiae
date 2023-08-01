import { useOneStepFormForEdit } from './form.js'
import { receiveSettingsFromDatabase, receiveTagsFromDatabase } from './firebase/dbHandler.js'
import { deleteSlice } from './app.js'

import { DateTime } from 'luxon';

export function createLog(detailsArray2, current) {
    if (detailsArray2.length === 1 && detailsArray2[0].name === "Remaining") {
    } else {
        const logBtn = document.getElementById("view-log");
        const log = document.getElementById("log");
        let logOpen = false;

        logBtn.addEventListener("click", function () {
            console.log("logBtn clicked");

            if (logOpen === false) {
                log.style.display = "block";
                logOpen = true;
            } else {
                log.style.display = "none";
                logOpen = false;
            }
        })

        // Convert start and duration properties to readable times

        function convertMinutesToTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return DateTime.fromObject({ hour: hours, minute: mins }).toLocaleString(DateTime.TIME_SIMPLE);
        }

        const convertedDataPoints = detailsArray2.map(({ start, duration }) => ({
            start: convertMinutesToTime(start),
            end: convertMinutesToTime(start + duration)
        }));

        const createClickHandler = (clickData, clickedOn) => {
            return function () {
                clickedOn(clickData);
            };
        };

        //create elements

        for (let i = 0; i < detailsArray2.length; i++) {
            if (detailsArray2[i].name === "Remaining") {

            } else {
                const logEntry = document.createElement("div");
                logEntry.classList.add("log-entry");
                logEntry.style.position = "relative";
                logEntry.style.backgroundColor = detailsArray2[i].color;
                //logEntry.style.width = "100%";
                //logEntry.value = JSON.stringify(detailsArray2[i]);

                const coreDiv = document.createElement("div");
                coreDiv.classList.add("core-div");
                coreDiv.style.position = "relative";

                const label = document.createElement("div");
                label.classList.add("log-label");
                label.textContent = detailsArray2[i].name;
                //label.style.color = detailsArray2[i].color;
                label.style.color = "black";

                if (detailsArray2[i].name.length > 15) {
                    label.style.fontSize = "0.8em";
                }

                if (detailsArray2[i].name.length > 30) {
                    label.style.fontSize = "0.6em";
                }

                const time = document.createElement("div");
                time.classList.add("log-time-label");
                time.textContent = convertedDataPoints[i].start + " - " + convertedDataPoints[i].end;

                const description = document.createElement("div");
                description.classList.add("log-description");

                if (detailsArray2[i].description !== undefined) {
                    description.textContent = detailsArray2[i].description;
                }

                const tags = document.createElement("div");
                tags.classList.add("log-tags");

                if (detailsArray2[i].tags !== undefined) {
                    for (let j = 0; j < detailsArray2[i].tags.length; j++) {
                        const tag = document.createElement("span");
                        tag.classList.add("tag");
                        tag.textContent = detailsArray2[i].tags[j].tagName;
                        tags.appendChild(tag);
                    }
                }

                const editMini = document.createElement("button");
                editMini.classList.add("log-edit");
                if (document.body.classList.contains("dark-mode")) {
                    editMini.classList.add("dark-mode");
                } else if (document.body.classList.contains("light-mode")) {
                    editMini.classList.add("light-mode");
                }

                const icon = document.createElement("i");
                icon.classList.add("fas", "fa-pen");

                const clickHandler = createClickHandler(detailsArray2[i], editBtn);
                editMini.addEventListener('click', clickHandler);

                editMini.appendChild(icon);
                logEntry.appendChild(editMini);

                const deleteMini = document.createElement("button");
                deleteMini.classList.add("log-delete");
                if (document.body.classList.contains("dark-mode")) {
                    deleteMini.classList.add("dark-mode");
                } else if (document.body.classList.contains("light-mode")) {
                    deleteMini.classList.add("light-mode");
                }

                const icon2 = document.createElement("i");
                icon2.classList.add("fas", "fa-delete-left");

                const clickHandler2 = createClickHandler(detailsArray2[i], deleteBtn);
                deleteMini.addEventListener('click', clickHandler2);

                deleteMini.appendChild(icon2);
                logEntry.appendChild(deleteMini);

                coreDiv.appendChild(label);
                coreDiv.appendChild(time);
                logEntry.appendChild(coreDiv);
                logEntry.appendChild(description);
                logEntry.appendChild(tags);


                log.appendChild(logEntry);
            }
        }

    }
}

export function updateLog(detailsArray2, current) {
    const log = document.getElementById("log");

    log.innerHTML = '';

    createLog(detailsArray2, current);
}
const editBtn = (clickData) => {
    console.log("editBtn()");

    console.log("clickData:", clickData);

    receiveSettingsFromDatabase()
        .then((settings) => {
            receiveTagsFromDatabase()
                .then((tags) => {
                    useOneStepFormForEdit(legend, settings.tagsBool, settings.descriptionBool, tags, clickData);
                })

        });
}

const deleteBtn = (clickData) => {
    deleteSlice(clickData);
    //console.log('clickData:', clickData);
}

