const CANVASWIDTH = 1200;
const CANVASHEIGHT = 800;
const BACKGROUNDCOLOUR = 150;
const SCALE = 1;

const BLACK = 0;
const WHITE = 255;

const burgers = [];
const numberOfBurgers = 4;

let burgerSprite;
let score = 0;


const Burger = {
    speed: 5,
    collider: 'k',
}

const Ralph = {
    width: 250,
    height: 260,
    x: 50,
    y: CANVASHEIGHT / 4,

    mouth: {
        x: 150,
        y: CANVASHEIGHT / 2,
        width: 150,
        height: 0,
    },
    eye: {
        width: 50,
        x: 150,
        y: 700,
    },
    nose: {
        x: [],
        y: [],
    },
    jawPosition: 0,
    hairLine: 0,
    curve: 40,
}

function preload() {
    burgerSprite = loadImage("burger.png");
}

function setup() {
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    initialiseBurgers();
}

function draw() {
    background(BACKGROUNDCOLOUR);
    strokeWeight(2);
    stroke(BLACK);
    update();


    fill(WHITE)
    rect(Ralph.x, Ralph.y, Ralph.width, Ralph.height + Ralph.jawPosition, Ralph.curve, Ralph.curve, Ralph.curve, Ralph.curve)

    fill(BACKGROUNDCOLOUR)
    rect(Ralph.mouth.x, Ralph.mouth.y, Ralph.mouth.width, Ralph.mouth.height + Ralph.jawPosition);
    stroke(BACKGROUNDCOLOUR)
    line(Ralph.mouth.x + Ralph.mouth.width, Ralph.mouth.y, Ralph.mouth.x + Ralph.mouth.width, Ralph.mouth.y + Ralph.jawPosition)

    fill(BLACK)
    text(score, 50, 50)
    //text(Burger[0].prevPositionX, 50, 75)
    lateUpdate();
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

        burger.debug = true;

        burgers.push(burger);
    }
}

function update() {
    // put all non-drawing functions called every frame here
    moveRalph();
    boundaryCollision();
    Ralph.jawPosition = getJawPosition();
}

function lateUpdate() {

}

function boundaryCollision() { // still weird especially with moving ralph
    let burgerInMouth = false;
    for (i = 0; i < numberOfBurgers; i++) { 
        if (burgers[i].x < Ralph.x + Ralph.width - 1) {
            burgerInMouth = true;
        } else {
            burgerInMouth = false;
        }

        if (burgers[i].x + (burgers[i].w / 2) >= CANVASWIDTH) { // x > right wall
            burgers[i].vel.x *= -1;
        } else if (burgers[i].x - (burgers[i].w / 2) < Ralph.x + Ralph.width) {
            if (burgers[i].y - (burgers[i].h / 2) < Ralph.mouth.y ||
            burgers[i].y - (burgers[i].h / 2) > Ralph.mouth.y + Ralph.jawPosition) {
                burgers[i].vel.x *= -1;
            } 
        }      

        if (burgers[i].y + (burgers[i].h / 2) >= CANVASHEIGHT) { // Top boundary
            burgers[i].vel.y *= -1;
        } else if (burgers[i].y - (burgers[i].h / 2) <= 0) { // Bottom boundary
            burgers[i].vel.y *= -1;
        }

        if (burgerInMouth == true) {
            if (burgers[i].y - (burgers[i].h / 2) <= Ralph.mouth.y) { // y on roof of mouth
                burgers[i].vel.y *= -1;
            } if (burgers[i].y - (burgers[i].h / 2) >= Ralph.mouth.height + Ralph.jawPosition) { // y on bottom of mouth
                burgers[i].vel.y *= -1;
            }
        }

        if (burgers[i].x < Ralph.x + (Ralph.width / 2)) {
            eatBurger(i);
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
        Ralph.y += 2;
        Ralph.mouth.y += 2;
    }
    if (kb.pressing('up')) {
        Ralph.y -= 2;
        Ralph.mouth.y -= 2;
    }
}



