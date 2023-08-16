//this page is reponsible for setting size of things based on dimensions of the viewport
export const isMobile = document.documentElement.clientWidth <= 480;

export function checkDeviceWidth() {
    console.log("checkDeviceWidth()");
    const isMobile = document.documentElement.clientWidth <= 480;
    const currentPage = window.location.pathname;
    console.log("currentPage:", currentPage);
    console.log("isMobile:", isMobile);

    if (isMobile === true && currentPage === '/app.html') {
        console.log("condition met");

        document.getElementById('chartId').width = 250; //250
        document.getElementById('chartId').height = 250; //250

        document.getElementById('canvas-modern').width = 300;
        document.getElementById('canvas-modern').height = 300;

        //document.getElementById('canvas-traditional').width = 300; //300
        //document.getElementById('canvas-traditional').height = 300; //300

        document.getElementById('canvas-minimal').width = 300;
        document.getElementById('canvas-minimal').height = 300;

        document.getElementById('clock-face').style.width = '300px'; //300px
        document.getElementById('clock-face').style.height = '300px'; //300px

        // Center the elements
        const centeredElements = [
            'chartId',
            'canvas-modern',
            'canvas-traditional',
            'canvas-minimal',
            'clock-face',
            'date', 
            'dayOfWeek',
            'log',
            'one-step-form',
            'multi-step-form'
        ];

        centeredElements.forEach((elementId) => {
            const element = document.getElementById(elementId);
            element.style.position = 'absolute';
            element.style.left = '50%';
            element.style.top = '50%';
            element.style.transform = 'translate(-50%, -50%)';
        });

        // Set display to "none" for the specified elements
        const elementsToHide = ['day-back', 'day-forward', 'chartLeft', 'chartRight', 'clock'];

        elementsToHide.forEach((elementId) => {
            const element = document.getElementById(elementId);
            element.style.display = 'none';
        });

        document.getElementById("date").style.top = '18%';
        document.getElementById("dayOfWeek").style.top = '25%';

    }
    if (isMobile === true && currentPage === '/data.html') {
        //document.getElementById('dropdownForCategory').style.fontSize = '1em';
        //document.getElementById('dropdownForTimeUnit').style.fontSize = '1em';
        //document.getElementById('date-input').style.fontSize = '1em';

        // Center the elements
        const centeredElements = [
            'dataTypeForm', 
            'data-log'
        ];

        centeredElements.forEach((elementId) => {
            const element = document.getElementById(elementId);
            element.style.position = 'absolute';
            element.style.left = '50%';
            element.style.top = '50%';
            element.style.transform = 'translate(-50%, -50%)';
        });
    }
    if (isMobile === true && currentPage === '/customize.html') {
        // Center the elements
        const centeredElements = [
            'tree-backdrop'
        ];

        centeredElements.forEach((elementId) => {
            const element = document.getElementById(elementId);
            element.style.position = 'absolute';
            element.style.left = '50%';
            element.style.top = '50%';
            element.style.transform = 'translate(-50%, -50%)';
        });
    }
}

// Check device width on page load and resize
checkDeviceWidth();
window.addEventListener('resize', checkDeviceWidth); 

