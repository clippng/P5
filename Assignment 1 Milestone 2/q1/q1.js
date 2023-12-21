const CANVASWIDTH = 1200;
const CANVASHEIGHT = 1000;
const BLACK = 0;
const WHITE = 255;
const LIGHT = 200;
const DARK = 30;
const RED = [255, 0, 0];
const YELLOW = [237, 201, 71];
const CENTER_X = CANVASWIDTH / 2;
const CENTER_Y = CANVASHEIGHT / 2;
const MOON_1_DEFAULT_SPEED = 0.03;
const MOON_2_DEFAULT_SPEED = 0.04;

let planetDiameter = CANVASWIDTH / CANVASHEIGHT * 100;
let planetRadius = planetDiameter / 2;

let moonDiameter = planetDiameter / 2;
let moonRadius = moonDiameter / 2;
let moon1Orbit = 500;
let moon2Orbit = 400;
let moon3Orbit = 100;
let moon1OffsetX, moon1OffsetY, moon2OffsetX, moon2OffsetY, moon3OffsetX, moon3OffsetY;
let angle1 = 0, angle2 = 0, angle3 = 0;
let moon1Dist, moon2Dist, planetFacing;

let generalSpeed = 1;
let speedIncriment = 0.005;
let moon1Speed = MOON_1_DEFAULT_SPEED;
let moon2Speed = MOON_2_DEFAULT_SPEED;
let moon3Speed = 0.05;
let moon1Closer = false;

let x2, x3;
let y2, y3;
let d1, d2;
let rotaion;

function setup() {    
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    rotaion = (PI * ((2 * moon1Orbit) + (0.5 * moon1Orbit))) 
}

function draw() {
    x2 = mouseX - moon1OffsetX - CENTER_X;
    y2 = mouseY - moon1OffsetY - CENTER_Y;

    x3 = mouseX - moon2OffsetX - CENTER_X;
    y3 = mouseY - moon2OffsetY - CENTER_Y;

    d1 = sqrt(x2 * x2 + y2 * y2);
    d2 = sqrt(x3 * x3 + y3 * y3);

    if (d1 < moonRadius) {
        if (mouseIsPressed == true) {
            if (mouseButton == LEFT) {
                moon1Speed += speedIncriment;
            }
        }
    } else {
        angle1 += moon1Speed * generalSpeed;
    }

    if (d2 < moonRadius) {
        if (mouseIsPressed == true) {
            if (mouseButton == LEFT) { 
                moon2Speed += speedIncriment;
            }
        }   
    } else {
        angle2 += moon2Speed * generalSpeed;
    }

    if (mouseIsPressed == true) {
        if (mouseButton == RIGHT) {
            moon1Speed = MOON_1_DEFAULT_SPEED;
            moon2Speed = MOON_2_DEFAULT_SPEED;
        }
    }

    moon1OffsetX = moon1Orbit * cos(angle1);
    moon1OffsetY = moon1Orbit * 0.25 * sin(angle1);

    moon2OffsetX = moon2Orbit * 0.5 * cos(angle2);
    moon2OffsetY = moon2Orbit * sin(angle2);

    moon3OffsetX = moon3Orbit * cos(angle3);
    moon3OffsetY = moon3Orbit * sin(angle3);

    angle3 += moon3Speed * generalSpeed;

    moon1Dist = dist(CENTER_X, CENTER_Y, CENTER_X + moon1OffsetX, CENTER_Y + moon1OffsetY);
    moon2Dist = dist(CENTER_X, CENTER_Y, CENTER_X + moon2OffsetX, CENTER_Y + moon2OffsetY);

    if (moon1Dist > moon2Dist) {
        moon1Closer = false;
    } else {
        moon1Closer = true;
    }

    planetFacing = 2 * PI / rotaion;
    planetFacing += angle1;


    
    background(BLACK);
    stroke(BLACK);

    fill(DARK);
    arc(CENTER_X, CENTER_Y, planetDiameter, planetDiameter, planetFacing, HALF_PI + PI + planetFacing + HALF_PI, PIE);
    
    fill(LIGHT);
    arc(CENTER_X, CENTER_Y, planetDiameter, planetDiameter, planetFacing + HALF_PI+ PI, planetFacing + HALF_PI, PIE);

    fill(YELLOW);
    ellipse(CENTER_X + moon1OffsetX, CENTER_Y + moon1OffsetY, moonDiameter);

    fill(WHITE);
    ellipse(CENTER_X + moon2OffsetX, CENTER_Y + moon2OffsetY, moonDiameter);

    fill(RED);
    ellipse(CENTER_X + moon1OffsetX + moon3OffsetX, CENTER_Y + moon1OffsetY + moon3OffsetY, moonDiameter / 2);

    noFill();
    stroke(YELLOW);
    ellipse(CENTER_X, CENTER_Y, 2 * moon1Orbit, 0.5 * moon1Orbit);

    stroke(WHITE);
    ellipse(CENTER_X, CENTER_Y, moon2Orbit, 2 * moon2Orbit);

    stroke(RED);
    ellipse(CENTER_X + moon1OffsetX, CENTER_Y + moon1OffsetY, 2 * moon3Orbit);

    noStroke();
    if (moon1Closer == true) {
        fill(YELLOW);
    } else {
        fill(WHITE);
    }

    ellipse(CENTER_X, CENTER_Y, planetDiameter * 0.3);
}


