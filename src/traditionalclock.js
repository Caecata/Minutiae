import tinycolor from "tinycolor2";

var canvas = document.getElementById("canvas-traditional");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 1//0.90

let centerX = 0;
let centerY = 0;

export function traditionalClock(chartData) { //PUT EXPORT IN LATER

    drawFace(ctx, radius, chartData);
    drawNumbers(ctx, radius, chartData);
    //drawNumbers2(ctx, radius);
    drawTicks(ctx, radius, chartData); //inside ticks
    //drawTicks2(ctx, radius); //outside ticks
    //drawHalfCylinder();
}

/*function drawHalfCylinder() {
    var canvas = document.getElementById("canvas-half-cylinder");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    // Set the color and style for the background
    ctx.fillStyle = "#ECECEC";
    ctx.strokeStyle = "#888888";
    ctx.lineWidth = 2;

    // Calculate the radius of the half-circle
    var radius = height / 2;

    // Calculate the width of the top rectangle
    var topWidth = width - 2 * radius;

    // Begin drawing the background shape
    ctx.beginPath();

    // Draw the top rectangle
    ctx.moveTo(radius, 0);
    ctx.lineTo(radius + topWidth, 0);

    // Draw the curved part of the shape
    ctx.arc(width / 2, height / 2, radius, Math.PI, 0);

    // Draw lines to complete the bottom rectangle
    ctx.lineTo(width - radius, height);
    ctx.lineTo(radius, height);

    // Close the path
    ctx.closePath();

    // Fill and stroke the shape
    ctx.fill();
    ctx.stroke();
} */

//Draw the face of the clock
function drawFace(ctx, radius, chartData) {
    console.log("chartData:", chartData);
    
    var angleOffset = -Math.PI / 2; // Offset to start the angles from the top
    var startAngle = angleOffset;
    var startTimeArray = chartData.reiterateData.detailsArray2.map(slice => slice.start);
  
  for (var i = 0; i < chartData.pieData.durations.length; i++) {

    var duration = chartData.pieData.durations[i];
    var color = chartData.pieData.categoryColors[i];
    var startTime = startTimeArray[i];
    var adjustedColor = adjustBrightness(color, 0.2);
    
    var sliceAngle = (duration / 1440 ) * 2 * Math.PI;
    var endAngle = startAngle + sliceAngle;

    var gradient = ctx.createRadialGradient(
        0,
        0,
        radius * 0.75,
        0,
        0,
        radius
      );
      gradient.addColorStop(0, adjustedColor); // Light color at the center
      gradient.addColorStop(1, color); // Darker color at the outer edge

    // Calculate the adjusted start and end angles based on the start time
    //var adjustedStartAngle = startAngle + (startTime / 1440) * 2 * Math.PI;
    //var adjustedEndAngle = adjustedStartAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

      // Update the start angle for the next slice
        startAngle = endAngle;
  }
}

//Draw inside tick marks
function drawTicks(ctx, radius, chartData) {

    var numTicks = 24;
    var tickWidth = radius * 0.01; //0.01
    var tickLength = radius * 0.1; //0.1
    var positionOffset = radius * 0.08;

    for (var i = 0; i < numTicks; i++) {

        var tickAngle = (i / numTicks) * 2 * Math.PI;

        var x1 = Math.sin(tickAngle) * (radius - tickWidth - positionOffset);
        var y1 = -Math.cos(tickAngle) * (radius - tickWidth - positionOffset);
        var x2 = Math.sin(tickAngle) * (radius - tickWidth - positionOffset - tickLength);
        var y2 = -Math.cos(tickAngle) * (radius - tickWidth - positionOffset - tickLength)

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.lineWidth = tickWidth;
        if (i % 4 === 0) {
            ctx.strokeStyle = "transparent"; //#333 // black //transparent
        } else {
            ctx.strokeStyle = "black"; //#666 //black
        }
        ctx.stroke();

    }
}

//Draw outside tick marks
function drawTicks2(ctx, radius) {
    var numTicks = 60;
    var tickWidth = radius * 0.01; //0.01
    var tickLength = radius * 0.1; //0.1
    for (var i = 0; i < numTicks; i++) {
        var tickAngle = (i / numTicks) * 2 * Math.PI;
        var x1 = Math.sin(tickAngle) * (radius - tickWidth - radius * 0.04); //.15
        var y1 = -Math.cos(tickAngle) * (radius - tickWidth - radius * 0.04);
        var x2 = Math.sin(tickAngle) * (radius - tickLength - radius * 0.04);
        var y2 = -Math.cos(tickAngle) * (radius - tickLength - radius * 0.04);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = tickWidth;
        if (i % 5 === 0) {
            ctx.strokeStyle = "black"; //#333 // black
        } else {
            ctx.strokeStyle = "black"; //#666
        }
        ctx.stroke();
    }
}

//Draw numbers
function drawNumbers(ctx, radius, chartData) {

    const invertedColors = invertColorArray(chartData.pieData.categoryColors);
    let indexCounter = 0;

    let triggerNumber = chartData.reiterateData.detailsArray2[0].start + chartData.pieData.durations[0];
    console.log("initial triggerNumber:", triggerNumber);

    var ang;
    var num;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    //var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

        for (num = 1; num < 25; num++) {

            if (num === 4 || num === 8 || num === 12 || num === 16 || num === 20 || num === 24) {
                
                /* if (num * 60 > triggerNumber) {
                    console.log("triggerNumber:", triggerNumber);
                    console.log("indexCounter incremented");
                    indexCounter++;
                    triggerNumber = chartData.reiterateData.detailsArray2[indexCounter].start + chartData.pieData.durations[indexCounter];
                } */

                /* if (ang > angleArray[indexCounter].startAngle && ang <= angleArray[indexCounter].endAngle || indexCounter === max) {
                    console.log("in if");
                } else {
                    console.log("else");
                    indexCounter = indexCounter + 1;
                }  */

                ctx.font = "bold 25px " + "Raleway";
                //ctx.letterSpacing = "2px";
                ctx.fillStyle = "black";

                ctx.shadowColor = "#000"; // Outline color
                ctx.shadowBlur = 10; // Outline blur radius
    
                ang = num * Math.PI / 12;
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.90); //0.85 //0.77
                ctx.rotate(-ang);
                ctx.fillText(num.toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.90); //0.85 //0.77
                ctx.rotate(-ang);

                ctx.shadowColor = "transparent"; // Reset shadow color
                ctx.shadowBlur = 0; // Reset shadow blur radius 
            } 
        }
}

function drawNumbers2(ctx, radius) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    //var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

    for (let num = 0; num < 60; num += 5) {
        ctx.font = "bold 15px " + "Raleway";
        //ctx.letterSpacing = "2px";
        ctx.fillStyle = "black";

        const ang = num * Math.PI / 30;

        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.8);
        ctx.rotate(-ang);

        ctx.fillText(num.toString(), 0, 0);

        ctx.rotate(ang);
        ctx.translate(0, radius * 0.8);
        ctx.rotate(-ang);
    }
} 

function invertColor(color) {
    const invertedColor = tinycolor(color).spin(180).toString();
    return invertedColor;
  }
  
function invertColorArray(colors) {
return colors.map(color => invertColor(color));
}

function adjustBrightness(color, brightness) {
    const adjustedColor = brightness >= 0
        ? tinycolor(color).brighten(brightness * 100).toString()
        : tinycolor(color).darken(Math.abs(brightness) * 100).toString();
    return adjustedColor;
}

function adjustBrightnessArray(colors, brightness) {
    console.log("colors:", colors);
    return colors.map(color => adjustBrightness(color, brightness));
}