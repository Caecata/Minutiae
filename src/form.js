import { DateTime } from 'luxon'
/* export function formValidations() {
    console.log("formValidations()");
    var formSection = document.getElementById("form");
    var addSliceButton = document.getElementById('add-slice-button');
    var backButton = document.getElementById("back-button");
    var skipButton = document.getElementById("skip");
    var closeButton = document.getElementById("close");

    var categorySection = document.getElementById("category-section");
    var categoryLabel = document.getElementById("category");
    var categoryInput = document.getElementById("category-input");
    var addCategoryBtn = document.getElementById("add-category");

    var subcategorySection = document.getElementById("subcategory-section");
    var subcategoryLabel = document.getElementById("subcategory");
    var subcategoryInput = document.getElementById("subcategory-input");
    var addSubcategoryBtn = document.getElementById("add-subcategory");

    var locationSection = document.getElementById("location-section");
    var locationLabel = document.getElementById("location-label");
    var locationInput = document.getElementById("location-input");
    var addLocationBtn = document.getElementById("add-location");

    var descriptionSection = document.getElementById("description-section");
    var descriptionLabel = document.getElementById("descriptional-label");
    var descriptionInput = document.getElementById("description-input");
    var submitDescriptionBtn = document.getElementById("submit-description");

    var timeInputSection = document.getElementById("time-input-selection");
    var timeInputSelectionLabel = document.getElementById("select-time-input-label");
    var startingBtn = document.getElementById("starting");
    var finishingBtn = document.getElementById("finishing");
    var startAndFinishBtn = document.getElementById("start-and-finish");
    var startAndDurationBtn = document.getElementById("start-and-duration");
    var startTimeAndOngoingBtn = document.getElementById("start-time-and-ongoing");

    var startTimeLabel = document.getElementById("start-time-label");
    var startTimeInput = document.getElementById("start-time-input");
    var endTimeInput = document.getElementById("end-time-input");
    var durationInput = document.getElementById("duration-input");
    var unitInput = document.getElementById("unit");
    var submitTimeInputs = document.getElementById("submit-time-inputs");

    var confirmationSection = document.getElementById("confirmation-section");
    var confirmationLabel = document.getElementById("confirmation-label");
    var confirmation = document.getElementById("confirmation");
    var startOrFinish = document.getElementById("start-or-finish");
    var categoryName = document.getElementById("category-name");
    var subcategoryName = document.getElementById("subcategory-name");
    var locationName = document.getElementById("location-name");
    var timeSpan = document.getElementById("time-span");
    var yesBtn = document.getElementById("yes");
    var noBtn = document.getElementById("no");

    var startingBtnPressed = false;
    var finishingBtnPressed = false;
    var startAndFinishBtnPressed = false;
    var startAndDurationBtnPressed = false;
    var startTimeAndOngoingBtnPressed = false;

    var selectedCategory;
    var selectedSubcategory;
    var selectedLocation;
    var description;
    var isAddFunctionExecuted = false;
    var currentStep = 0;

    let createMoreOptions = false;

    //back button code
    backButton.addEventListener("click", function () {
        event.preventDefault();
        if (currentStep > 0) {
            currentStep--;
            updateForm();
        }
    });

    function updateForm() {
        if (currentStep === 0) {
            hideStepsExcept(0, 3);
            backButton.style.display = "none";
            skipButton.style.display = "none";
        } else if (currentStep == 1 || currentStep == 2 || currentStep == 3) {
            backButton.style.display = "block";
            skipButton.style.display = "block";

            startingBtn.style.display = "none";
            finishingBtn.style.display = "none";
            startAndFinishBtn.style.display = "none";
            startAndDurationBtn.style.display = "none";
            startTimeAndOngoingBtn.style.display = "none";

            if (currentStep == 1) {
                hideStepsExcept(4, 7);
            }
            if (currentStep == 2) {
                hideStepsExcept(8, 11);
            }
            if (currentStep == 3) {
                hideStepsExcept(12, 15);
            }
        } else if (currentStep == 4) {
            hideStepsExcept(16, 22);

            backButton.style.display = "block";
            skipButton.style.display = "none";

            startingBtn.style.display = "block"; //why do these have to be listed??
            finishingBtn.style.display = "block";
            startAndFinishBtn.style.display = "block";
            startAndDurationBtn.style.display = "block";
            startTimeAndOngoingBtn.style.display = "block";
        } else if (currentStep == 5 || currentStep == 6) {
            if (currentStep == 5) {
                if (startAndFinishBtnPressed) {
                    hideStepsExcept(23, 26, 30);
                }
                if (startAndDurationBtnPressed) {
                    hideStepsExcept(23, 24, 27, 28, 29, 30)
                }
                if (startTimeAndOngoingBtnPressed) {
                    hideStepsExcept(23, 24, 30);
                }
            }
            if (currentStep == 6) {
                hideStepsExcept(31, 35);
            }

            backButton.style.display = "block";
            skipButton.style.display = "none";

            startingBtn.style.display = "none"; //why do these have to be listed?
            finishingBtn.style.display = "none";
            startAndFinishBtn.style.display = "none";
            startAndDurationBtn.style.display = "none";
            startTimeAndOngoingBtn.style.display = "none";
        }
    }

    //skip button code
    skipButton.addEventListener("click", function () {
        event.preventDefault();
        var skipDone = false;
        if (currentStep == 1 && skipDone == false) {
            populateLocationOptions();
            currentStep = 2;
            updateForm();
            skipDone = true;
        }
        if (currentStep == 2 && skipDone == false) {
            populateDescriptionInput();
            currentStep = 3;
            updateForm();
            skipDone = true;
        }
        if (currentStep == 3 && skipDone == false) {
            currentStep = 4;
            updateForm();
            skipDone = true;
        }
    });

    closeButton.addEventListener("click", function () {
        formSection.style.display = "none";
        isAddFunctionExecuted = false

        clearOptions(categoryInput);
        clearOptions(subcategoryInput);
        clearOptions(locationInput);
        clearOptions(descriptionInput);

        selectedCategory = '';
        selectedSubcategory = '';
        selectedLocation = '';
    });

    function clearOptions(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function hideStepsExcept(stepStart, stepEnd, extra, extra2, extra3, extra4, extra5) {
        var steps = Array.from(document.getElementsByClassName("step"));
        for (var i = 0; i < steps.length; i++) {
            if (i >= stepStart && i <= stepEnd || i == extra || i == extra2 || i == extra3 || i == extra4 || i == extra5) {
                steps[i].classList.remove("hidden");
                steps[i].classList.add("visible");
            } else {
                steps[i].classList.remove("visible");
                steps[i].classList.add("hidden");
            }
        }
    }

    function populateCategoryOptions() {
        for (var i = 0; i < legend.length - 1; i++) {
            var option = document.createElement("input");
            option.type = "radio";
            option.name = "category";
            option.value = legend[i].name;

            var label = document.createElement("label");
            label.textContent = legend[i].name;

            categoryInput.appendChild(option);
            categoryInput.appendChild(label);
            categoryInput.appendChild(document.createElement("br"));
        }
    }

    addSliceButton.addEventListener("click", function () {
        if (!isAddFunctionExecuted) {
            populateCategoryOptions();
            formSection.style.display = "block";
            isAddFunctionExecuted = true;
            currentStep = 0;
            updateForm();
        }
    });

    categoryInput.addEventListener("change", function () {
        var selectedOption = document.querySelector('input[name="category"]:checked');
        if (selectedOption) {
            selectedCategory = selectedOption.value;
        }
        populateSubcategoryOptions();
        currentStep = 1;
        updateForm();

    });

    function populateSubcategoryOptions() {
        clearOptions(subcategoryInput);
        var selectedCategoryObj = legend.find(item => item.name === selectedCategory);
        //var subcategories = selectedCategoryObj.subcategory;
        var subcategories = selectedCategoryObj.children.map(child => child.name);

        if (subcategories.length === 0) {
            //
        } else {
            for (var i = 0; i < subcategories.length; i++) {
                var option = document.createElement("input");
                option.type = "radio";
                option.name = "subcategory";
                option.value = subcategories[i];

                var label = document.createElement("label");
                label.textContent = subcategories[i];

                subcategoryInput.appendChild(option);
                subcategoryInput.appendChild(label);
                subcategoryInput.appendChild(document.createElement("br"));
            }
        }
    }

    function populateLocationOptions() {
        clearOptions(locationInput);
        for (var i = 0; i < locations.length; i++) {
            var option = document.createElement("input");
            option.type = "radio";
            option.name = "location";
            option.value = locations[i];

            var label = document.createElement("label");
            label.textContent = locations[i];

            locationInput.appendChild(option);
            locationInput.appendChild(label);
            locationInput.appendChild(document.createElement("br"));
        }
    }

    subcategorySection.addEventListener("change", function () {
        var selectedOption2 = document.querySelector('input[name="subcategory"]:checked');
        if (selectedOption2) {
            selectedSubcategory = selectedOption2.value;
        }

        populateLocationOptions();
        currentStep = 2;
        updateForm();
    })

    function populateDescriptionInput() {
        clearOptions(descriptionInput);
        var input = document.createElement("input");
        input.type = "text";
        input.name = "description";

        var label = document.createElement("label");
        label.textContent = "Description:";

        descriptionInput.appendChild(label);
        descriptionInput.appendChild(input);
        descriptionInput.appendChild(document.createElement("br"));
    }

    locationSection.addEventListener("change", function () { //note that locationSection has the addEventListener and not locationInput
        var selectedOption3 = document.querySelector('input[name="location"]:checked');
        if (selectedOption3) {
            selectedLocation = selectedOption3.value;
        }
        populateDescriptionInput();
        currentStep = 3;
        updateForm();
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

    submitTimeInputs.addEventListener("click", function () {
        event.preventDefault();
        populateConfirmation();
        currentStep = 6;
        updateForm();
        startAndFinishBtnPressed = false;
        startAndDurationBtnPressed = false;
        startTimeAndOngoingBtnPressed = false;
    })

    function populateConfirmation() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();

        console.log("selectedCategory, selectedSubcategory, selectedLocation:", selectedCategory, selectedSubcategory, selectedLocation);

        if (startingBtnPressed) {
            startOrFinish.innerHTML = "started";
            categoryName.innerHTML = "[" + selectedCategory + "] - ";
            subcategoryName.innerHTML = "[" + selectedSubcategory + "]";
            locationName.innerHTML = "at [" + selectedLocation + "]";
            timeSpan.innerHTML = "since " + hours + ":" + minutes;
        }
        if (finishingBtnPressed) {
            startOrFinish.innerHTML = "finished";
            categoryName.innerHTML = "[" + selectedCategory + "] - ";
            subcategoryName.innerHTML = "[" + selectedSubcategory + "]";
            locationName.innerHTML = "at [" + selectedLocation + "]";
            timeSpan.innerHTML = "at " + hours + ":" + minutes;
        }
        if (startAndFinishBtnPressed) {
            startOrFinish.innerHTML = "were";
            categoryName.innerHTML = "[" + selectedCategory + "] - ";
            subcategoryName.innerHTML = "[" + selectedSubcategory + "]";
            locationName.innerHTML = "at [" + selectedLocation + "]";
            timeSpan.innerHTML = "from " + startTimeInput.value + " to " + endTimeInput.value;
        }
        if (startAndDurationBtnPressed) {
            startOrFinish.innerHTML = "started";
            categoryName.innerHTML = "[" + selectedCategory + "] - ";
            subcategoryName.innerHTML = "[" + selectedSubcategory + "]";
            locationName.innerHTML = "at [" + selectedLocation + "]";
            timeSpan.innerHTML = ", beginning at " + startTimeInput.value + " and lasting for a duration of " + durationInput.value + " " + unitInput.value;
        }
        if (startTimeAndOngoingBtnPressed) {
            startOrFinish.innerHTML = "have been";
            categoryName.innerHTML = "[" + selectedCategory + "] - ";
            subcategoryName.innerHTML = "[" + selectedSubcategory + "]";
            locationName.innerHTML = "at [" + selectedLocation + "]";
            timeSpan.innerHTML = "since " + startTimeInput.value;
        }

    }

    startingBtn.addEventListener("click", function () {
        event.preventDefault();
        startingBtnPressed = true;
        populateConfirmation();
        currentStep = 6;
        updateForm();
        startingBtnPressed = false;
    })
    finishingBtn.addEventListener("click", function () {
        event.preventDefault();
        finishingBtnPressed = true;
        populateConfirmation();
        currentStep = 6;
        updateForm();
        finishingBtnPressed = false;
    })

    startAndFinishBtn.addEventListener("click", function () {
        event.preventDefault();
        startAndFinishBtnPressed = true;
        currentStep = 5
        updateForm();
    })
    startAndDurationBtn.addEventListener("click", function () {
        event.preventDefault();
        startAndDurationBtnPressed = true;
        currentStep = 5;
        updateForm();

        //
    })
    startTimeAndOngoingBtn.addEventListener("click", function () {
        event.preventDefault();
        startTimeAndOngoingBtnPressed = true;
        currentStep = 5;
        updateForm();
        //
    })
} */

export function oneStepForm(legend, tagsBool, descriptionBool, tags) {
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

    var isAddFunctionExecuted = false;

    //tag checkbox dropdown
    tagDropdownBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var dropdownContent = document.getElementById("tag-dropdown-content");
        dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    })

    //tags and description
    if (tagsBool === true) {
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
            checkbox.type = "checkbox";
            checkbox.name = "tag";
            checkbox.value = JSON.stringify(tags[i]);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(tags[i].tagName));

            tagDropdownContent.appendChild(label);
        }
    } else {
        tagDropdownBtn.style.display = "none";
        tagDropdownLabel.style.display = "none";
    }
    if (descriptionBool === true) {
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

        /* var label = document.createElement("label");
        label.textContent = "Description:";
        label.style.display = "inline-block";
        label.style.textIndent = "10px"; */

        /* descriptionInput.appendChild(label); */
        descriptionInput.appendChild(textarea);
        descriptionInput.appendChild(document.createElement("br"));

        const descriptionInputField = document.getElementById("description-input-field");

        descriptionInputField.addEventListener('input', function () {
            const computedStyle = getComputedStyle(document.documentElement);
            const fontFamily = computedStyle.getPropertyValue('--font-family');
            this.style.fontFamily = fontFamily;
        });

    } else {
        descriptionInput.style.display = "none";
    }

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

    //Triggers the add process
    document.getElementById("add-slice-button").addEventListener("click", function () {
        console.log("add-slice-button clicked");

        if (!isAddFunctionExecuted) {
            formSection.style.display = "block";
            selectElement.style.display = "inline-block";
            startTimeInput.style.display = "inline-block";
            startTimeLabel.style.display = "inline-block";
            endTimeInput.style.display = "inline-block";
            endTimeLabel.style.display = "inline-block";
            submitInputs.style.display = "inline-block";
            
            isAddFunctionExecuted = true;
        } else {
            formSection.style.display = "none";
            selectElement.style.display = "none";
            startTimeInput.style.display = "none";
            startTimeLabel.style.display = "none";
            endTimeInput.style.display = "none";
            endTimeLabel.style.display = "none";
            submitInputs.style.display = "none";

            isAddFunctionExecuted = false;
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

export function formValidations2(legend, tagsBool, descriptionBool, tags) {
    console.log("formValidations2()");

    var formSection = document.getElementById("multi-step-form");
    var addSliceButton = document.getElementById('add-slice-button');
    var backButton = document.getElementById("back-button");
    var skipButton = document.getElementById("skip");
    var closeButton = document.getElementById("close");

    //var categorySection = document.getElementById("category-section");
    var categoryInput = document.getElementById("category-input");
    //var addCategoryBtn = document.getElementById("add-category");

    var subcategorySection = document.getElementById("subcategory-section");
    var subcategoryInput = document.getElementById("subcategory-input");
    //var addSubcategoryBtn = document.getElementById("add-subcategory");

    var tagSection = document.getElementById("tag-section");
    var tagInput = document.getElementById("tag-input");
    //var addTagBtn = document.getElementById("add-tag");
    //let tagContainer = document.getElementById("tag-container");

    //var descriptionSection = document.getElementById("description-section");
    var descriptionInput = document.getElementById("description-input");
    var submitDescriptionBtn = document.getElementById("submit-description");

    //var timeInputSection = document.getElementById("time-input-section");
    //var startTimeInput = document.getElementById("start-time-input");
    //var endTimeInput = document.getElementById("end-time-input");
    var submitTimeInputs = document.getElementById("submit-time-inputs");

    //var categoryName = document.getElementById("category-name");
    //var subcategoryName = document.getElementById("subcategory-name");
    //var tagName = document.getElementById("tag-name");

    var selectedCategory;
    var selectedSubcategory;
    var selectedTags = [];
    var description;
    /* var startTime;
    var endTime;
    */

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
        if (childrenBool) { */

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
}

export function useOneStepFormForEdit(legend, tagsBool, descriptionBool, tags, slice) {

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

    //show form for edit

    formSection.style.display = "block";
    selectElement.style.display = "block";
    startTimeInput.style.display = "block";
    startTimeLabel.style.display = "block";
    endTimeInput.style.display = "block";
    endTimeLabel.style.display = "block";
    submitInputs.style.display = "block";

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

    //tag checkbox dropdown
    tagDropdownBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var dropdownContent = document.getElementById("tag-dropdown-content");
        dropdownContent.style.display = (dropdownContent.style.display === "block") ? "none" : "block";

    })

    //tags and description
    if (tagsBool === true) {
        //creating tag dropdown

        tagDropdownBtn.style.display = "block";

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

        //prepopulates tags if there are tags
        if (slice.tags !== undefined) {
            let tagUidArray = [];
            for (let j = 0; j < slice.tags.length; j++) {
                tagUidArray.push(slice.tags[j].uniqueId);
            }
            for (let i = 0; i < tags.length; i++) {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "tag";
                checkbox.value = JSON.stringify(tags[i]);

                if (tagUidArray.includes(tags[i].uniqueId)) {
                    checkbox.checked = true;
                }
    
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(tags[i].tagName));
    
                tagDropdownContent.appendChild(label);
            }
            //else will populate tags as normal options
        } else {
            for (let i = 0; i < tags.length; i++) {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "tag";
                checkbox.value = JSON.stringify(tags[i]);
    
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(tags[i].tagName));
    
                tagDropdownContent.appendChild(label);
            }
        }

    } else {
        tagDropdownBtn.style.display = "none";
        tagDropdownLabel.style.display = "none";
    }
    if (descriptionBool === true) {
        descriptionInput.style.display = "block";

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

        //prepopulating description
        if (slice.description) {
            descriptionInputField.value = slice.description;
            descriptionInputField.dispatchEvent(new Event('input'));
        }
        
    } else {
        descriptionInput.style.display = "none";
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