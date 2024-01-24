const CANVASWIDTH = 256;
const CANVASHEIGHT = 256;
const TINT = [200, 200, 200, 30];


let hue = [255, 143, 238]

let colour1 = [20, 20, 20, 255]
let colour2 = [60, 60, 60, 255]
let colour3 = [100, 100, 100, 255]
let colour4 = [140, 140, 140, 255]
let colour5 = [180, 180, 180, 255]

let n;
let sprite;
let spriteImgl
let example;
let backGroundActualPos = -712

function preload() {
    example = loadImage('Sprites/exampleBackground.png')
    spriteImgl = loadImage('Sprites/ice_climber_move_anim.png')
}

function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')
    sprite = new Sprite();
    sprite.img = spriteImgl;
}

function draw() {
    background(0)

    tint(multiplyColours(hue, TINT)) // works for all non sprite elements (because thers a notint() call before sprites are drawn)

    image(example, 0 , backGroundActualPos)
    text(camera.y, 10, 10)
    moveCamera();
    noTint(); 
}

function normaliseColour(r, g, b) {
    let colour = [];
    colour[0] = r / 255;
    colour[1] = g / 255;
    colour[2] = b / 255;
    return colour;
}

function clampColour(r, g, b) { // I think it does that automatically
    let colour = [];
    if (r > 1) {
        colour[0] = 1;
    } else {
        colour[0] = r;
    }
    if (g > 1) {
        colour[1] = 1;
    } else {
        colour[1] = g;
    }
    if (b > 1) {
        colour[2] = 1;
    } else {
        colour[2] = b;
    }
    return colour;
}

function multiplyColours(colour1, colour2) {
    let colour3 = [];
    colour3[0] = (colour1[0] * colour2[0]) / 255;
    colour3[1] = (colour1[1] * colour2[1]) / 255;
    colour3[2] = (colour1[2] * colour2[2]) / 255;
    colour3[3] = 255;
    return colour3;
}

function moveCamera() {
    if (kb.pressing('up')) {
        camera.y--
        backGroundActualPos++
    } else if (kb.pressing('down')) {
        camera.y++;
        backGroundActualPos--
    }
}

function initialiseLevel() {
    // get level info from json
}


