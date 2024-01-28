const CANVASWIDTH = 256;
const CANVASHEIGHT = 256;


let hue = [255, 143, 238]

let colour1 = [20, 20, 20, 255]
let colour2 = [60, 60, 60, 255]
let colour3 = [100, 100, 100, 255]
let colour4 = [140, 140, 140, 255]
let colour5 = [180, 180, 180, 255]

let currentScene = 0; //have some sort of key and in draw() do if (scene == 1) {} etc

let n;
let Player, player_collider_bottom, player_collider_left, player_collider_right;
let player_sprite
let mainBackgroundImg, smallBackgroundImg;
let backGroundActualPos = -712
let stageInfo1;

let Platforms, Walls;

let currentLevel;
let object = 0;

let menuOptions, menuBox_sprite, highlighted_menuBox_sprite;

let overlay
let gameRunning = false;

let levelLoaded = false;
let menuLoaded = false;


let DEBUG = 0;

let Input = {
    movement: {
        jump: false,
        dash: false,
        grab: false,
        left: false,
        right: false
    },
    menu: {
        confirm: false,
        left: false,
        right: false
    }
}


function preload() {
    mainBackgroundImg = loadImage('Sprites/mountain_background_big.png')
    smallBackgroundImg = loadImage('Sprites/mountain_background.png')
    player_sprite = loadImage('Sprites/player.png')
    menuBox_sprite = loadImage('Sprites/menu_box.png')
    highlighted_menuBox_sprite = loadImage('Sprites/menuBox_H.png')
    overlay = loadImage('Sprites/overlay.png')
    stageInfo1 = loadJSON('Code/level_1.json')
}

function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')

    allSprites.pixelPerfect = true;
    initialisePlatforms();
    initialiseWalls()
    //initialiseLevel();
    initialisePlayer();
    initialiseMenu();

    world.gravity.y = 3

    transitionScene(1, 2000);
}

function draw() {
    background(0)
    frameRate(60);
    renderStats(0, 0)
    //getKeyPressed();
    text(round(frameRate(), 1), 30, 30)
    if (currentScene == 0) {              //loading screen
        allSprites.visible = false;
        image(smallBackgroundImg, 64, 64)
        textAlign(CENTER)
        textSize(20)
        fill(255)
        if (frameCount % 120 <= 30) {
            text("Loading   ", 128, 215);
        } else if (frameCount % 120 <= 60) {
            text("Loading.  ", 128, 215);
        } else if (frameCount % 120 <= 90) { 
            text("Loading.. ", 128, 215);
        } else if (frameCount % 120 <= 120) {
            text("Loading...", 128, 215);
        }
        image(overlay, 64, 64, 128, 128)
    } else if (currentScene == 1) {  // main menu
        //image(smallBackgroundImg, 64, 64)
        allSprites.visible = false;
        textAlign(CENTER); 
        textSize(20)

        loadMenu();
        menu();

        menuOptions.draw();
        text("Menu", 128, 40);
        textSize(12)
        text("New Game", 64, 85)        
        text("Settings", 196, 85)
        text("High Scores", 64, 145)
        text("How to Play", 196, 145)
        image(overlay, 0, 0, 256, 256)
    } else if (currentScene == 2) {        // leaderboard

    } else if (currentScene == 3) {        // game
        image(mainBackgroundImg,0 , 0)
        Player.visible = true;
        if (levelLoaded == false ) {
            initialiseLevel();
            levelLoaded = true;
        }
        movePlayer();
    }
    //tint(200)

    //moveCamera();
    //noTint(); 
}

function initialisePlayer() {
    Player = new Sprite();
    Player.img = player_sprite;
    Player.rotationLock = true;
    //Player.mass = 1;
    Player.dashCooldown = 1000;
    Player.dashOnCooldown = false;
    Player.movementLocked = false;
    Player.facingDirection = 'right';
    Player.jumps = 0;
    Player.maxJumps = 2;
    Player.jumpHeight = 1.8;
    Player.touchingWall = false;


    player_collider_bottom = new Sprite();
    player_collider_bottom.collider = 'n'
    player_collider_bottom.w = Player.w;
    player_collider_bottom.h = 2;
    player_collider_bottom.x = Player.x;
    player_collider_bottom.y = Player.y + (0.6 * Player.h);
    player_collider_bottom.visible = false;
    player_collider_bottom.mass = 0.01;

    player_collider_left = new Sprite();
    player_collider_left.collider = 'n';
    player_collider_left.w = 2;
    player_collider_left.h = Player.h * 0.8;
    player_collider_left.x = Player.x - (0.5 * Player.w);
    player_collider_left.y = Player.y;
    player_collider_left.visible = false;
    player_collider_left.mass = 0.01;

    player_collider_right = new Sprite()
    player_collider_right.collider = 'n';
    player_collider_right.w = 2;
    player_collider_right.h = Player.h * 0.8;
    player_collider_right.x = Player.x + (0.5 * Player.w);
    player_collider_right.y = Player.y;
    player_collider_right.visible = false;
    player_collider_right.mass = 0.01;

    let joint_bottom = new GlueJoint(Player, player_collider_bottom);
    joint_bottom.visible = false;

    let joint_left = new GlueJoint(Player, player_collider_left);
    joint_left.visible = false;

    let joint_right = new GlueJoint(Player, player_collider_right);
    joint_right.visible = false;
}

function initialisePlatforms() {
    Platforms = new Group();
    Platforms.colour = 0;
    Platforms.collider = 's';
    Platforms.h = 10
}

function initialiseWalls() {
    Walls = new Group();
    Walls.colour = 0;
    Walls.collider = 's';
    Walls.w = 10;
}

function initialiseMenu() {
    menuOptions = new Group();
    menuOptions.collider = 'n';
    menuOptions.img = menuBox_sprite;
    menuOptions.visible = false;
    menuOptions.scale = 2;
}

function spawnPlatforms() {
    for (i = 0; i < stageInfo1.number_of_platforms; i++) {
        let platform_ = new Platforms.Sprite();
        let jsonData = getPlatform(i);
        platform_.visible = true;
        platform_.x = jsonData[0];
        platform_.y = jsonData[1];
        platform_.w = jsonData[2];
    }
}

function spawnWalls() {
    for (i = 0; i < stageInfo1.number_of_walls; i++) {
        let wall_ = new Walls.Sprite();
        let jsonData = getWall(i);
        wall_.visible = true;
        wall_.x = jsonData[0];
        wall_.y = jsonData[1];
        wall_.h = jsonData[2];
    }
}

function getPlatform(index) { // returns [x, y, w]
    let platform_ = [];
    platform_[0] = stageInfo1.objects.platforms[index].x_pos;
    platform_[1] = stageInfo1.objects.platforms[index].y_pos;
    platform_[2] = stageInfo1.objects.platforms[index].size;
    return platform_;
}

function getWall(index) { 
    let wall_ = [];
    wall_[0] = stageInfo1.objects.walls[index].x_pos;
    wall_[1] = stageInfo1.objects.walls[index].y_pos;
    wall_[2] = stageInfo1.objects.walls[index].size;
    return wall_;
}


function moveCamera() {

}

function initialiseLevel() {
    spawnPlatforms();
    spawnWalls();

    Walls.visible = true;
    Platforms.visible = true;

    Player.x = stageInfo1.start_pos[0];
    Player.y = stageInfo1.start_pos[1];
}

function movePlayer() {
    if (player_collider_left.overlapping(Walls) || player_collider_right.overlapping(Walls) ||
    player_collider_left.overlapping(Platforms)) {
        Player.touchingWall = true;
    } else {
        Player.touchingWall = false;
    }
    if (Player.movementLocked == false) {
        if (Input.grab == true && Player.touchingWall == true && !kb.pressing('up')) {
            grabWall();
        }
        if (Player.touchingWall == false) {
            if (kb.pressing('left')) {
                Player.vel.x = -1;
                Player.facingDirection = 'left';
            } else if (kb.pressing('right')) {
                Player.vel.x = 1;
                Player.facingDirection = 'right';
            } else {
                Player.vel.x = 0;
            }
        }

        if (kb.presses('up') || kb.presses('space')) {
            playerJump();
        }

        if (kb.presses('x')) {
            playerDash();
        }
    }
}

function playerJump() {
    if (Player.touchingWall == true) {
        if (player_collider_left.overlapping(Walls) && kb.pressing('z')) {
            Player.vel.x = 2;
            //Player.vel.y = -(Player.jumpHeight);
        } else if (player_collider_right.overlapping(Walls) && kb.pressing('z')) {
            Player.vel.x = -2;
            //Player.vel.y = -(Player.jumpHeight);
        }
        Player.vel.y = -(Player.jumpHeight);
        Player.jumps++;
    } else if (player_collider_bottom.overlapping(Platforms)) {
        setJumps(0);
        Player.vel.y = -(Player.jumpHeight);
        Player.jumps++;
    } else if (Player.jumps < Player.maxJumps) {
        Player.vel.y = -(Player.jumpHeight);
        Player.jumps++;
    }
} 

function setJumps(val) {
    Player.jumps = val;
}

function grabWall() {
    Player.vel.y = 0;
    Player.vel.x = 0;
    setJumps(1);
}

function playerDash() {
    if (Player.dashOnCooldown == false) {
        if (Player.facingDirection == 'right') {
            Player.vel.x = 20
        } else if (Player.facingDirection == 'left') {
            Player.vel.x = -20
        }
        dashCooldown();
    }
}

async function dashCooldown() {
    await sleep(1);
    Player.dashOnCooldown = true;
    await sleep(Player.dashCooldown);
    Player.dashOnCooldown = false;
}

async function transitionScene(scene, time) {
    currentScene = 0;
    await sleep(time);
    currentScene = scene;
}

function loadMenu() {
    if (menuLoaded == false) {
        for (i = 0; i < 6; i++) {
            let menuOptions_ = new menuOptions.Sprite();
            if (i < 3) {
                menuOptions_.x = 64    
            } else {
                menuOptions_.x = 196
            } 
            if (i % 3 == 0) {
                menuOptions_.y = 80;
            } else if (i % 3 == 1) {
                menuOptions_.y = 140;
            } else {
                menuOptions_.y = 200;
            }
        }
    menuLoaded = true;
    }
    menuOptions.visible = true;

}


function menu() {
    for (i = 0; i < 6; i++) {
        if(mouseX >= menuOptions[i].x - (menuOptions[i].w / 2) && mouseX <= menuOptions[i].x + (menuOptions[i].w / 2) &&
            mouseY >= menuOptions[i].y - (menuOptions[i].h / 2) && mouseY <= menuOptions[i].y + (menuOptions[i].h / 2)) {
                menuOptions[i].img = highlighted_menuBox_sprite;
                if (mouseIsPressed === true) {
                    menuPressed(i)
            }
        } else {
            menuOptions[i].img = menuBox_sprite;
        }
    }
}

function menuPressed(num) { // 0 is top left, 1 is below etc and then 3 is top right, 4 is below etc
    switch (num) {
        case 0:
            DEBUG = 0;
            newGame();
            break;
        case 1:
            DEBUG = 1;
            break;
        case 2:
            DEBUG = 2;
            break;
        case 3:
            DEBUG = 3;
            break;
        case 4:
            DEBUG = 4;
            break;
        case 5:
            DEBUG = 5;
            break;
    }
}

function newGame() {
    transitionScene(3, 2000);
    gameRunning = true;
    currentLevel = 1;
}

function getKeyPressed() {
    if (kb.pressing('up' || kb.pressing('space'))) {
        Input.movement.jump = true;
    } else {
        Input.movement.jump = false
    }

    if (kb.pressing('right')) {
        Input.movement.right = true;
        Input.menu.right = true;
    } else {
        Input.movement.right = false;
        Input.movement.right = false;
    }

    if (kb.pressing('left')) {
        Input.movement.left = true;
        Input.menu.left = true;
    } else {
        Input.movement.left = false;
        Input.menu.left = false;
    }

    if (kb.pressing('z') || kb.pressing('shift')) {
        Input.movement.dash = true;
    } else {
        Input.movement.dash = false;
    }

    if (kb.pressing('x') || kb.pressing('down')) {
        Input.movement.grab = true;
    } else {
        Input.movement.grab = false;
    }
}






