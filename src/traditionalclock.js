var canvas = document.getElementById("canvas-traditional");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90

let centerX = 0;
let centerY = 0;

export function traditionalClock() { //PUT EXPORT IN LATER

    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawNumbers2(ctx, radius);
    drawTicks(ctx, radius); //inside ticks
    drawTicks2(ctx, radius); //outside ticks
}

//Draw the face of the clock
function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white"; //change this to change the color of the clock; white'#CCC9E7, black
    //light brown: #C4A484; dark brown: #755E4A
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333'; //#333
    ctx.fill();
}

//Draw inside tick marks
function drawTicks(ctx, radius) {
    var numTicks = 24;
    var tickWidth = radius * 0.01; //0.01
    var tickLength = radius * 0.1; //0.1
    var positionOffset = radius * 0.4;

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
            ctx.strokeStyle = "black"; //#333 // black
        } else {
            ctx.strokeStyle = "black"; //#666 
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
function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

    for (num = 1; num < 25; num++) {
        ctx.font = "bold 15px " + font;
        ctx.letterSpacing = "2px";
        ctx.fillStyle = "black";

        ang = num * Math.PI / 12;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.65); //0.85 //0.77
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.65); //0.85 //0.77
        ctx.rotate(-ang);
    }
}

function drawNumbers2(ctx, radius) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

    for (let num = 0; num < 60; num += 5) {
        ctx.font = "bold 15px " + font;
        ctx.letterSpacing = "2px";
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