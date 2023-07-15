var canvas = document.getElementById("canvas-minimal");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.7; //0.9

export function minimalClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTicks(ctx, radius); //inside ticks
    //drawTicks2(ctx, radius); //outside ticks
}

//Draw the face of the clock
function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#CCC9E7'; //change this to change the color of the clock; white'#CCC9E7, black
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
    for (var i = 0; i < numTicks; i++) {
        var tickAngle = (i / numTicks) * 2 * Math.PI;
        var x1 = Math.sin(tickAngle) * (radius - tickWidth - radius * 0.3); //.3
        var y1 = -Math.cos(tickAngle) * (radius - tickWidth - radius * 0.3);
        var x2 = Math.sin(tickAngle) * (radius - tickLength - radius * 0.3);
        var y2 = -Math.cos(tickAngle) * (radius - tickLength - radius * 0.3);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = tickWidth;
        if (i % 4 === 0) {
            ctx.strokeStyle = "black"; //#333 // black
        } else {
            ctx.strokeStyle = "darkslategray"; //#666 
        }
        ctx.stroke();
    }
}

//Draw outside tick marks
function drawTicks2(ctx, radius) {
    var numTicks = 24;
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
        if (i % 4 === 0) {
            ctx.strokeStyle = "black"; //#333 // black
        } else {
            ctx.strokeStyle = "darkslategray"; //#666
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
        if (num == 4 || num == 8 || num == 12 || num == 16 || num == 20 || num == 24) {
            //ctx.font = radius*0.1 + "px 'Concert One', sans-serif";
            ctx.font = "bold 16px " + font; //"bold 15px 'Concert One'" //20px
            ctx.fillStyle = "darkslategray"; //black

        } else {
            ctx.font = "bold 16px " + font;

            ctx.fillStyle = "darkslategray"; 
        }
        ang = num * Math.PI / 12;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.81); //0.85 //0.77
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.81); //0.85 //0.77
        ctx.rotate(-ang);
    }
    //For changing the number at the top to a different hour
    /*for (num = 15; num <= 24; num++) {
        if (num == 20 || num == 24) {
            ctx.font = "bold 15px 'Concert One'";
            ctx.fillStyle = "black";
        } else {
            ctx.font = "bold 15px 'Concert One'";
            ctx.fillStyle = "darkslategray";
        }
        ang = (num - 15) * Math.PI / 12;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.77);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.77);
        ctx.rotate(-ang);
    }

    for (num = 1; num < 15; num++) {
        if (num == 4 || num == 8 || num == 12) {
            ctx.font = "bold 15px 'Concert One'";
            ctx.fillStyle = "black";
        } else {
            ctx.font = "bold 15px 'Concert One'";
            ctx.fillStyle = "darkslategray";
        }
            ang = (num + 9) * Math.PI / 12;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.77);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.77);
            ctx.rotate(-ang);
        } */
} 