export function initializeDarkLightMode() {
    //Script for Dark Mode and Light Mode

    const modeSwitcherBtn = document.getElementById('mode-switcher');
    const menuBtn = document.getElementById('menu');
    const modeText = modeSwitcherBtn.querySelector('.mode-text');
    const navBar = document.getElementById('navigationbar');

    const submitBtn = document.getElementById("submit");
    const nextChartBtn = document.getElementById("next-chart");
    const backChartBtn = document.getElementById("chart-back");
    const seeDetailsBtn = document.getElementById("seeDetails");
    const resetBtn = document.getElementById("resetButton");

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

        //Data specific 
        //This applies dark mode and light mode to the submit button
        submitBtn.classList.toggle("dark-mode");
        submitBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to the arrows on the report
        nextChartBtn.classList.toggle("dark-mode");
        nextChartBtn.classList.toggle("light-mode");

        backChartBtn.classList.toggle("dark-mode");
        backChartBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to the see details button
        seeDetailsBtn.classList.toggle("dark-mode");
        seeDetailsBtn.classList.toggle("light-mode");

        //This applies dark mode and light mode to the reset button
        resetBtn.classList.toggle("dark-mode");
        resetBtn.classList.toggle("light-mode");
    });

    //This doesn't belong here
    //When the menu button is clicked, the navigation bar is animated into view
    menuBtn.addEventListener('click', function () {
        navBar.classList.toggle('active');
    });
}
initializeDarkLightMode();