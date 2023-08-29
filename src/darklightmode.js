//import {toggleRemaining} from './app.js'

export function initializeDarkLightMode() {
    //Script for Dark Mode and Light Mode

    const modeSwitcherBtn = document.getElementById('mode-switcher');
    const logBtn = document.getElementById("view-log");
    const editBtn = document.getElementById("edit");
    const deleteBtn = document.getElementById("delete");
    const menuBtn = document.getElementById('menu');
    const modeText = modeSwitcherBtn.querySelector('.mode-text');
    const navBar = document.getElementById('navigationbar');
    const addBtn = document.getElementById('add-slice-button');
    const today = document.getElementById('date');
    const dayOfWeek = document.getElementById('dayOfWeek');
    const longDateDay = document.getElementById('long-date-day');
    const leftArrow = document.getElementById('day-back');
    const rightArrow = document.getElementById('day-forward');
    const overlay = document.getElementById("overlay");
    

    modeSwitcherBtn.addEventListener("click", function () {
        document.body.classList.toggle("light-mode"); //This toggles the body between light mode and dark mode
        document.body.classList.toggle("dark-mode");

        //modeSwitcherBtn.classList.toggle('dark-mode'); //This toggles the dark and light mode icons 
        //modeSwitcherBtn.classList.toggle('light-mode');

        const darkIcon = modeSwitcherBtn.querySelector('.dark-icon'); //This defines the dark and light mode icons
        const lightIcon = modeSwitcherBtn.querySelector('.light-icon');

        //This applies dark mode and light mode to the menu button
        menuBtn.classList.toggle("dark-mode");
        menuBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to the navigation bar and its links
        navBar.classList.toggle("dark-mode");
        navBar.classList.toggle("light-mode");
        navBar.classList.toggle("nav-link-colors");

        //This alternates between the dark and light mode icons and text as the button is pressed
        if (navBar.classList.contains('dark-mode')) {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            modeText.textContent = 'Dark Mode';
        } else {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            modeText.textContent = 'Light Mode';
        }

        //APP.JS SPECIFIC 
        //This applies dark mode and light mode to the add button
        addBtn.classList.toggle("dark-mode");
        addBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to the log button
        logBtn.classList.toggle("dark-mode");
        logBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to each edit button in the log
        const logEditButtons = document.querySelectorAll('.log-edit');
        const logDeleteButtons = document.querySelectorAll('.log-delete');

        logEditButtons.forEach((button) => {
            button.classList.toggle('dark-mode');
            button.classList.toggle('light-mode');
          });
        logDeleteButtons.forEach((button) => {
            button.classList.toggle('dark-mode');
            button.classList.toggle('light-mode');
        })

        //This applies dark mode and light mode to each action box (the log, the form)
        const actionBoxes = document.querySelectorAll('.action-box');

        actionBoxes.forEach((box) => {
            box.classList.toggle('dark-mode');
            box.classList.toggle('light-mode');
        })

        //This applies dark mode and light mode to the overlay 
        overlay.classList.toggle("dark-mode");
        overlay.classList.toggle("light-mode");

        //This applies dark mode and light mode to the date above the clock
        today.classList.toggle("dark-mode");
        today.classList.toggle("light-mode");
        dayOfWeek.classList.toggle("dark-mode");
        dayOfWeek.classList.toggle("light-mode");
        longDateDay.classList.toggle("dark-mode");
        longDateDay.classList.toggle("light-mode");

        //This applies dark mode and light mode to the arrows
        leftArrow.classList.toggle("dark-mode");
        leftArrow.classList.toggle("light-mode");
        rightArrow.classList.toggle("dark-mode");
        rightArrow.classList.toggle("light-mode");

        //enable dark and light mode to the chart's "remaining" slices
        //toggleRemaining();
        //a function from app.js that checks if remaining's slice is white or black. 
        //if so, it will run a loop for pie slice to check if it needs to be toggle to the other color
        //consider finding a way to distinguish between a slice that is purposefully black/white versus a default black/white

        //a function to toggle light and dark mode for the hands of the clock

    });    

    //When the menu button is clicked, the navigation bar is animated into view
    menuBtn.addEventListener('click', function () {
        navBar.classList.toggle('active');

    });
}
initializeDarkLightMode();