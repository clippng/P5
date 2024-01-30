const CANVASWIDTH = 256;
const CANVASHEIGHT = 256;

// do player animations
// make each object have a cooldown for grab / wall kick
let currentScene = 0; 

let n;
let Player, player_collider_bottom, player_collider_left, player_collider_right;
let player_sprite, player_run_anim, player_grab_anim, player_wall_jump_anim;
let mainBackgroundImg, smallBackgroundImg;
let backGroundActualPos = -712
let current_stage_json, level_1_json, level_2_json;
let scene_cache;

let light_spikes, dark_spikes;
let clouds = []

let grassN, grassE, grassS, grassW, grassNE, grassSE, grassSW, grassNW, grassM, grassNEC, grassSEC, grassSWC, grassNWC;

let currentLevel;
let object = 0;

let Tiles

let menuOptions, menuBox_sprite, highlighted_menuBox_sprite;

let ball_sprite;

let overlay
let gameRunning = false;

let levelLoaded = false;
let menuLoaded = false;
let selected_menu = 0;


let grab_platform;


let DEBUG = 0;

const Input = {
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
        right: false,
        up: false,
        down: false
    }
};


const Clouds = {
    x_pos: [],
    y_pos: [30, 65, 100, 135, 170, 205],
    sprite: [],
    speed: 0.05
};


function preload() {
    mainBackgroundImg = loadImage('Sprites/Other/mountain_background_big.png')
    smallBackgroundImg = loadImage('Sprites/Other/mountain_background.png')
    player_sprite = loadImage('Sprites/Player/player.png')
    menuBox_sprite = loadImage('Sprites/Other/menu_box.png')
    highlighted_menuBox_sprite = loadImage('Sprites/Other/menuBox_H.png')
    ball_sprite = loadImage('Sprites/Obstacles/ball_obstacle.png')
    overlay = loadImage('Sprites/Other/overlay.png')
    dark_spikes = loadImage('Sprites/Obstacles/dark_spikes.png')
    light_spikes = loadImage('Sprites/Obstacles/light_spikes.png')

    clouds[0] = loadImage('Sprites/Clouds/cloud_1.png');
    clouds[1] = loadImage('Sprites/Clouds/cloud_2.png');
    clouds[2] = loadImage('Sprites/Clouds/cloud_3.png');
    clouds[3] = loadImage('Sprites/Clouds/cloud_4.png');
    clouds[4] = loadImage('Sprites/Clouds/cloud_5.png');
    
    grassN = loadImage('Sprites/Terrain/Grass/grass_N.png');
    grassE = loadImage('Sprites/Terrain/Grass/grass_E.png');
    grassS = loadImage('Sprites/Terrain/Grass/grass_S.png');
    grassW = loadImage('Sprites/Terrain/Grass/grass_W.png');
    grassNE = loadImage('Sprites/Terrain/Grass/grass_NE.png');
    grassSE = loadImage('Sprites/Terrain/Grass/grass_SE.png');
    grassSW = loadImage('Sprites/Terrain/Grass/grass_SW.png'); 
    grassNW = loadImage('Sprites/Terrain/Grass/grass_NW.png');
    grassM = loadImage('Sprites/Terrain/Grass/grass_M.png');
    grassNEC = loadImage('Sprites/Terrain/Grass/grass_NEC.png'); 
    grassSEC = loadImage('Sprites/Terrain/Grass/grass_SEC.png');
    grassSWC = loadImage('Sprites/Terrain/Grass/grass_SWC.png');
    grassNWC = loadImage('Sprites/Terrain/Grass/grass_NWC.png');;



    current_stage_json = loadJSON('Code/level_2.json')
    level_1_json = loadJSON('Code/level_1.json');
    level_2_json = loadJSON('Code/level_2.json');
}

function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')

    allSprites.pixelPerfect = true;
    initialisePlatforms();
    initialiseWalls()
    initialisePlayer();
    initialiseMenu();
    initialiseObstacles();
    initialiseTiles();

    world.gravity.y = 5

    transitionScene(1, 2000);
}

function draw() {
    background(0)
    frameRate(60);
    //renderStats(0, 0)
    getKeyPressed();
    sceneHandler();
    //text(getTile(140), 50, 50)
    if (currentScene == 0) {              //loading screen
        loadingScreen();
    } else if (currentScene == 1) {  // main menu
        mainMenu();
    } else if (currentScene == 2) {        // select save
        loadMenu(1);
    } else if (currentScene == 3) {        // game
        game();
    } else if (currentScene == 4) { // high scores

    } else if (currentScene == 5) { // how to play

    } else if (currentScene == 6) { // settings

    }
    if (currentScene != 0) {
        //allSprites.draw();
        image(overlay, 0, 0, 256, 256)
    }
}

function loadingScreen() {
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
}

function mainMenu() {
    allSprites.visible = false;
    textAlign(CENTER); 
    textSize(20)

    loadMenu(0);
    menuSelect();
    highlightMenu();

    text("Menu", 128, 40);
}

function game() {
    image(mainBackgroundImg,0 , 0)
    Player.visible = true;
    if (levelLoaded == false ) {
        initialiseLevel();
        levelLoaded = true;
    }


    atmosphere();
    movePlayer();
    moveCamera();
}

function initialisePlayer() {
    Player = new Sprite();
    Player.w = 64;
    Player.h = 64;
    Player.img = player_sprite;
    Player.rotationLock = true;
    Player.mass = 1000;
    Player.bounciness = 0.001
    Player.dashCooldown = 1000;
    Player.dashOnCooldown = false;
    Player.movementLocked = false;
    Player.facingDirection = 'right';
    Player.jumps = 0;
    Player.maxJumps = 2;
    Player.jumpHeight = 2.5;
    Player.touchingWall = false;
    Player.holdingWall = false;
    Player.jumping = false;
    
    Player.removeColliders()
    Player.addCollider(1, 8, 12, 17)

    Player.spriteSheet = 'Sprites/Player/player_sprite_sheet.png'
    Player.anis.frameDelay = 10

    Player.addAnis({
        idle: { width: 32, height: 32, y: 0, frames: 1, frameDelay: 0 },
        run: { width: 32, height: 32, x: 32, y: 0, frames: 5, frameDelay: 0 },
        jump: { width: 32, height: 32, x: 192, y: 0, frams: 1, frameDelay: 0 },
        fall: { width: 32, heigh: 32, x: 224, y: 0, frames: 1, frameDelay: 0 },
        grab: { width: 32, height: 32, x: 256, y: 0, frames: 1, frameDelay: 0 },
        wall_jump: { width: 32, height: 32, x: 288, y: 0, frames: 1, frameDelay: 0 }
    });
    Player.changeAni('idle')

    player_collider_bottom = new Sprite();
    player_collider_bottom.collider = 'n'
    player_collider_bottom.w = Player.hw;
    player_collider_bottom.h = 2;
    player_collider_bottom.x = Player.x + 1;
    player_collider_bottom.y = Player.y + (0.6 * Player.h) + 8;
    player_collider_bottom.visible = false;
    player_collider_bottom.mass = 0.01;

    player_collider_left = new Sprite();
    player_collider_left.collider = 'n';
    player_collider_left.w = 2;
    player_collider_left.h = Player.h * 0.8;
    player_collider_left.x = Player.x - (0.5 * Player.w) + 1;
    player_collider_left.y = Player.y + 8;
    player_collider_left.visible = false;
    player_collider_left.mass = 0.01;

    player_collider_right = new Sprite()
    player_collider_right.collider = 'n';
    player_collider_right.w = 2;
    player_collider_right.h = Player.h * 0.8;
    player_collider_right.x = Player.x + (0.5 * Player.w) + 1;
    player_collider_right.y = Player.y + 8;
    player_collider_right.visible = false;
    player_collider_right.mass = 0.01;

    let joint_bottom = new GlueJoint(Player, player_collider_bottom);
    joint_bottom.visible = false;

    let joint_left = new GlueJoint(Player, player_collider_left);
    joint_left.visible = false;

    let joint_right = new GlueJoint(Player, player_collider_right);
    joint_right.visible = false;
}

function initialiseTiles() {
    Tiles = new Group();
    Tiles.w = 16;
    Tiles.h = 16;
    Tiles.collider = 's';
}

function initialisePlatforms() {
    Platforms = new Group();
    Platforms.colour = 0;
    Platforms.collider = 's';
    Platforms.h = 10
}

function initialiseWalls() {
    Tiles = new Group();
    Tiles.colour = 0;
    Tiles.collider = 's';
    Tiles.w = 10;
}

function initialiseObstacles() {
    RollingRocks = new Group();
    RollingRocks.img = ball_sprite;
    RollingRocks.friction = 0;

    RoofSpikes = new Group();

    WallSpikes = new Group();
}

function initialiseMenu() {
    menuOptions = new Group();
    menuOptions.collider = 'n';
    menuOptions.img = menuBox_sprite;
    menuOptions.visible = false;
    menuOptions.scale = 2;
}

function spawnTiles() {
    let n = current_stage_json.rows * current_stage_json.columns
    for (i = 0; i < n; i++) {
        let tile_ = getTile(i)
        console.log(tile_)
        switch (tile_) {
            case '/':
                break;
            case 'p':
                let tile = new Tiles.Sprite();
                let pos = getTilePosition(i);
                tile.x = pos.y
                tile.y = pos.x
                tile.visible = true
                break;
            case 'w':
                //wall
                break;
        }
        
    }
}

function updateTiles() {
// called every time a new row is neededz
}


function spawnObstacles() {
    for (i = 0; i < current_stage_json.number_of_obstacles; i++) {
        let jsonData = getObstacle(i)
        if (jsonData[0] = "rolling_rock") {
            let obstacle_ = new RollingRocks.Sprite()
            obstacle_.applyTorque(1)
            obstacle_.x = jsonData[1];
            obstacle_.y = jsonData[2];
            obstacle_.shape = 'circle'
        }
    }
}

function getObstacle(index) {
    let obstacle_ = [];
    obstacle_[0] = current_stage_json.objects.obstacles[index].type;
    obstacle_[1] = current_stage_json.objects.obstacles[index].x_pos;
    obstacle_[2] = current_stage_json.objects.obstacles[index].y_pos;

    return obstacle_;
}

function moveCamera() {
    //camera.y = round(Player.y)
}

function initialiseLevel() {
    //spawnPlatforms();
    //spawnWalls();
    //spawnObstacles();
    spawnTiles();
    //Walls.visible = true;
    //Platforms.visible = true;
    //RollingRocks.visible = true;
    Tiles.visible = true;

    Player.x = 30//current_stage_json.start_pos[0];
    Player.y = 200//current_stage_json.start_pos[1];
}

function movePlayer() {
    if (player_collider_left.overlapping(Tiles) || player_collider_right.overlapping(Tiles)) {
        Player.touchingWall = true;
    } else {
        Player.touchingWall = false;
    }
    if (player_collider_bottom.overlapping(Tiles)) {
        Player.jumping = false;
        setJumps(1)
    }
    if (Player.movementLocked == false) {
        if (Input.movement.grab == true && Player.touchingWall == true && Input.movement.jump == false) {
            grabWall();
        } else if (Player.holdingWall == true) {
            releaseWall();
        }
        if (Player.holdingWall == false) {
            if (Input.movement.left == true && !(player_collider_left.overlapping(Tiles))) {
                Player.vel.x = -1;
                Player.facingDirection = 'left';
            } else if (Input.movement.right == true && !(player_collider_right.overlapping(Tiles) || 
            player_collider_right.overlapping(Platforms))) {
                Player.vel.x = 1;
                Player.facingDirection = 'right';
            } else {
                Player.vel.x = 0;
            }
        }

        if (Input.movement.jump == true) {
            playerJump();
            Player.jumping = true;
        }

        if (Input.movement.dash == true) {
            playerDash();
        }
    }
    animatePlayer();
}

function playerJump() {
    if (Player.touchingWall == true) {
        if (player_collider_left.overlapping(Tiles) && Player.holdingWall == true) {
            Player.vel.x = 10;
        } else if (player_collider_right.overlapping(Tiles) && Player.holdingWall == true) {
            Player.vel.x = -10;
        }
        Player.vel.y = -(Player.jumpHeight);
        Player.jumps++;
    } else if (player_collider_bottom.overlapping(Tiles)) {
        setJumps(1);
        Player.vel.y = -(Player.jumpHeight);
    } else if (Player.jumps < Player.maxJumps) {
        Player.vel.y = -(Player.jumpHeight);
        Player.jumps++;
    }
} 

function setJumps(val) {
    Player.jumps = val;
}

function grabWall() {
    if (Player.holdingWall == false) {
        grab_platform = new Sprite(player_collider_bottom.x, player_collider_bottom.y + 1, Player.w, 1, 's');
        grab_platform.visible = false;
    }
    Player.jumping = false;
    Player.holdingWall = true;
}

function releaseWall() {
    grab_platform.remove();
    Player.holdingWall = false;
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

function animatePlayer() {
    if (Player.facingDirection == 'left') {
        Player.mirror.x = true;
    } else {
        Player.mirror.x = false;
    }


    if (Player.jumping == true && (Input.movement.left == true || Input.movement.right == true)) {
        Player.changeAni('jump')
    } else {
        Player.changeAni('idle')
    }

    if (Input.movement.left == true && (player_collider_bottom.overlapping(Platforms) || player_collider_bottom.overlapping(Tiles))) {
        Player.changeAni('run');
    } else if (Input.movement.right == true && (player_collider_bottom.overlapping(Platforms) || player_collider_bottom.overlapping(Tiles))) {
        Player.changeAni('run')
    } else if (player_collider_bottom.overlapping(Platforms) || player_collider_bottom.overlapping(Tiles)) {
        Player.changeAni('idle')
    }

    if (Player.holdingWall == true && Input.movement.jump == true) {
        Player.changeAni('wall_kick')
    } else if (Player.holdingWall == true) {
        Player.changeAni('grab')
    }
}

async function transitionScene(scene, time) {
    currentScene = 0;
    await sleep(time)
    currentScene = scene;
}

function loadMenu(menu) {
    if (menuLoaded == false) {
        if (menu == 0) {
            for (i = 0; i < 6; i++) {
                let menuOptions_ = new menuOptions.Sprite();
                if (i % 2 == 0) {
                    menuOptions_.x = 74    
                } else {
                    menuOptions_.x = 186
                } 
                if (i < 2) {
                    menuOptions_.y = 80;
                } else if (i < 4) {
                    menuOptions_.y = 125;
                } else {
                    menuOptions_.y = 170;
                }
            }
            menuOptions.textSize = 12;
            menuOptions.textColor = '#816271';
            menuOptions.textStroke = '#000000'
            menuOptions[0].text = "New Game"
            menuOptions[1].text = "Continue"
            menuOptions[2].text = "Endless"
            menuOptions[3].text = "Leaderboard"
            menuOptions[4].text = "Tutorial"
            menuOptions[5].text = "Settings"
            menuLoaded = true;
        } else if (menu == 1) {
            for (i = 0; i < 3; i++) { // make bigger sprites (108px wide)
                let menuOptions_ = new menuOptions.Sprite();
                menuOptions_.x = 74
                if (i == 0) {
                    menuOptions_.y = 80;
                } else if (i == 1) {
                    menuOptions_.y = 125;
                } else {
                    menuOptions_.y = 170;
                }
            }
            menuLoaded = true;
        }
    }
    menuOptions.visible = true;
}

function menuSelect() {
    if (Input.menu.left == true && (selected_menu % 2 == 1)) {
        selected_menu--;
    } else if (Input.menu.right == true && (selected_menu % 2 == 0)) {
        selected_menu++
    } else if (Input.menu.up == true) {
        selected_menu -= 2
    } else if (Input.menu.down == true) {
        selected_menu += 2
    }

    if (selected_menu == 6) {
        selected_menu = 4
    } else if (selected_menu == 7) {
        selected_menu = 5
    } else if ( selected_menu == -1) {
        selected_menu = 1
    } else if (selected_menu == -2) {
        selected_menu = 0;
    }

    if (Input.menu.confirm == true) {
        menuPressed(selected_menu);
    }
}

function highlightMenu() {
    for (i = 0; i < 6; i++) {
        if (i == selected_menu) {
            menuOptions[i].img = highlighted_menuBox_sprite;
            menuOptions[i].textColor = '#f6d6db';
        } else {
            menuOptions[i].img = menuBox_sprite;
            menuOptions[i].textColor = '#816271';
        }
    }
}

function menuPressed(num) {
    switch (num) {
        case 0:
            DEBUG = 0;
            newGame();
            break;
        case 1:
            DEBUG = 1;
            transitionScene(2, 200)
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
    loadLevelOne();
    gameRunning = true;
    currentLevel = 1;
    initialiseAtmosphere();
}

function getKeyPressed() {
    if (kb.presses('up') || kb.presses('space')) {
        Input.movement.jump = true;
    } else {
        Input.movement.jump = false
    }

    if (kb.pressing('right')) {
        Input.movement.right = true;
    } else {
        Input.movement.right = false;
    }

    if (kb.pressing('left')) {
        Input.movement.left = true;
    } else {
        Input.movement.left = false;
    }

    if (kb.presses('right')) {
        Input.menu.right = true;
    } else {
        Input.menu.right = false;
    }

    if (kb.presses('left')) {
        Input.menu.left = true;
    } else {
        Input.menu.left = false;
    }

    if (kb.presses('up')) {
        Input.menu.up = true;
    } else {
        Input.menu.up = false;
    }

    if (kb.presses('down')) {
        Input.menu.down = true;
    } else {
        Input.menu.down = false;
    }

    if (kb.pressing('x') || kb.pressing('shift')) {
        Input.movement.dash = true;
    } else {
        Input.movement.dash = false;
    }

    if (kb.pressing('z') || kb.pressing('down')) {
        Input.movement.grab = true;
    } else {
        Input.movement.grab = false;
    }

    if (kb.presses('enter') || kb.presses('space')) {
        Input.menu.confirm = true;
    } else {
        Input.menu.confirm = false;
    }
}

function sceneHandler() {
    if (currentScene === scene_cache) {
        setTimeout(sceneHandler, 50);
        return;
    }    
    sceneDeconstructor(scene_cache);
    scene_cache = currentScene;

}

function sceneDeconstructor(scene) {
    switch (scene) {
        case 0:
            break;
        case 1:
            menuOptions.removeAll();
            menuLoaded = false;
            break;
        case 2:
            menuOptions.removeAll();
            menuLoaded = false;
            break;
        case 3:
            Player.visible = false;
            break;
    }
}

function loadLevelOne() {
    current_stage_json = level_1_json;
}

function triggerRollingRock(index) {
    RollingRocks[i].vel.x = 0.1
}

function initialiseAtmosphere() {
    for (i = 0; i < 6; i++) {
        let n = round(random(4))
        let m = round(random(256))
        if (m % 2 == 0) {
            m = m * -1
        }
        Clouds.sprite[i] = n
        Clouds.x_pos[i] = m
    }
}

function resetCloud(index) {
    let n = round(random(100)) - 200;
    let m = round(random(4))
    Clouds.x_pos[index] = n
    Clouds.sprite[index] = m
}

function atmosphere() {
    for (i = 0; i < 6; i++) {
        if (Clouds.x_pos[i] > CANVASWIDTH) {
            resetCloud(i);
        }
    }

    tint(0, 100)
    for (i = 0; i < 6; i++) {
        Clouds.x_pos[i] += Clouds.speed
        image(clouds[Clouds.sprite[i]], Clouds.x_pos[i], Clouds.y_pos[i], 256, 32)  
    }
    noTint()
}

function getTile(index) { 
    let pos = getGridPosition(index);
    rowPos = pos.y
    colPos = pos.x
    tile = current_stage_json.tilemap[rowPos].charAt(colPos)

    return tile;
}

function getTilePosition(index) { // fix -- both are returning null
    let pos = getGridPosition(index)
    //console.log(pos)
    rowPos = pos.y * 16
    colPos = pos.x * 16

    return { x: rowPos, y : colPos }
}

function getGridPosition(index) {
    let colPos, rowPos;
    let rowLength = current_stage_json.columns

    rowPos = floor(index / rowLength)
    colPos = index % rowLength
    //console.log(rowPos)
    return { x: colPos, y: rowPos}
}








