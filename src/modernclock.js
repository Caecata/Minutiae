var canvas = document.getElementById("canvas-modern");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90

let centerX = 0;
let centerY = 0;

export function modernClock(mins, hour) { //PUT EXPORT IN LATER

    drawFace(ctx, radius);
    drawNumbers(ctx, radius, hour);
    drawNumbers2(ctx, radius, mins);
    drawTicks(ctx, radius, hour); //inside ticks
    drawTicks2(ctx, radius, mins); //outside ticks

    drawMinuteTick(mins, hour);
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
function drawTicks(ctx, radius, hour) {
    var numTicks = 24;
    var tickWidth = radius * 0.01; //0.01
    var tickLength = radius * 0.1; //0.1
    var positionOffset = radius * 0.4;

    for (var i = 0; i < numTicks; i++) {
        if (i == hour) {
            //positionOffset = radius * 0.3; 


        } else {
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
}

//Draw outside tick marks
function drawTicks2(ctx, radius, mins) {
    var numTicks = 60;
    var tickWidth = radius * 0.01; //0.01
    var tickLength = radius * 0.1; //0.1
    for (var i = 0; i < numTicks; i++) {

        if (i == mins) {

        } else {
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
}

//Draw hour tick
export function drawHourTick(hour, coords, centerX, centerY, radius) {
    var numTicks = 24;
    var tickWidth = radius * 0.02; //0.01
    var tickLength = radius * 0.1; //0.1 //0.25
    var positionOffset = radius * 0.27;
    var tickAngle = (hour / numTicks) * 2 * Math.PI;

    var x1 = Math.sin(tickAngle) * (radius - tickWidth - positionOffset);
    var y1 = -Math.cos(tickAngle) * (radius - tickWidth - positionOffset);
    var x2 = Math.sin(tickAngle) * (radius - tickWidth - positionOffset - tickLength);
    var y2 = -Math.cos(tickAngle) * (radius - tickWidth - positionOffset - tickLength)

    coords.hourTick.x1 = x1;
    coords.hourTick.x2 = x2;
    coords.hourTick.y1 = y1;
    coords.hourTick.y2 = y2;

    console.log("coords:", coords);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "black"; //#666 
    ctx.stroke();

    drawHalfCircle(coords, centerX, centerY, radius);

}

//Draw minute tick
export function drawMinuteTick(minute, hour) {
    //console.log("drawMinuteTick()");

    //console.log("centerX:", centerX);
    //console.log("centerY:", centerY);
    //console.log("radius:", radius);

    if (minute % 5 === 0) {
        var numTicks = 60;
        var tickWidth = radius * 0.01; //0.01
        var tickLength = radius * 0.05; //0.1
        var tickAngle = (minute / numTicks) * 2 * Math.PI;
        var x1 = Math.sin(tickAngle) * (radius - tickWidth - radius * 0.24); //.15
        var y1 = -Math.cos(tickAngle) * (radius - tickWidth - radius * 0.24);
        var x2 = Math.sin(tickAngle) * (radius - tickLength - radius * 0.24);
        var y2 = -Math.cos(tickAngle) * (radius - tickLength - radius * 0.24);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        let coords = {
            minuteTick: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            },
            hourTick: {
                x1: null,
                y1: null,
                x2: null,
                y2: null
            }
        }

        ctx.lineWidth = tickWidth;
        ctx.strokeStyle = "black"; //#666
        ctx.stroke();

        drawHourTick(hour, coords, centerX, centerY, radius)

    } else {
        var numTicks = 60;
        var tickWidth = radius * 0.01; //0.01
        var tickLength = radius * 0.25; //0.1
        var tickAngle = (minute / numTicks) * 2 * Math.PI;
        var x1 = Math.sin(tickAngle) * (radius - tickWidth - radius * 0.04); //.15
        var y1 = -Math.cos(tickAngle) * (radius - tickWidth - radius * 0.04);
        var x2 = Math.sin(tickAngle) * (radius - tickLength - radius * 0.04);
        var y2 = -Math.cos(tickAngle) * (radius - tickLength - radius * 0.04);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        let coords = {
            minuteTick: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            },
            hourTick: {
                x1: null,
                y1: null,
                x2: null,
                y2: null
            }
        }

        ctx.lineWidth = tickWidth;
        ctx.strokeStyle = "black"; //#666
        ctx.stroke();

        drawHourTick(hour, coords, centerX, centerY, radius)
    }
}

function drawHalfCircle(coords, centerX, centerY, radius) {
    var x1 = coords.hourTick.x1;
    var y1 = coords.hourTick.y1;
    var x2 = coords.minuteTick.x2;
    var y2 = coords.minuteTick.y2;

    radius = radius * 0.71;  //0.71 + 0.29 = 1; 0.29 = 0.25 + 0.4

    var startAngle = Math.atan2(y1 - centerY, x1 - centerX);
    var endAngle = Math.atan2(y2 - centerY, x2 - centerX);

    //THIS WORKS ALMOST ALL THE TIME; I SUSPECT A MODIFICATION IS NEEDED TO THIS SO DO NOT DELETE
    /* if (Math.abs(endAngle - startAngle) < Math.PI) { //> or <
        var tempAngle = startAngle;  
        startAngle = endAngle;  
        endAngle = tempAngle;  
    }  */

    console.log("startAngle:", startAngle);
    console.log("endAngle:", endAngle);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = radius * 0.01; //1
    ctx.strokeStyle = "black";
    ctx.stroke();
}

//Draw numbers
function drawNumbers(ctx, radius, hour) {
    var ang;
    var num;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

    for (num = 1; num < 25; num++) {
        if (num == hour) {
            //ctx.font = radius*0.1 + "px 'Concert One', sans-serif";
            ctx.font = "bold 20px " + font; //"bold 15px 'Concert One'"
            ctx.letterSpacing = "2px";
            ctx.fillStyle = "green"; //black

            ang = num * Math.PI / 12;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.55); //0.85 //0.77
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.55); //0.85 //0.77
            ctx.rotate(-ang);

        } else if (num == 24 && hour === 0) {
            ctx.font = "bold 20px " + font; //"bold 15px 'Concert One'"
            ctx.letterSpacing = "2px";
            ctx.fillStyle = "green"; //black

            ang = 0 * Math.PI / 12;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.55); //0.85 //0.77
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.55); //0.85 //0.77
            ctx.rotate(-ang);
        } else {
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
}

function drawNumbers2(ctx, radius, mins) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    //ctx.imageSmoothingEnabled = false;

    var font = getComputedStyle(document.documentElement).getPropertyValue('--font-family');

    for (let num = 0; num < 60; num += 5) {
        if (num == mins) {
            ctx.font = "bold 15px " + font;
            ctx.letterSpacing = "2px";
            ctx.fillStyle = "green";

            const ang = num * Math.PI / 30;

            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.8); //0.9 worked well when the charts were gone but not when they came back so it is a format decision (adjust the charts or adjust this)
            ctx.rotate(-ang);

            ctx.fillText(num.toString(), 0, 0);

            ctx.rotate(ang);
            ctx.translate(0, radius * 0.8);
            ctx.rotate(-ang);
        } else {
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
} 