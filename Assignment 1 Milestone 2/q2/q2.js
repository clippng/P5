const CANVASWIDTH = 1200;
const CANVASHEIGHT = CANVASWIDTH / 1.6;
const CENTER_X = CANVASWIDTH / 2;
const CENTER_Y = CANVASHEIGHT / 2;
const BACKGROUNDCOLOR = 190;
const BLACK = 0;
const WHITE = 255;
const RECTCURVE = 50;

let mouthOpen = 0;
let burgerPositionX, burgerPositionY;
let burgerBoundaryX, burgerBoundaryY, burgerBoundaryY2;
let eyePositionX, eyePositionY;
let previousBurgerPositionX, previousBurgerPositionY;
let burgerInMouth = false;

let Ralph = {
    head: {
        width: CANVASWIDTH / 4.5, 
        height: CANVASHEIGHT / 2, 
        x: CANVASWIDTH / 20, 
        y: CANVASHEIGHT / 10,
    },
    jaw: {
        width: CANVASWIDTH / 4.5, 
        height: CANVASHEIGHT / 8, 
        backWidth: CANVASWIDTH / 20,
        x: CANVASWIDTH / 20, 
        y: CENTER_Y,
    },
    mouth: {
        width: CANVASWIDTH / 5.5,
        height: CANVASHEIGHT / 3.5,
        x: CANVASWIDTH / 10,
        y: CENTER_Y * 0.95,
    },
    eye: {
        x: CANVASWIDTH / 4.3,
        y: CANVASHEIGHT / 3.7,
        size: 60,
        pupilSize: 25,
    },
    nose: {
        x: [CANVASWIDTH * 49 / 180, CANVASWIDTH / 3.1],
        y: [CANVASHEIGHT / 3.7, CANVASHEIGHT / 2.7]
    },

    boundary: CANVASWIDTH / 4.5 + CANVASWIDTH / 20,
    hairLine: CANVASHEIGHT/ 10,
}

let Burger = {
    width: CANVASWIDTH / 8,
    height: CANVASWIDTH / 16,
    curve: 20,
}

function setup() {
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
}

function draw() {
    mouthOpen = mouseX / 2 - CENTER_X / 2;
    
    if(mouthOpen > CENTER_X / 2) {
        mouthOpen = CENTER_X / 2;
    }
    if(mouthOpen > 0) {
        mouthOpen = 0;
    }
    if (mouthOpen < -120) {
        mouthOpen = -120;
    }

    eyePositionX = Ralph.eye.pupilSize * 0.6 * cos(previousBurgerPositionY  / previousBurgerPositionX)
    eyePositionY = Ralph.eye.pupilSize * 0.6 * sin (previousBurgerPositionY  / previousBurgerPositionX)

    previousBurgerPositionX = burgerPositionX;
    previousBurgerPositionY = burgerPositionY;

    burgerPositionX = mouseX;
    burgerPositionY = mouseY;

    burgerBoundaryX = burgerPositionX - Burger.width * 0.55;
    burgerBoundaryY = burgerPositionY - Burger.height / 2;
    burgerBoundaryY2 = burgerPositionY + Burger.height / 2;

    if (previousBurgerPositionX - Burger.width * 0.55 < Ralph.boundary - 1) {
        burgerInMouth = true;
    } else {
        burgerInMouth = false;
    }

    if (burgerBoundaryX < Ralph.boundary && burgerBoundaryY < CENTER_Y && burgerInMouth == false)  {
        burgerPositionX = Ralph.boundary + Burger.width * 0.55;
    } else if (burgerBoundaryX < Ralph.boundary && burgerBoundaryY2 > CENTER_Y + abs(mouthOpen)&& burgerInMouth == false) {
        burgerPositionX = Ralph.boundary + Burger.width * 0.55;
    } if (burgerInMouth == true) {
        if (burgerBoundaryX < Ralph.mouth.x) {
            burgerPositionX = Ralph.mouth.x + Burger.width * 0.55;
        } 
        if (burgerBoundaryY2 > Ralph.jaw.y - mouthOpen) {
            burgerPositionY = Ralph.jaw.y - mouthOpen - Burger.height / 2;
        } else if (burgerBoundaryY < CENTER_Y) {
            burgerPositionY = CENTER_Y + Burger.height / 2;
        }
    }

    background(BACKGROUNDCOLOR);
    rectMode(CORNER);
    strokeWeight(2);
    stroke(BLACK);

    fill(WHITE);
    rect(Ralph.head.x, Ralph.head.y, Ralph.head.width, Ralph.head.height, RECTCURVE, RECTCURVE, RECTCURVE, RECTCURVE);
   
    triangle(Ralph.nose.x[0], Ralph.nose.y[0], Ralph.nose.x[1], Ralph.nose.y[1], Ralph.nose.x[0], Ralph.nose.y[1]);

    fill(BLACK);
    rect(Ralph.head.x, Ralph.hairLine, Ralph.head.width, Ralph.head.height/4.5, RECTCURVE, RECTCURVE, 0, 0)
    
    fill(WHITE);
    ellipse(Ralph.eye.x, Ralph.eye.y, Ralph.eye.size);

    fill(BLACK);
    ellipse(Ralph.eye.x + eyePositionX, Ralph.eye.y + eyePositionY, Ralph.eye.pupilSize); 

    noStroke();
    fill(BACKGROUNDCOLOR);
    rect(Ralph.mouth.x, CENTER_Y, Ralph.mouth.width, Ralph.mouth.height);

    fill(WHITE);
    stroke(BLACK);
    rect(Ralph.jaw.x, Ralph.jaw.y - mouthOpen, Ralph.jaw.width, Ralph.jaw.height, 0, 0, RECTCURVE, RECTCURVE);

    line(Ralph.jaw.x, CENTER_Y, Ralph.jaw.width + Ralph.jaw.x, CENTER_Y);

    noStroke();
    rect(Ralph.jaw.x, CENTER_Y - 5, Ralph.jaw.backWidth, abs(mouthOpen) + 10);
    
    stroke(BLACK);
    line(Ralph.jaw.x, CENTER_Y - 10, Ralph.jaw.x, CENTER_Y + abs(mouthOpen) + 10);
    line(Ralph.mouth.x, CENTER_Y, Ralph.mouth.x, CENTER_Y + abs(mouthOpen));

    fill(WHITE);
    rectMode(CENTER);
    rect(burgerPositionX, burgerPositionY, Burger.width, Burger.height, Burger.curve, Burger.curve, Burger.curve, Burger.curve);
    
    fill(BLACK);
    rect(burgerPositionX, burgerPositionY, Burger.width * 1.1, Burger.height / 5, Burger.curve, Burger.curve, Burger.curve, Burger.curve);
}