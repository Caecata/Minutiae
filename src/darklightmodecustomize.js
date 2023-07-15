import { updateVisualization, removeVisualization } from './customize.js'
import { receiveLegendFromDatabase } from './firebase/dbHandler.js'

export function initializeDarkLightMode() {
    //Script for Dark Mode and Light Mode

    const modeSwitcherBtn = document.getElementById('mode-switcher');
    const menuBtn = document.getElementById('menu');
    const modeText = modeSwitcherBtn.querySelector('.mode-text');
    const navBar = document.getElementById('navigationbar');

    const addCategoryBtn = document.getElementById("addCategoryButton");
    const deleteBtn = document.getElementById("deleteButton");
    const renameBtn = document.getElementById("renameButton");
    const changeColorBtn = document.getElementById("changeColorButton");
    const addTagBtn = document.getElementById("addTag");
    const deleteTagBtn = document.getElementById("deleteTag");
    const renameTagBtn = document.getElementById("renameTag");

    const viewTreeBtn = document.getElementById("viewTree");

    modeSwitcherBtn.addEventListener("click", function () {

        receiveLegendFromDatabase()
            .then((legend) => {
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

                //Settings specific: tree layout text is re-rendered every time it is toggled between dark and light mode
                removeVisualization("#tree-container");
                updateVisualization(legend, "#tree-container");

                //This applies dark mode and light mode to the view tree button
                viewTreeBtn.classList.toggle("dark-mode");
                viewTreeBtn.classList.toggle("light-mode");

                //This applies dark mode and light mode to 8 buttons 
                addCategoryBtn.classList.toggle("dark-mode");
                addCategoryBtn.classList.toggle("light-mode");

                deleteBtn.classList.toggle("dark-mode");
                deleteBtn.classList.toggle("light-mode");

                renameBtn.classList.toggle("dark-mode");
                renameBtn.classList.toggle("light-mode");

                changeColorBtn.classList.toggle("dark-mode");
                changeColorBtn.classList.toggle("light-mode");

                addTagBtn.classList.toggle("dark-mode");
                addTagBtn.classList.toggle("light-mode");

                deleteTagBtn.classList.toggle("dark-mode");
                deleteTagBtn.classList.toggle("light-mode");

                renameTagBtn.classList.toggle("dark-mode");
                renameTagBtn.classList.toggle("light-mode");

                const tags = document.querySelectorAll('.tag');
                tags.forEach((tag) => {
                    tag.classList.toggle('dark-mode');
                    tag.classList.toggle('light-mode');
                })
            });
    })

    //When the menu button is clicked, the navigation bar is animated into view
    menuBtn.addEventListener('click', function () {
        navBar.classList.toggle('active');
    });
}
initializeDarkLightMode();