const CANVAS_H = 960;
const CANVAS_W = 540;

let aspect_ratio = 16 / 9; // screen w/h
let fov;


let seed = 45

class vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class triangle {
    constructor(p1, p2, p3) {
        
    }
}

function setup() {
    createCanvas(CANVAS_W, CANVAS_H,)
    randomSeed(seed);

}

function draw() {
    background(200);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    box(100)
}

