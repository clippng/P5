// Rapid roll

const CANVASHEIGHT = 180;
const CANVASWIDTH = 250;

// use .overlaps() for hearts
let interval; // How far between obstacles

const numberOfPlatforms = 6;

const BACKGROUNDCOLOUR = [189, 185, 89];
const NONBLINDINGCOLOUR = 150

let ballSprite,death1Sprite, death2Sprite, heartSprite, livesSprite,
platformSprite, floorSpikesSprite, roofSpikesSprite


let topBoundary, leftBoundary, rightBoundary, leftWall, rightWall;

let speed = 0.2; // might want to normalise this ie speed / 10 = actual speed 1 would be slowest 10 would be fastest

let Spikes;

let font;

let ball;

let layout;

let Platforms;

let obstacle = 0;

let wallSpacing = CANVASHEIGHT / 7;

let wallPositions = []

let livesSymbol

let previousY;

let ScoreBoard = {
    lives: 2,
    score: 0, // int
    scorePosition: 0,
}

function preload() {
    ballSprite = loadImage("Sprites/ball.png");
    platformSprite = loadImage("Sprites/platform.png")
    roofSpikesSprite = loadImage("Sprites/topSpikes.png")

    spikeSprite = loadImage("Sprites/spikes.png")
    livesSprite = loadImage("Sprites/lives.png");

    gameOver = loadImage("Sprites/gameOver.png")

    font = loadFont('joystix-monospace.otf')
    //font = loadFont('PressStart2P-vaV7.ttf')

    layout = loadJSON('layout.json');
}

function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated');
    background(NONBLINDINGCOLOUR);

    allSprites.pixelPerfect = true;
   
    world.gravity.y = 1 // IDK bro i hate gravity but it makes the physics so easy
    //loadSprites();
    loadGUI();
    initialisePlatforms();
    initialiseSpikes();
    initialiseBall();
    initialiseScoreBoard();
    initialiseWalls();
}

function draw() {
    background(NONBLINDINGCOLOUR);
    update();

    stroke(0);
    strokeWeight(4);
    strokeCap(PROJECT);

    //line(leftBoundary, topBoundary, rightBoundary, topBoundary);
    line(leftBoundary, topBoundary, leftBoundary, CANVASHEIGHT)
    line(rightBoundary, topBoundary, rightBoundary, CANVASHEIGHT);

    line(leftWall, topBoundary, leftWall, CANVASHEIGHT);
    line(rightWall,topBoundary, rightWall, CANVASHEIGHT);

    // Walls
    for (i = 0; i < 7; i++) {
        line(leftWall, wallPositions[i], leftBoundary, wallPositions[i])
        line(rightWall, wallPositions[i], rightBoundary, wallPositions[i])
    }

    fill(0)
    rect(ScoreBoard.scorePosition, topBoundary / 5, 160, topBoundary * 0.6) // fix vatiables 
    rect(CANVASWIDTH * 0.05, topBoundary / 5, 60, topBoundary * 0.6)

    fill(NONBLINDINGCOLOUR)
    text(getScore(), ScoreBoard.scorePosition, topBoundary * 0.75);  
    let livesString = 'x' + ScoreBoard.lives;
    text(livesString, CANVASWIDTH * 0.1, topBoundary * 0.75)
}

function update() {
    moveBall();
    collisionCheck();
    updatePlatforms();
    animateWalls();
    addPoints();

    if (ScoreBoard.lives < 0) {
        endGame();
    }
}   

function loadGUI() {
    topBoundary = CANVASHEIGHT * 0.18 ;
    leftBoundary = CANVASWIDTH * 0.1 ;
    rightBoundary = CANVASWIDTH - leftBoundary;

    leftWall = leftBoundary / 4;
    rightWall = CANVASWIDTH - leftWall;

}

function collisionCheck() {
    if (ball.y > CANVASHEIGHT || ball.colliding(Spikes)) {
        killPlayer();
    }
    for (i = 0; i < Platforms.length; i++) {
        if (ball.colliding(Platforms[i])) {
            if (Platforms[i].type == 'spike') {
                killPlayer();
            }
        }
    }

    if (ball.x - ball.hw <= leftBoundary) {
        ball.x = leftBoundary + ball.hw;
    } else if (ball.x + ball.hw >= rightBoundary) {
        ball.x = rightBoundary - ball.hw;
    }
}

function updatePlatforms() {
    loadPlatform(); //rename
}

function initialiseBall() { // make ball kinematic ditch gravity
    ball = new Sprite();
    ball.img = ballSprite;
    ball.collider = 'd';
    ball.rotationLock = true;
    ball.bounciness = 0;
    ball.w = 10;
    ball.h = 10
    //ball.debug = true;
    ball.friction = 0;
    ball.drag = 0;
    ball.shape = 'box';
    
    previousY = ball.y
}

function initialisePlatforms() { // organise based off json have some sort of loading / unloading once off screen
    interval = (CANVASHEIGHT - topBoundary) / 6;
    Platforms = new Group();
    Platforms.collider = 'k'
    Platforms.color = 0;
    Platforms.type = 'platform'
    Platforms.direction = 270;
    Platforms.speed = speed;
    //Platforms.scale = 1;
    //Platforms.debug = true;

    for (i = 0; i < numberOfPlatforms; i++) {
        let platform = new Platforms.Sprite();
        platform.x = getNextObstaclePosition();
        platform.y = topBoundary + (i * interval);
        platform.loaded = true;
        if (layout.layout[i].type == 'spike') {
            platform.type == 'spike';
            platform.img = spikeSprite;
        } else if (layout.layout[i].type == 'platform') {
            platform.img = platformSprite
        }
        obstacle++
    }
}

function start() {
    // wait a second or so and then respawn on closest safe platform to the middle
    // also on first play display ready sign
    ball.x = CANVASWIDTH / 2;
    ball.y = CANVASHEIGHT / 2
}

function loadPlatform() {
    for (i = 0; i < Platforms.length; i++) {
        if (Platforms[i].y < topBoundary) {
            Platforms[i].y = CANVASHEIGHT;
            Platforms[i].x = getNextObstaclePosition();
            Platforms[i].type = getNextObstacleType();

            if (Platforms[i].type == 'spike') {
                Platforms[i].img = spikeSprite;
            } else {
                Platforms[i].img = platformSprite;
            }
            obstacle++
        }
    }
}


function moveBall() {
    if (kb.pressing('left')) {
        ball.vel.x = -0.5;
    } else if (kb.pressing('right')) {
        ball.vel.x = 0.5
    } else {
        ball.vel.x = 0;
    }
}

function initialiseSpikes() {
    Spikes = new Sprite();
    Spikes.img = roofSpikesSprite;
    Spikes.y = topBoundary * 1.1; // align and fix
    Spikes.x = CANVASWIDTH / 2;
    Spikes.collider = 's';
}

function initialiseScoreBoard() {;
    textSize(24);
    textFont(font);
    ScoreBoard.scorePosition = leftBoundary * 3.3
}


function getScore() {
    let scoreString = ScoreBoard.score.toString();
    scoreString = scoreString.padStart(8, "0")
    return scoreString;
} 

function getNextObstacleType() {
    if (layout.layout[obstacle] == null) {
        obstacle = 0;
    }
    return layout.layout[obstacle].type;
}

function getNextObstaclePosition() {
    if (layout.layout[obstacle] == null) {
        obstacle = 0;
    }
    return layout.layout[obstacle].position;
}

function killPlayer() {
    // play death anim
    ScoreBoard.lives -= 1;
    start();
}

function initialiseWalls() { // fix initial spacing
    for (i = 0; i < 7; i++) {
        let x;
        x = (i * wallSpacing);
        wallPositions.push(x);
    }
}

function animateWalls() {
    for (i = 0; i < 7; i++) {
        if (wallPositions[i] < topBoundary) {
            wallPositions[i] = CANVASHEIGHT
        }
        wallPositions[i] -= speed;
    }
}

function findRespawnPosition() {
    //find closest non spike platform and return the x,y of the middle of the platform
}

function addPoints() { // fix
    let points;
    points = ball.y - previousY;

    if (points > 0.1) {
        ScoreBoard.score++;
    }

    previousY = ball.y;
}

function endGame() { // align
    ScoreBoard.lives = 0;
    image(gameOver, 50, 50, CANVASWIDTH * 0.6, CANVASHEIGHT * 0.2) // draw a rect of background colour behind it
    noLoop();
}