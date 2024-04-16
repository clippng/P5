const CANVASWIDTH = 1200;
const CANVASHEIGHT = 800;
const BACKGROUNDCOLOUR = 150;
const SCALE = 1;

const BLACK = 0;
const WHITE = 255;

// Issues with the eye functions - wanting to improve on previous implimentations
// Exploring vectors and potitions around a circle, looking into clamping a vector to
// a scalar around the edge of a circle

const burgers = [];
const numberOfBurgers = 4;

let burgerSprite;

let score = 0;

let debug;
const Debug = false;


const Burger = {
    speed: 5,
    collider: 'k',
    inMouth: false,
}

const Ralph = {
    width: 250,
    height: 280,
    x: 50,
    y: CANVASHEIGHT / 4,

    mouth: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },
    eye: {
        width: 0,
        x: 0,
        y: 0,
    },
    pupil: {
        size: 0,
        offset: 0,
        x: 0,
        y: 0,
    },
    nose: {
        x: [],
        y: [],
    },
    jawPosition: 0,
    hairLine: 0,
    curve: 40,
    speed: 3,
}

function preload() {
    burgerSprite = loadImage("burger.png");
}

function setup() {
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    initialiseBurgers();
    initialiseRalph();
}

function draw() {
    background(BACKGROUNDCOLOUR);
    strokeWeight(2);
    stroke(BLACK);
    update();
    noFill();


    fill(WHITE)
    rect(Ralph.x, Ralph.y, Ralph.width, Ralph.height + Ralph.jawPosition, Ralph.curve, Ralph.curve, Ralph.curve, Ralph.curve)

    fill(BACKGROUNDCOLOUR)
    rect(Ralph.mouth.x, Ralph.mouth.y, Ralph.mouth.width, Ralph.mouth.height + Ralph.jawPosition);
    stroke(BACKGROUNDCOLOUR);
    strokeWeight(3);
    line(Ralph.mouth.x + Ralph.mouth.width, Ralph.mouth.y, Ralph.mouth.x + Ralph.mouth.width, Ralph.mouth.y + Ralph.jawPosition)

    stroke(BLACK)
    fill(WHITE)
    ellipse(Ralph.eye.x, Ralph.eye.y, Ralph.eye.width);

    fill(BLACK)
    ellipse(Ralph.pupil.x, Ralph.pupil.y, Ralph.pupil.size);
    rect(Ralph.x, Ralph.y, Ralph.width, Ralph.hairLine, Ralph.curve, Ralph.curve, 0 ,0);

    if (Debug == true) {
        line(Ralph.eye.x, Ralph.eye.y, burgers[0].x, burgers[0].y)
        line(Ralph.eye.x, 0, Ralph.eye.x, Ralph.eye.y)
        line(burgers[0].x, burgers[0].y, Ralph.eye.x, 0)
        text(debug, 50, 75)
    }
    strokeWeight(1);

    text("Burgers eaten: ", 30, 50)
    text(score, 120, 50)
}

function initialiseBurgers() { // make velocity skewed towards x
    for (let i = 0; i < numberOfBurgers; i++) {
        let x = randomiseStaringPositions('x');
        let y = randomiseStaringPositions('y');
        let d = randomiseStartingDirection();
        let burger = new Sprite(x, y);

        burger.speed = Burger.speed;
        burger.img = burgerSprite;
        burger.collider = Burger.collider;
        burger.scale = 3 * SCALE;
        burger.rotationLock = true;
        burger.bounciness = 1;
        burger.friction = 0;
        burger.drag = 0;
        burger.direction = d;

        burger.inMouth = false;

        //burger.debug = true;

        burgers.push(burger);
    }
}

function initialiseRalph() {
    Ralph.mouth.width = Ralph.width / 1.5;
    Ralph.mouth.height = 0;
    Ralph.mouth.x = Ralph.width - Ralph.mouth.width + Ralph.x;
    Ralph.mouth.y = Ralph.y * 2;

    Ralph.eye.width = Ralph.width / 5;
    Ralph.eye.x = Ralph.x + (Ralph.width * 0.75);
    Ralph.eye.y = Ralph.y + (Ralph.height * 0.35);

    Ralph.pupil.size = Ralph.eye.width / 2;
    Ralph.pupil.offset = Ralph.eye.width / 4;
    Ralph.pupil.x = Ralph.eye.x;
    Ralph.pupil.y = Ralph.eye.y;

    Ralph.hairLine = Ralph.height / 5;
}

function update() {
    // put all non-drawing functions called every frame here
    moveRalph();
    getPupilDirection();
    moveRalphPupil();
    Ralph.jawPosition = getJawPosition();
    boundaryCollision();

}

function boundaryCollision() { // still weird especially with moving ralph
    for (i = 0; i < numberOfBurgers; i++) { 
        if (burgers[i].x - (burgers[i].w / 2)< Ralph.x + Ralph.width - 10) {
            burgers[i].inMouth = true;
        } else {
            burgers[i].inMouth = false;
        }

        if (burgers[i].x - (burgers[i].w / 2) < Ralph.x + Ralph.width && burgers[i].y - (burgers[i].h / 2) < Ralph.mouth.y && // Hits Ralph above mouth
            burgers[i].inMouth == false) {
            burgers[i].x = Ralph.x + Ralph.width + (burgers[i].w / 2)
            burgers[i].vel.x *= -1;
        } else if (burgers[i].x - (burgers[i].w / 2) < Ralph.x + Ralph.width &&  // Hits Ralph below mouth
            burgers[i].y + (burgers[i].h / 2 ) > Ralph.mouth.y + Ralph.jawPosition && burgers[i].inMouth == false) {
            burgers[i].x = Ralph.x + Ralph.width + (burgers[i].w / 2)
            burgers[i].vel.x *= -1;
        }

        if (burgers[i].inMouth == true) {
            if (burgers[i].y - (burgers[i].h / 2) < Ralph.mouth.y) {
                burgers[i].y = Ralph.mouth.y + (burgers[i].h / 2);
                burgers[i].vel.y *= -1;
            } else if (burgers[i].y + (burgers[i].h / 2) > Ralph.mouth.y + Ralph.jawPosition) {
                burgers[i].y = Ralph.mouth.y + Ralph.jawPosition - (burgers[i].h / 2);
                burgers[i].vel.y *= -1;
            }
            if (burgers[i].x < Ralph.eye.x) {
                eatBurger(i);
            }
        }

        if (burgers[i].x + (burgers[i].w / 2) >= CANVASWIDTH) { // x > right wall
            burgers[i].vel.x *= -1;
        }  
        
        if (burgers[i].y + (burgers[i].h / 2) >= CANVASHEIGHT) { // Top boundary
            burgers[i].vel.y *= -1;
        } else if (burgers[i].y - (burgers[i].h / 2) <= 0) { // Bottom boundary
            burgers[i].vel.y *= -1;
        }
    }
}

function randomiseStaringPositions(i) { // fix could do 2 functions for x y
    let r;
    if (i == 'x') {
        r = random(100);
        r += CANVASWIDTH / 2;
        return r;
    } else if (i == 'y') {
        r = random(100);
        r += CANVASHEIGHT / 3;
        return r;
    }
    return 0;
}

function randomiseStartingDirection() { //45 - 135, 225-315 excluded
    let r;
    r = random(360); 
    if (r > 45 && r < 135) {
        r += 90;
    } else if (r > 225 && r < 315) {
        r += 90
    }

    if (r > 360) {
        r -= 360;
    }
    return r;
}

function getJawPosition() {
    let w = CANVASWIDTH;
    for (i = 0; i < numberOfBurgers; i++) {
        if (burgers[i].x < w) {
            w = burgers[i].x;
        }
    }
    w = CANVASWIDTH / 2 - w;
    w = w * 0.75;
    if (w > 150) {
        w = 150;
    }

    if (w < 0) {
        w = 0;
    }

    return w;
}

function eatBurger(b) {
    score++;

    burgers[b].x = CANVASWIDTH /2;
    burgers[b].y = CANVASHEIGHT / 2;

    burgers[b].direction = randomiseStartingDirection();



    //burgers[b] reset pos and give random velocity
}

function moveRalph() {
    if (kb.pressing('down')) {
        Ralph.y += Ralph.speed;
        Ralph.mouth.y += Ralph.speed;
        Ralph.eye.y += Ralph.speed;
    }
    if (kb.pressing('up')) {
        Ralph.y -= Ralph.speed;
        Ralph.mouth.y -= Ralph.speed;
        Ralph.eye.y -= Ralph.speed;
    }
}

function getPupilDirection() {
    let a = CANVASWIDTH;
    let b, c;
    let angle;

    for (i = 0; i < numberOfBurgers; i++) {
        if (burgers[i].x < a) {
            a = burgers[i].x;
            b = burgers[i].y; 
        }
    } 

    a = Ralph.eye.x - a;
    b = Ralph.eye.y - b;


    c = sqrt(sq(a) + sq(b));

    angle = acos((sq(b) + sq(c) - sq(a)) / (2 * b * c))  - 90
    debug = angle;

    return angle;
}

function moveRalphPupil() {
    let angle;
    angle = getPupilDirection();
    Ralph.pupil.x = Ralph.eye.x + Ralph.pupil.offset * cos(angle);

    Ralph.pupil.y = Ralph.eye.y + Ralph.pupil.offset * sin(angle);
}



