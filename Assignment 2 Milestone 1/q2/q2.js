// Rapid roll

const CANVASHEIGHT = 180;
const CANVASWIDTH = 250;
const SCALE = 4;

// create 4-5 spikes and platform sprites and hide them when off screen and then move them to the bottom when called

let effectiveCanvasHeight = CANVASHEIGHT * SCALE;
let effectiveCanvasWidth = CANVASWIDTH * SCALE;

const BACKGROUNDCOLOUR = [189, 185, 89];
const NONBLINDINGCOLOUR = 150

let ballSprite, zeroSprite, oneSprite, twoSprite, threeSprite,
fourSprite, fiveSprite, sixSprite, sevenSprite, eightSprite, nineSprite,
death1Sprite, death2Sprite, heartSprite, livesSprite, platformSprite,
floorSpikesSprite, roofSpikesSprite, wallSprite, xSprite
 //probably dont need wall / platform

let topBoundary, leftBoundary, rightBoundary, leftWall, rightWall;

let Spikes = [];
let Platforms = []

let ScoreBoard = {
    lives: 2,
    score: 0, // int
    digits: [0, 0, 0, 0, 0, 0, 0, 0], // array of ints
    sprites: [], // Array of sprites
    scorePosition: 0,
}

function preload() {
    ballSprite = loadImage("Sprites/ball.png");

    zeroSprite = loadImage("Sprites/0.png");
    oneSprite = loadImage("Sprites/1.png");
    twoSprite = loadImage("Sprites/2.png");
    threeSprite = loadImage("Sprites/3.png");
    fourSprite = loadImage("Sprites/4.png");
    fiveSprite = loadImage("Sprites/5.png");
    sixSprite = loadImage("Sprites/6.png");
    sevenSprite = loadImage("Sprites/7.png");
    eightSprite = loadImage("Sprites/8.png");
    nineSprite = loadImage("Sprites/9.png");

    livesSprite = loadImage("Sprites/lives.png");
    xSprite = loadImage("Sprites/x.png");
}

function setup() {
    new Canvas(CANVASWIDTH * SCALE, CANVASHEIGHT * SCALE);
    background(NONBLINDINGCOLOUR);
    //loadSprites();
    loadGUI();
    initialisePlatforms();
    initialiseBall();
    initialiseScoreBoard();

    world.gravity.y = 0
}

function draw() {
    background(NONBLINDINGCOLOUR);


    stroke(0);
    strokeWeight(1 * SCALE);
    strokeCap(PROJECT);

    //line(leftBoundary, topBoundary, rightBoundary, topBoundary);
    line(leftBoundary, topBoundary, leftBoundary, effectiveCanvasHeight)
    line(rightBoundary, topBoundary, rightBoundary, effectiveCanvasHeight);

    line(leftWall, topBoundary, leftWall, effectiveCanvasHeight);
    line(rightWall,topBoundary, rightWall, effectiveCanvasHeight);
    //updateScoreBoard();

    text(frameCount, 10, 10)    
    //moveBall();
}

function loadGUI() {
    topBoundary = effectiveCanvasHeight * 0.18 ;
    leftBoundary = effectiveCanvasWidth * 0.05 ;
    rightBoundary = effectiveCanvasWidth - leftBoundary;

    leftWall = leftBoundary / 4;
    rightWall = effectiveCanvasWidth - leftWall;
}

function initialiseBall() {
    let Ball = new Sprite();
    Ball.img = ballSprite;
    Ball.scale = SCALE;
    Ball.debug = false;
    Ball.collider = 'k';
    Ball.x = 300;
    Ball.y = 300;
}

function initialiseSpikes() {
    let numberOfSpikes = 0; // Get from json
    for (i = 0; i < numberOfSpikes; i++) {
        let spikes = new Sprite();
        spikes.img = floorSpikesSprite;
        Spikes.push(spikes);
    }
}

function initialisePlatforms() {
    let numberOfPlatforms = 1;
    for (i = 0; i < numberOfPlatforms; i++) {
        let platform = new Sprite(effectiveCanvasWidth / 2, effectiveCanvasHeight)
        platform.h = 100;
        platform.w = effectiveCanvasWidth;
        platform.collider = 'static';
        Platforms.push(platform);
    }
}

function initialiseScoreBoard() {
    n = 8
    for (i = 0; i < n; i++) {
        let digit = new Sprite(zeroSprite);
        //digit.img = zeroSprite;
        digit.scale = SCALE * 2.5
        digit.pixelPerfect = true;
        digit.debug = false;
        ScoreBoard.scorePosition = rightBoundary - (digit.w * 6.5)
        digit.y = topBoundary / 2;
        digit.x = ScoreBoard.scorePosition + (digit.w * i * 0.9);
        digit.collider = 'k';
        digit.addImage


        ScoreBoard.sprites.push(digit);
    }

    let livesSymbol = new Sprite();
    livesSymbol.img = livesSprite;
    livesSymbol.x = leftBoundary;
    livesSymbol.y = topBoundary / 2;
    livesSymbol.scale = SCALE * 2.5;
    livesSymbol.collider = 'k';


    let xSymbol = new Sprite();
    xSymbol.img = xSprite;
    xSymbol.x = leftBoundary + livesSymbol.w;
    xSymbol.y = topBoundary / 2;
    xSymbol.scale = SCALE * 2.5;
    xSymbol.collider = 'k';

    let livesValueSymbol = new Sprite();
    livesValueSymbol.img = twoSprite;
    livesValueSymbol.x = leftBoundary + (livesSymbol.w * 2);
    livesValueSymbol.y = topBoundary / 2;
    livesValueSymbol.scale = SCALE * 2.5;
    livesValueSymbol.collider = 'k';

}

function moveBall() {
    Ball.moveTowards(mouse, 0.10)
}

function updateScoreBoard() {
    let n;
    for (i = 0; i < ScoreBoard.digits.length(); i++) {
        n = 10 * (ScoreBoard.digits.length() - i);
        ScoreBoard.digits[i] = ScoreBoard.score / n;
        switch(ScoreBoard.digits[i]) {
            case 0:
                ScoreBoard.sprites[i].img = zeroSprite;
                break;
            case 1:
                ScoreBoard.sprites[i].img = oneSprite;
                break;
            case 2:
                ScoreBoard.sprites[i].img = twoSprite;
                break;
            case 3:
                ScoreBoard.sprites[i].img = threeSprite;
                break;
            case 4:
                ScoreBoard.sprites[i].img = fourSprite;
                break;
            case 5:
                ScoreBoard.dispritesgits[i].img = fiveSprite;
                break;
            case 6:
                ScoreBoard.sprites[i].img = sixSprite;
                break;
            case 7:
                ScoreBoard.sprites[i].img = sevenSprite;
                break;
            case 8:
                ScoreBoard.sprites[i].img = eightSprite;
                break;
            case 9:
                ScoreBoard.sprites[i].img = nineSprite;
                break;
        }
    }
} 