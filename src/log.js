import { useOneStepFormForEdit } from './form.js'
import { receiveSettingsFromDatabase, receiveTagsFromDatabase, receiveLegendFromDatabase } from './firebase/dbHandler.js'
import { deleteSlice } from './app.js'

import { DateTime } from 'luxon';

export function createLog(detailsArray2, current) {
    const logBtn = document.getElementById("view-log");
    const log = document.getElementById("log");
    const blurredOverlay = document.getElementById("blurred-overlay");
    const closeBtn = document.getElementById("close-log");
    //let logOpen = false;
    let formOpen = false;

    logBtn.addEventListener("click", function () {
        console.log("logBtn clicked");

        logBtn.style.display = "none";
        log.style.display = "block";
        blurredOverlay.style.display = "block";
    })

    closeBtn.addEventListener("click", function(event) {
        event.preventDefault();

        const form = document.getElementById("one-step-form");

        logBtn.style.display = "block";
        log.style.display = "none";

        if (form.style.display == "block") {
            formOpen = true;
        } else {
            formOpen = false;
        }

        console.log("formOpen:", formOpen);

        if (formOpen == true) {
            blurredOverlay.style.display = "block";
        } else {
            blurredOverlay.style.display = "none";
        }
    }) 

    if (detailsArray2.length === 1 && detailsArray2[0].name === "Remaining") {
    } else {
        
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
            let overflowBool = false;
            if (detailsArray2[i].name === "Remaining") {

            } else {
                const logEntry = document.createElement("div");
                logEntry.classList.add("log-entry");
                logEntry.style.position = "relative";
                logEntry.style.backgroundColor = detailsArray2[i].color;
                //logEntry.value = JSON.stringify(detailsArray2[i]);

                const coreDiv = document.createElement("div");
                coreDiv.classList.add("core-div");
                coreDiv.style.position = "relative";

                const label = document.createElement("div");
                label.classList.add("log-label");
                label.textContent = detailsArray2[i].name;
                label.style.color = "black";

                const overflowContainer = document.createElement("div");
                overflowContainer.classList.add("overflow-container");

                if (detailsArray2[i].name.length > 15) {
                    overflowBool = true;

                    label.classList.add("overflow");

                    overflowContainer.appendChild(label);
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
                editMini.style.display = "none";
                editMini.classList.add("log-edit");
                if (document.body.classList.contains("dark-mode")) {
                    editMini.classList.add("dark-mode");
                } else if (document.body.classList.contains("light-mode")) {
                    editMini.classList.add("light-mode");
                }
                editMini.textContent = "Edit";

                const icon = document.createElement("i");
                icon.classList.add("fas", "fa-pen");
                icon.style.margin = "0.2em";

                const clickHandler = createClickHandler(detailsArray2[i], editBtn);
                editMini.addEventListener('click', clickHandler);

                editMini.appendChild(icon);
                logEntry.appendChild(editMini);

                const deleteMini = document.createElement("button");
                deleteMini.style.display = "none";
                deleteMini.classList.add("log-delete");
                if (document.body.classList.contains("dark-mode")) {
                    deleteMini.classList.add("dark-mode");
                } else if (document.body.classList.contains("light-mode")) {
                    deleteMini.classList.add("light-mode");
                }
                deleteMini.textContent = "Delete";

                const icon2 = document.createElement("i");
                icon2.classList.add("fas", "fa-delete-left");
                icon2.style.margin = "0.2em";

                const clickHandler2 = createClickHandler(detailsArray2[i], deleteBtn);
                deleteMini.addEventListener('click', clickHandler2);

                deleteMini.appendChild(icon2);
                logEntry.appendChild(deleteMini);

                const moreOptionsBtn = document.createElement("button");
                moreOptionsBtn.classList.add("log-more-options");

                const icon3 = document.createElement("i");
                icon3.classList.add("fa-solid", "fa-circle-chevron-right");
                icon3.style.color = "#000000";

                let optionsOpen = false;
                
                moreOptionsBtn.addEventListener('click', function() {
                    if (optionsOpen) {
                        coreDiv.style.width = "90%";
                        deleteMini.style.display = "none";
                        editMini.style.display = "none";
                        time.style.display = "block";
                        optionsOpen = false;
                    } else {
                        coreDiv.style.width = "50%";
                        deleteMini.style.display = "block";
                        editMini.style.display = "block";
                        time.style.display = "none";
                        optionsOpen = true;
                    }
                });

                moreOptionsBtn.appendChild(icon3);
                logEntry.appendChild(moreOptionsBtn);

                if (overflowBool) {
                    coreDiv.appendChild(overflowContainer);
                } else {
                    coreDiv.appendChild(label);
                }
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

    const childrenToRemove = Array.from(log.children).filter(child => {
        return !(child.id === "log-name" || child.id === "close-log");
    });

    childrenToRemove.forEach(child => {
        log.removeChild(child);
    })

    createLog(detailsArray2, current);
}
const editBtn = (clickData) => {
    console.log("editBtn()");
    console.log("clickData:", clickData);

    receiveLegendFromDatabase()
        .then((receivedLegend) => {
            receiveSettingsFromDatabase()
            .then((settings) => {
                receiveTagsFromDatabase()
                    .then((tags) => {
                        useOneStepFormForEdit(receivedLegend, clickData);
                    })
            });
        })
}

const deleteBtn = (clickData) => {
    deleteSlice(clickData);
}



