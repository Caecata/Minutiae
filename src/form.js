import { tree, select, drag, selectAll } from 'd3'
import * as d3 from 'd3'
console.log(d3); 
import { saveLegendToDatabase, receiveLegendFromDatabase, saveRemoveArray, getRemoveArray, receiveTagsFromDatabase, saveTagsToDatabase } from './firebase/dbHandler.js'

import { closeLegendForms, updateVisualization, removeVisualization, viewTree, chevronRightBtn, angleDownBtn, createClickHandler, createElements, initializeFolders, removeFolders, myLegendBtnFunctions, updateTags } from './mylegendexperience.js' 

import { handleTouchStart, handleTouchEnd, disableSwipeOnApp, enableSwipeOnApp } from './app.js'

import { event } from 'jquery';
import { DateTime } from 'luxon'

export function oneStepForm(legend, tags) {
    console.log("oneStepForm()");

    const formSection = document.getElementById("one-step-form");
    const startTimeInput = document.getElementById("start-time-input-for-one-step-form");
    const startTimeLabel = document.getElementById("start-time-label-for-one-step-form");
    const endTimeInput = document.getElementById("end-time-input-for-one-step-form");
    const endTimeLabel = document.getElementById("end-time-label-for-one-step-form");
    const submitInputs = document.getElementById("submit-inputs");
    const tagDropdownLabel = document.getElementById("tag-dropdown-label"); //might add back or keep removed
    const tagDropdownBtn = document.getElementById("tag-dropdown-btn");
    const tagDropdownContent = document.getElementById("tag-dropdown-content");
    const descriptionInput = document.getElementById("description-input-for-one-step-form");

    const blurredOverlay = document.getElementById("blurred-overlay");
    const closeBtn = document.getElementById("close-form");
    const formBtn = document.getElementById("add-slice-button");

    var isAddFunctionExecuted = false; 
    var logOpen = false;

    //tag checkbox dropdown
    tagDropdownBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var dropdownContent = document.getElementById("tag-dropdown-content");
        dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    })

    //tags and description
    //creating tag dropdown
    tagDropdownBtn.style.display = "inline-block";

    tags.sort((a, b) => {
        const nameA = a.tagName.toLowerCase();
        const nameB = b.tagName.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (let i = 0; i < tags.length; i++) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.classList.add("tag-checkbox");
        checkbox.type = "checkbox";
        checkbox.name = "tag";
        checkbox.value = JSON.stringify(tags[i]);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(tags[i].tagName));

        tagDropdownContent.appendChild(label);
    }
    //create description input

    descriptionInput.style.display = "inline-block";

    var textarea = document.createElement("textarea");
    textarea.name = "description";
    textarea.rows = 2;
    textarea.id = "description-input-field";
    textarea.style.resize = "none";
    textarea.style.width = "100%";
    textarea.style.border = "1px solid black";
    textarea.style.display = "inline-block";

    descriptionInput.appendChild(textarea);
    descriptionInput.appendChild(document.createElement("br"));

    const descriptionInputField = document.getElementById("description-input-field");

    descriptionInputField.addEventListener('input', function () {
        const computedStyle = getComputedStyle(document.documentElement);
        const fontFamily = computedStyle.getPropertyValue('--font-family');
        this.style.fontFamily = fontFamily;
    });

    //Creating dropdown
    const selectElement = document.getElementById("one-step-dropdown");
    const arrayOfOptions = [];

    createDropdownOptions(legend);
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

    for (let i = 0; i < arrayOfOptions.length; i++) {
        if (arrayOfOptions[i].name === "Remaining") {
        } else {
            const option = document.createElement('option');
            option.value = JSON.stringify(arrayOfOptions[i]);
            option.textContent = arrayOfOptions[i].name;
            selectElement.appendChild(option);
        }
    }

    //If "Advanced Selection" is chosen, My Legend page appears.
    selectElement.addEventListener("change", function() {
        if (selectElement.value === "open") {
            console.log("mylegendexperience");
            
            closeLegendForms();
            viewTree();
            myLegendBtnFunctions();
            
            document.getElementById("my-legend").style.display = "block";
            blurredOverlay.style.display = "block";

            document.getElementById("view-log").style.display = "none";

            let logOpen = false;
            let log = document.getElementById("log");
            if (log.style.display == "block") {
                logOpen = true;
            }

            document.getElementById("one-step-form").style.display = "none";
            document.getElementById("log").style.display = "none";

            document.getElementById("close-legend-mobile").addEventListener("click", function(event) {
                document.getElementById("my-legend").style.display = "none";

                if (!logOpen) {
                    document.getElementById("view-log").style.display = "block";
                    document.getElementById("log").style.display = "none";
                } else {
                    document.getElementById("view-log").style.display = "none";
                    document.getElementById("log").style.display = "block";
                }
                    
                document.getElementById("one-step-form").style.display = "block";

                //reset folders so it doesn't double up upon reopening
                removeFolders();
            })

            document.getElementById("close-legend-desktop").addEventListener("click", function(event) {
                document.getElementById("my-legend").style.display = "none";

                if (!logOpen) {
                    document.getElementById("view-log").style.display = "block";
                    document.getElementById("log").style.display = "none";
                } else {
                    document.getElementById("view-log").style.display = "none";
                    document.getElementById("log").style.display = "block";
                }
                    
                document.getElementById("one-step-form").style.display = "block";
                

                //reset folders so it doesn't double up upon reopening
                removeFolders();
            })

            receiveLegendFromDatabase()
                .then((legend) => {
                    updateVisualization(legend, "#tree-container");
                    initializeFolders(legend); 
                    receiveTagsFromDatabase()
                        .then((tags) => {
                        updateTags(tags);
                    })
                })
        }
    })

    //Triggers the add process
    document.getElementById("add-slice-button").addEventListener("click", function () {
        console.log("add-slice-button clicked");

        formBtn.style.display = "none";
        formSection.style.display = "block";
        selectElement.style.display = "inline-block";
        startTimeInput.style.display = "inline-block";
        startTimeLabel.style.display = "inline-block";
        endTimeInput.style.display = "inline-block";
        endTimeLabel.style.display = "inline-block";
        submitInputs.style.display = "inline-block";
        
        blurredOverlay.style.display = "block";
        disableSwipeOnApp();
    })

    closeBtn.addEventListener("click", function(event) {
        event.preventDefault();
        const log = document.getElementById("log");

        formBtn.style.display = "block";
        formSection.style.display = "none";
        selectElement.style.display = "none";
        startTimeInput.style.display = "none";
        startTimeLabel.style.display = "none";
        endTimeInput.style.display = "none";
        endTimeLabel.style.display = "none";
        submitInputs.style.display = "none";

        if (log.style.display == "block") {
            logOpen = true;
        } else {
            logOpen = false;
        }

        if (logOpen == true) {
            blurredOverlay.style.display = "block";
        } else {
            blurredOverlay.style.display = "none";
            enableSwipeOnApp();
        } 
    })

    function createDropdownOptions(data) {
        for (const x of data) {
            const obj = { name: "", uniqueId: "", color: "" }

            obj.name = x.name;
            obj.uniqueId = x.uniqueId;
            obj.color = x.color;

            arrayOfOptions.push(obj);
            if (x.children !== undefined) {
                createDropdownOptions(x.children)
            }
        }
    }
}

export let finalCategoryOption;

export function useOneStepFormForEdit(legend, slice) {
    const formSection = document.getElementById("one-step-form");
    const startTimeInput = document.getElementById("start-time-input-for-one-step-form");
    const startTimeLabel = document.getElementById("start-time-label-for-one-step-form");
    const endTimeInput = document.getElementById("end-time-input-for-one-step-form");
    const endTimeLabel = document.getElementById("end-time-label-for-one-step-form");
    const submitInputs = document.getElementById("submit-inputs");
    const tagDropdownLabel = document.getElementById("tag-dropdown-label"); //might add back or keep removed
    const tagDropdownBtn = document.getElementById("tag-dropdown-btn");
    const tagDropdownContent = document.getElementById("tag-dropdown-content");
    const descriptionInput = document.getElementById("description-input-for-one-step-form");
    const selectElement = document.getElementById("one-step-dropdown");

    const blurredOverlay = document.getElementById("blurred-overlay");
    const formBtn = document.getElementById("add-slice-button");

    //show form for edit

    formBtn.style.display = "none";
    formSection.style.display = "block";
    selectElement.style.display = "inline-block";
    startTimeInput.style.display = "inline-block";
    startTimeLabel.style.display = "inline-block";
    endTimeInput.style.display = "inline-block";
    endTimeLabel.style.display = "inline-block";
    submitInputs.style.display = "inline-block";
    blurredOverlay.style.display = "block";

    //prepopulating time values
    let startTime = convertToTime(slice.start);
    let endTime = convertToTime(slice.start + slice.duration);
    
    if (startTime === "24:00") {
        startTime = "00:00";
    }
    if (endTime === "24:00") {
        endTime = "00:00";
    }

    startTimeInput.value = startTime;
    endTimeInput.value = endTime;

    function convertToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        const time = new Date();
        time.setHours(hours);
        time.setMinutes(mins);
      
        // Format the time as a string in HH:MM format without AM/PM
        const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
        return formattedTime;
    }

    //tags and description
    tagDropdownBtn.style.display = "inline-block";

    //prepopulates tags if there are tags
    if (slice.tags !== undefined) {
        const tagCheckboxes = document.querySelectorAll(".tag-checkbox");
        const tagCheckboxArray = Array.from(tagCheckboxes);

        let tagUidArray = [];
        for (let j = 0; j < slice.tags.length; j++) {
            tagUidArray.push(slice.tags[j].uniqueId);
        }

        tagCheckboxArray.forEach(checkbox => {
            let value = JSON.parse(checkbox.value);
            if (tagUidArray.includes(value.uniqueId)) {
                checkbox.checked = true;
            }
        })
    }

    const descriptionInputField = document.getElementById("description-input-field");
    descriptionInput.style.display = "inline-block";

    //prepopulating description
    if (slice.description) {
        descriptionInputField.value = slice.description;
    } else {
        descriptionInputField.value = '';
    }

    //Creating dropdown
    const arrayOfOptions = [];
    createDropdownOptions(legend);
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

    for (let i = 0; i < arrayOfOptions.length; i++) {
        if (arrayOfOptions[i].name === "Remaining") {
        } else {
            const option = document.createElement('option');
            option.value = JSON.stringify(arrayOfOptions[i]);
            option.textContent = arrayOfOptions[i].name;

            //prepopulating dropdown 
            if (arrayOfOptions[i].uniqueId === slice.uniqueId) {
                option.selected = true;
                console.log("arrayOfOptions[i]:", arrayOfOptions[i]);
            }

            selectElement.appendChild(option);
        }
    }

    function createDropdownOptions(data) {
        for (const x of data) {
            const obj = { name: "", uniqueId: "", color: "" }

            obj.name = x.name;
            obj.uniqueId = x.uniqueId;
            obj.color = x.color;

            arrayOfOptions.push(obj);
            if (x.children !== undefined) {
                createDropdownOptions(x.children)
            }
        }
    }
}



/* 

export function formValidations2(legend, tagsBool, descriptionBool, tags) {
    console.log("formValidations2()");

    var formSection = document.getElementById("multi-step-form");
    var addSliceButton = document.getElementById('add-slice-button');
    var backButton = document.getElementById("back-button");
    var skipButton = document.getElementById("skip");
    var closeButton = document.getElementById("close");

    var categoryInput = document.getElementById("category-input");

    var subcategorySection = document.getElementById("subcategory-section");
    var subcategoryInput = document.getElementById("subcategory-input");

    var tagSection = document.getElementById("tag-section");
    var tagInput = document.getElementById("tag-input");
    
    var descriptionInput = document.getElementById("description-input");
    var submitDescriptionBtn = document.getElementById("submit-description");

    var submitTimeInputs = document.getElementById("submit-time-inputs");

    var selectedCategory;
    var selectedSubcategory;
    var selectedTags = [];
    var description;

    let finalOption;
    var isAddFunctionExecuted = false;
    var currentStep = 0;

    //setting which steps are active based on settings (tagsBool and descriptionBool)
    let currentActiveSteps = [0, 1, 4];
    function setActiveSteps(tagsBool, descriptionBool) {
        if (tagsBool === true) {
            currentActiveSteps.push(2);
        }
        if (descriptionBool === true) {
            currentActiveSteps.push(3);
        }
    }
    setActiveSteps(tagsBool, descriptionBool);

    //if Add process is triggered, make the form appear
    addSliceButton.addEventListener("click", function () {
        if (!isAddFunctionExecuted) {
            populateCategoryOptions();
            formSection.style.display = "block";
            isAddFunctionExecuted = true;
            currentStep = 0;
            updateForm();
        }
    });

    //back button code
    backButton.addEventListener("click", function () {
        event.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep--;
                if (!currentActiveSteps.includes(currentStep)) {
                    currentStep--;
                }
            }
            if (currentStep === 1 && selectedSubcategory === undefined) {
                currentStep--;
            }
            updateForm();
        }
    });

    //skip button code
    skipButton.addEventListener("click", function () {
        event.preventDefault();
        var skipDone = false;
        if (currentStep == 1 && skipDone == false) {
            populateTagOptions();
            currentStep = 2;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep = 3;
                if (!currentActiveSteps.includes(currentStep)) {
                    currentStep = 4;
                } else {
                    populateDescriptionInput();
                }
            }
            updateForm();
            skipDone = true;
        }
        if (currentStep == 2 && skipDone == false) {
            populateDescriptionInput();
            currentStep = 3;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep = 4;
            }
            updateForm();
            skipDone = true;
        }
        if (currentStep == 3 && skipDone == false) {
            currentStep = 4;
            updateForm();
            skipDone = true;
        }
    });

    //close button code
    closeButton.addEventListener("click", function () {
        formSection.style.display = "none";
        isAddFunctionExecuted = false

        clearOptions(categoryInput);
        clearOptions(subcategoryInput);
        clearTagContainer();
        clearOptions(descriptionInput);

        const finalOptionElement = document.querySelector('.final-option');
        if (finalOptionElement) {
            finalOptionElement.parentNode.removeChild(finalOptionElement);
        }

        selectedCategory = '';
        selectedSubcategory = undefined;
        selectedTags = [];
    });

    //when form is submitted, the form will close and reset
    document.getElementById("submit-time-inputs").addEventListener("click", function() {
        formSection.style.display = "none";
        isAddFunctionExecuted = false

        clearOptions(categoryInput);
        clearOptions(subcategoryInput);
        clearTagContainer();
        clearOptions(descriptionInput);
        
        const finalOptionElement = document.querySelector('.final-option');
        if (finalOptionElement) {
            finalOptionElement.parentNode.removeChild(finalOptionElement);
        }

        selectedCategory = '';
        selectedSubcategory = undefined;
        selectedTags = [];
    })
    
    //setting up form based on which step the user is on
    function updateForm() {
        if (currentStep === 0) {
            hideStepsExcept(0, 3);
            backButton.style.display = "none";
            skipButton.style.display = "none";
        } else if (currentStep == 1 || currentStep == 2 || currentStep == 3) {
            backButton.style.display = "block";
            skipButton.style.display = "block";

            if (currentStep == 1) {
                hideStepsExcept(4, 8);
            }
            if (currentStep == 2) {
                hideStepsExcept(9, 14);
            }
            if (currentStep == 3) {
                hideStepsExcept(15, 18);
            }
        } else if (currentStep == 4) {
            hideStepsExcept(19, 25);

            backButton.style.display = "block";
            skipButton.style.display = "none";
        }
    }
    function hideStepsExcept(stepStart, stepEnd) {
        var steps = Array.from(document.getElementsByClassName("step"));
        for (var i = 0; i < steps.length; i++) {
            if (i >= stepStart && i <= stepEnd) {
                steps[i].classList.remove("hidden");
                steps[i].classList.add("visible");
            } else {
                steps[i].classList.remove("visible");
                steps[i].classList.add("hidden");
            }
        }
    }
    function clearOptions(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    function clearTagContainer() {
        let div = document.getElementById("tag-container");
        let spans = div.getElementsByTagName("span");

        for (let i = spans.length - 1; i >= 0; i--) {
            let span = spans[i];
            span.parentNode.removeChild(span);
        }
    }
    //creating radio input options and description input
    function populateCategoryOptions() {
        for (var i = 0; i < legend.length; i++) {
            if (legend[i].name === "Remaining") {

            } else {
                var option = document.createElement("input");
                option.type = "radio";
                option.setAttribute("data-option-id", legend[i].uniqueId);
                option.name = "category";
                option.value = JSON.stringify(legend[i]);

                var label = document.createElement("label");
                label.textContent = legend[i].name;

                categoryInput.appendChild(option);
                categoryInput.appendChild(label);
                categoryInput.appendChild(document.createElement("br"));
            }
        }
    }
    function populateMoreOptions(selectedOption) {
        clearOptions(subcategoryInput);

        if (selectedOption.children.length === 0) {
            //I don't think it ever runs this code but just have it here for now
        } else {
            for (var i = 0; i < selectedOption.children.length; i++) {
                var option = document.createElement("input");
                option.type = "radio";
                option.setAttribute("data-option-id", selectedOption.children[i].uniqueId);
                option.name = "subcategory";
                option.value = JSON.stringify(selectedOption.children[i]);

                var label = document.createElement("label");
                label.textContent = selectedOption.children[i].name;

                subcategoryInput.appendChild(option);
                subcategoryInput.appendChild(label);
                subcategoryInput.appendChild(document.createElement("br"));
            }

        }
    }
    function populateTagOptions() {
        clearOptions(tagInput);
        for (var i = 0; i < tags.length; i++) {
            var option = document.createElement("input");
            option.type = "checkbox";
            option.name = "tag";
            option.value = JSON.stringify(tags[i]);

            var label = document.createElement("label");
            label.textContent = tags[i].tagName;

            tagInput.appendChild(option);
            tagInput.appendChild(label);
            tagInput.appendChild(document.createElement("br"));
        }
    }
    function populateDescriptionInput() {
        clearOptions(descriptionInput);
        var textarea = document.createElement("textarea");
        textarea.name = "description";
        textarea.rows = 2;
        textarea.id = "description-input-field";
        textarea.style.resize = "none";
        textarea.style.width = "100%";
        textarea.style.display = "block";

        var label = document.createElement("label");
        label.textContent = "Description:";

        descriptionInput.appendChild(label);
        descriptionInput.appendChild(textarea);
        descriptionInput.appendChild(document.createElement("br"));

        const descriptionInputField = document.getElementById("description-input-field");

        descriptionInputField.addEventListener('input', function () {
            const computedStyle = getComputedStyle(document.documentElement);
            const fontFamily = computedStyle.getPropertyValue('--font-family');
            this.style.fontFamily = fontFamily;
        });
    }
    //change steps based on event listeners
    categoryInput.addEventListener("change", function () {
        var selectedOption = document.querySelector('input[name="category"]:checked');
        if (selectedOption) {
            selectedCategory = JSON.parse(selectedOption.value);
        }
        console.log('selectedCategory:', selectedCategory);
        if (selectedCategory.children !== undefined) {
            populateMoreOptions(selectedCategory);
            currentStep = 1;
            updateForm();
        } else {

            finalCategoryOption = selectedCategory;

            currentStep = 2;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep++;
                if (!currentActiveSteps.includes(currentStep)) {
                    currentStep++
                } else {
                    populateDescriptionInput();
                }
            } else {
                populateTagOptions();
            }
            updateForm();
        }
        /* }
        console.log("childrenBool:", childrenBool);
        if (childrenBool) { 

    });
    subcategorySection.addEventListener("change", function () {
        var selectedOption2 = document.querySelector('input[name="subcategory"]:checked');
        if (selectedOption2) {
            selectedSubcategory = JSON.parse(selectedOption2.value);
        }
        if (selectedSubcategory.children !== undefined) {
            populateMoreOptions(selectedSubcategory);
        } else {
            finalCategoryOption = selectedSubcategory;

            populateTagOptions();
            currentStep = 2;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep++;
                if (!currentActiveSteps.includes(currentStep)) {
                    currentStep++
                } else {
                    populateDescriptionInput();
                }
            }
            updateForm();
        }
    })
    tagSection.addEventListener("change", function () { //note that tagSection has the addEventListener and not tagInput 

        let tagContainer = document.getElementById("tag-container");

        var checkedCheckboxes = document.querySelectorAll('input[name="tag"]:checked');
        selectedTags = [];

        clearTagContainer();

        checkedCheckboxes.forEach(function (checkbox) {
            let selectedTag = JSON.parse(checkbox.value);
            selectedTags.push(selectedTag);

            const newTag = document.createElement("span");
            newTag.classList.add("tag");
            newTag.textContent = selectedTag.tagName;
            newTag.setAttribute("id", `tag-${selectedTag.uniqueId}`)
            tagContainer.appendChild(newTag);
        });

        const uncheckedCheckboxes = document.querySelectorAll('input[name="tag"]:not(:checked)');

        uncheckedCheckboxes.forEach(function (uncheckedCheckbox) {
            const tagToRemove = JSON.parse(uncheckedCheckbox.value);
            const tagToRemoveUid = tagToRemove.uniqueId;
            const tagElementToRemove = document.getElementById(`tag-${tagToRemoveUid}`);
            if (tagElementToRemove) {
                tagContainer.removeChild(tagElementToRemove);

            }
            selectedTags = selectedTags.filter(function (tag) {
                return tag.uniqueId !== tagToRemoveUid;
            })

        })

        const nextAfterTags = document.getElementById("next-in-tag");

        nextAfterTags.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("selectedTags:", selectedTags);
            populateDescriptionInput();
            tagContainer = "";
            currentStep = 3;
            if (!currentActiveSteps.includes(currentStep)) {
                currentStep++;
            }
            updateForm();
        });

    });
    submitDescriptionBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var selectedOption4 = document.querySelector('input[name="description"]');
        if (selectedOption4) {
            description = selectedOption4.value;
        }
        currentStep = 4;
        updateForm();
    })
} */