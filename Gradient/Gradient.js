// Creates a smooth gradient and generates random noise for heights
// Output is kinda weird but the colour aspect is good.

const CANVAS_H = 800;
const CANVAS_W = 1200;

const GROUND_LEVEL = CANVAS_H;

const BACKGROUND_COLOUR = 0;

let time = 1; // Lower = faster

let border = 0; 

let magnitude = 1;

let numberOfLines = 512;

let  effectiveCanvasWidth = CANVAS_W - (border * 2);

let lineSpacing;

let heightMinimum, heightMaximum, slopeMaximum;

let strokeThickness = 3;

let slopeChange = 30; // How steep the slopes are

let height, slope;

let seed;

let currentIteration = 0;

let drawFrame = false;

let numberOfColours = 5;

const c1 = [89,62,103];
const c2 = [132,73,95];
const c3 = [184,91,86];
const c4 = [222,116,28];
const c5 = [254,168,55];

let sizeOfColourSections = numberOfLines / (numberOfColours - 1); // size of each lerp section

let heights = []; //Stores height of all 256 visible lines and replaces the first entry with new entries

let colours = []; //stores 256 RGB values calculated at setup

let lines = []; // 256 lines



function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    background(BACKGROUND_COLOUR);
    randomSeed(seed);
    strokeWeight(strokeThickness);
    initialiseColours(); 
    stroke(255)

    seed = random();

    lineSpacing = effectiveCanvasWidth / numberOfLines;

    heightMaximum = 900;
    heightMinimum = 0;

    slopeMaximum = 50;

    height = (random() * heightMaximum / 10) + CANVAS_H / 2;
    slope = (random() * slopeMaximum) * 2 - slopeMaximum; 
} 

function draw() {
    update()

    stroke(colours[currentIteration]);  


    if (drawFrame == true && currentIteration > numberOfLines) {
        //line(border + (lineSpacing * currentIteration), GROUND_LEVEL, border + (lineSpacing * currentIteration), GROUND_LEVEL - height)           
    } else if (drawFrame == true) {
        line(border + (lineSpacing * currentIteration), GROUND_LEVEL, border + (lineSpacing * currentIteration), GROUND_LEVEL - height)  
    }
}

function getSlope() {
    let slope = (random() * slopeChange) * 2 - slopeChange; 
    return slope;
}

function update() {
    checkDrawFrame();
    if (drawFrame == true) {
        height += slope;
        slope = getSlope();
        lockVariables();
        updateHeightsArray();
    }
}

function initialiseColours() {
    let colour = [], colour1 = [], colour2 = [];
    let lerp, lerp_;
    for (i = 0; i < numberOfLines; i++) {
        lerp_ = i % sizeOfColourSections;
        lerp = lerp_ / sizeOfColourSections;
        if (i < sizeOfColourSections) {
            colour1 = c1, colour2 = c2;
        } else if (i < sizeOfColourSections * 2) {
            colour1 = c2, colour2 = c3;
        } else if (i < sizeOfColourSections * 3) {
            colour1 = c3, colour2 = c4;
        } else {
            colour1 = c4, colour2 = c5;
        }

        colour = lerpColour(colour1, colour2, lerp);
        colours.push(colour);
    }
}

function lerpColour(col1, col2, l) { // lerp function for RGB colours
    let color = [];
    color[0] = round((col1[0] + ((col2[0] - col1[0]) * l)));
    color[1] = round((col1[1] + ((col2[1] - col1[1]) * l)));
    color[2] = round((col1[2] + ((col2[2] - col1[2]) * l)));
    return color;
}

/*function initialiseHeights() {
    let slope_, height_;
    // Initialise starting parameters
    height_ = random() * heightMaximum / 2;
    slope_ = (random() * slopeMaximum) * 2 - slopeMaximum;
    //generate 256 starting heights
    for (i = 0; i < numberOfLines; i++) {
        slope_ = getSlope();
        height_ += slope_;
        heights.push(height_);
    }
}*/

function checkDrawFrame() {
    if (frameCount % time == 0) {
        drawFrame = true;
        currentIteration++;
    } else {
        drawFrame = false;
    }
}

function updateHeightsArray() {

    if (currentIteration > numberOfLines) {
        heights.splice(0, 1)
    }
    heights.push(height);
}

function lockVariables() {
    if (slope > slopeMaximum) {
        slope = slopeMaximum;
    }
    if (slope < -slopeMaximum) {
        slope = -slopeMaximum;
    }
    if (height > heightMaximum) {
        height = heightMaximum;
        if (slope > 0 ) {
            slope *= -1;   
        }
    }
    if (height < heightMinimum) {
        height = heightMinimum;
        if (slope < 0) {
        slope *= -1;            
        }
    }
}