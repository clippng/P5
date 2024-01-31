const CANVASWIDTH = 256;
const CANVASHEIGHT = 256;

// do player animations
// make each object have a cooldown for grab / wall kick
// make in game overlay and pause menu
let currentScene = 0; 

let n;
let Player, player_collider_bottom, player_collider_left, player_collider_right;
let player_sprite, player_run_anim, player_grab_anim, player_wall_jump_anim;
let mainBackgroundImg, smallBackgroundImg;
let backGroundActualPos = -712
let current_stage_json, level_1_json, level_2_json;
let scene_cache;
let flag_anim;

let light_spikes, dark_spikes;
let clouds = []

let grassN, grassE, grassS, grassW, grassC, grassNE, grassSE, grassSW, grassNW, grassM, grassNEC, grassSEC, grassSWC, grassNWC;

let currentLevel;
let object = 0;

let Tiles, CheckPoints

let menuOptions, menu_box_sprite, highlighted_menu_box_sprite, big_menu_box_sprite, highlighted_big_menu_box_sprite;

let ball_sprite;

let overlay
let gameRunning = false;

let levelLoaded = false;

let grab_platform;


const Input = {
    movement: {
        jump: false,
        dash: false,
        grab: false,
        left: false,
        right: false,
        pause: false
    },
    menu: {
        confirm: false,
        left: false,
        right: false,
        up: false,
        down: false,
        back: false
    }
};


const Clouds = {
    x_pos: [],
    y_pos: [30, 65, 100, 135, 170, 205],
    sprite: [],
    speed: 0.05
};

const Menu = {
    options: 0,
    loaded: false,
    selected_menu: 0,
    box_size: 0
};


function preload() {
    mainBackgroundImg = loadImage('Sprites/Other/mountain_background_big.png');
    smallBackgroundImg = loadImage('Sprites/Other/mountain_background.png');
    player_sprite = loadImage('Sprites/Player/player.png');
    menu_box_sprite = loadImage('Sprites/Other/menu_box.png');
    highlighted_menu_box_sprite = loadImage('Sprites/Other/menuBox_H.png');
    ball_sprite = loadImage('Sprites/Obstacles/ball_obstacle.png');
    overlay = loadImage('Sprites/Other/overlay.png');
    dark_spikes = loadImage('Sprites/Obstacles/dark_spikes.png');
    light_spikes = loadImage('Sprites/Obstacles/light_spikes.png');
    big_menu_box_sprite = loadImage('Sprites/Other/big_menu_box.png');
    highlighted_big_menu_box_sprite = loadImage('Sprites/Other/big_menu_box_H.png');

    clouds[0] = loadImage('Sprites/Clouds/cloud_1.png');
    clouds[1] = loadImage('Sprites/Clouds/cloud_2.png');
    clouds[2] = loadImage('Sprites/Clouds/cloud_3.png');
    clouds[3] = loadImage('Sprites/Clouds/cloud_4.png');
    clouds[4] = loadImage('Sprites/Clouds/cloud_5.png');

    grassN = loadImage('Sprites/Terrain/Grass/grass_N.png');
    grassE = loadImage('Sprites/Terrain/Grass/grass_E.png');
    grassS = loadImage('Sprites/Terrain/Grass/grass_S.png');
    grassW = loadImage('Sprites/Terrain/Grass/grass_W.png');
    grassC = loadImage('Sprites/Terrain/Grass/grass_C.png')
    grassNE = loadImage('Sprites/Terrain/Grass/grass_NE.png');
    grassSE = loadImage('Sprites/Terrain/Grass/grass_SE.png');
    grassSW = loadImage('Sprites/Terrain/Grass/grass_SW.png'); 
    grassNW = loadImage('Sprites/Terrain/Grass/grass_NW.png');
    grassM = loadImage('Sprites/Terrain/Grass/grass_M.png');
    grassNEC = loadImage('Sprites/Terrain/Grass/grass_NEC.png'); 
    grassSEC = loadImage('Sprites/Terrain/Grass/grass_SEC.png');
    grassSWC = loadImage('Sprites/Terrain/Grass/grass_SWC.png');
    grassNWC = loadImage('Sprites/Terrain/Grass/grass_NWC.png');;

    level_1_json = loadJSON('Code/level_1.json');
    level_2_json = loadJSON('Code/level_2.json');
}

function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')

    allSprites.pixelPerfect = true;
    initialisePlayer();
    initialiseMenu();
    initialiseObstacles();
    initialiseTiles();
    initialiseCheckPoints();

    world.gravity.y = 5

    transitionScene(1, 2000);
}

function draw() {
    background(0)
    frameRate(60);
    //renderStats(0, 0)
    getKeyPressed();
    sceneHandler();
    if (currentScene == 0) {                // loading screen
        loadingScreen();
    } else if (currentScene == 1) {        // main menu
        mainMenu();
    } else if (currentScene == 2) {        // select save
        saveSelect()
    } else if (currentScene == 3) {        // game
        game();
    } else if (currentScene == 4) {        // high scores

    } else if (currentScene == 5) {        // how to play

    } else if (currentScene == 6) {        // settings
        settings();
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

    loadMenu(0);
    menuSelect(0);
    highlightMenu();

    text("Menu", 128, 40);
}

function game() {
    tint(200)
    image(mainBackgroundImg,0 , 0)
    Player.visible = true;
    if (levelLoaded == false ) {
        initialiseLevel();
        spawnPlayer(current_stage_json.start_pos[0], current_stage_json.start_pos[1]);
        spawnCheckPoints();
        levelLoaded = true;
    }

    collisionDetection();
    updateTiles();
    atmosphere();
    movePlayer();
}

function initialisePlayer() {
    Player = new Sprite();
    Player.img = player_sprite;
    Player.collider = 'k';
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
    Player.addCollider(1, 7, 12, 17)

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

function saveSelect() {
    loadMenu(1);
    getKeyPressed();
    menuSelect(1);
    highlightMenu();
    if (Input.menu.back == true) {
        transitionScene(1, 200)
    }
    text("Select Save", 128, 40)
}

function settings() {
    loadMenu(2)
    getKeyPressed();
    menuSelect(2);
    highlightMenu();
    if (Input.menu.back == true) {
        transitionScene(1, 200)
    }
    text("Settings", 128, 40)
}

function initialiseTiles() {
    Tiles = new Group();
    Tiles.w = 16;
    Tiles.h = 16;
    Tiles.collider = 's';
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
    menuOptions.img = menu_box_sprite;
    menuOptions.visible = false;
    menuOptions.scale = 2;
}

function initialiseCheckPoints() {
    CheckPoints = new Group();
    CheckPoints.collider = 'n';
    CheckPoints.activated = false;
    CheckPoints.spriteSheet = 'Sprites/Other/flag_sprite_sheet.png';
    CheckPoints.frameDelay = 10;
    CheckPoints.addAnis({
        active: { width: 16, height: 32, x: 0, y: 0, frames: 7 },
        idle: { width: 16, height: 32, x: 112, y: 0, frames: 1 }
    });
}

function spawnPlayer(x, y) {
    Player.x = x;
    Player.y = y;
    Player.visible = true;
    Player.collider = 'd';
}

function despawnPlayer() {
    Player.x = 128;
    Player.y = 128;
    Player.visible = false;
    Player.collider = 's';
}

function spawnTiles() {
    let n = current_stage_json.tilemap[0].length * current_stage_json.tilemap.length
    for (i = 0; i < n; i++) {
        let tile_ = getTile(i)
        if (tile_ != '/') {
            let tile = new Tiles.Sprite()                    
            let pos = getTilePosition(i);
            tile.x = pos.y
            tile.y = pos.x - 312 // make this part of the getTilePosition() function
            switch (tile_) {
                case 'p':
                    tile.colour = 0;
                    break;
                case 'N':
                    tile.img = grassN;
                    break;
                case 'E':
                    tile.img = grassE;
                    break;
                case 'S':
                    tile.img = grassS;
                    break;
                case 'W':
                    tile.img = grassW;
                    break;
                case 'C':
                    tile.img = grassC;
                    break;
                case 'n':
                    tile.img = grassNE;
                    break;
                case 'e':
                    tile.img = grassSE;
                    break;
                case 's':
                    tile.img = grassSW;
                    break;
                case 'w':
                    tile.img = grassNW;
            }
        }
    }
}

function updateTiles() {

}

function spawnCheckPoints() {
    for (i = 0; i < current_stage_json.objects.flags.length; i++) {
        let checkpoint_ = new CheckPoints.Sprite();
        checkpoint_.changeAni('idle');
        checkpoint_.x = current_stage_json.objects.flags[i].x;
        checkpoint_.y = current_stage_json.objects.flags[i].y;
        checkpoint_.collider = 'n';
        checkpoint_.visible = true;
    }

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

function moveCamera(position) {
    camera.moveTo(128, position, 100);
}

function initialiseLevel() {
    //spawnObstacles();
    spawnTiles();
    //RollingRocks.visible = true;
    Tiles.visible = true;
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
            player_collider_right.overlapping(Tiles))) {
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

    if (Input.movement.left == true && (player_collider_bottom.overlapping(Tiles) || player_collider_bottom.overlapping(Tiles))) {
        Player.changeAni('run');
    } else if (Input.movement.right == true && (player_collider_bottom.overlapping(Tiles) || player_collider_bottom.overlapping(Tiles))) {
        Player.changeAni('run')
    } else if (player_collider_bottom.overlapping(Tiles) || player_collider_bottom.overlapping(Tiles)) {
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
    if (Menu.loaded == false) {
        Menu.selected_menu = 0;
        if (menu == 0) {
            Menu.options = 6;
            Menu.box_size = 0;
            for (i = 0; i < Menu.options; i++) {
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
            Menu.loaded = true;
        } else if (menu == 1) {
            Menu.options = 3;
            Menu.box_size = 1;
            for (i = 0; i < Menu.options; i++) { // make bigger sprites (108px wide)
                let menuOptions_ = new menuOptions.Sprite();
                menuOptions_.x = 128
                menuOptions_.y = 80 + (i * 45)
            }
            Menu.loaded = true;
        } else if (menu == 2) { // settings
            Menu.options = 4;
            Menu.box_size = 1;
            for (i = 0; i < Menu.options; i++) { // also want bigger sprites here
                let menuOptions_ = new menuOptions.Sprite();
                menuOptions_.x = 128;
                menuOptions_.y = 80 + (i * 45)
            }
            Menu.loaded = true;
        }
    }
    menuOptions.visible = true;
}

function menuSelect(menu) {
    switch (menu) {
        case 0:
            if (Input.menu.left == true && (Menu.selected_menu % 2 == 1)) {
                Menu.selected_menu--;
            } else if (Input.menu.right == true && (Menu.selected_menu % 2 == 0)) {
                Menu.selected_menu++
            } else if (Input.menu.up == true) {
                Menu.selected_menu -= 2
            } else if (Input.menu.down == true) {
                Menu.selected_menu += 2
            }

            if (Menu.selected_menu == 6) {
                Menu.selected_menu = 4
            } else if (Menu.selected_menu == 7) {
                Menu.selected_menu = 5
            } else if ( Menu.selected_menu == -1) {
                Menu.selected_menu = 1
            } else if (Menu.selected_menu == -2) {
                Menu.selected_menu = 0;
            }

            if (Input.menu.confirm == true) {
                menuPressed(Menu.selected_menu);
            }
            break;
        case 1:
            if (Input.menu.down == true && Menu.selected_menu != Menu.options - 1) {
                Menu.selected_menu++;
            } else if (Input.menu.up == true && Menu.selected_menu != 0) {
                Menu.selected_menu--;
            }
            break;
        case 2:
            if (Input.menu.down == true && Menu.selected_menu != Menu.options - 1) {
                Menu.selected_menu++;
            } else if (Input.menu.up == true && Menu.selected_menu != 0) {
                Menu.selected_menu--;
            }
            break;
    }
}

function highlightMenu() {
    for (i = 0; i < Menu.options; i++) {
        if (Menu.box_size == 0) {
            if (i == Menu.selected_menu) {
                menuOptions[i].img = highlighted_menu_box_sprite;
                menuOptions[i].textColor = '#f6d6db';
            } else {
                menuOptions[i].img = menu_box_sprite;
                menuOptions[i].textColor = '#816271';
            }            
        } else if (Menu.box_size == 1) {
            if (i == Menu.selected_menu) {
                menuOptions[i].img = highlighted_big_menu_box_sprite;
                menuOptions[i].textColor = '#f6d6db';
            } else {
                menuOptions[i].img = big_menu_box_sprite;
                menuOptions[i].textColor = '#816271';
            }      
        }

    }
}

function menuPressed(num) {
    switch (num) {
        case 0:
            newGame();
            break;
        case 1:
            transitionScene(2, 200)
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            transitionScene(6, 200)
            break;
    }

}

function newGame() {
    transitionScene(3, 2000);
    loadLevel(1);
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

    if (kb.presses('escape') || kb.presses('b')) {
        Input.menu.back = true;
        Input.movement.pause = true;
    } else {
        Input.menu.back = false;
        Input.movement.pause = false;
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
            Menu.loaded = false;
            break;
        case 2:
            menuOptions.removeAll();
            Menu.loaded = false;
            break;
        case 3:
            despawnPlayer();
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            menuOptions.removeAll();
            Menu.loaded = false;
            break;

    }
}

function loadLevel(level) {
    switch(level) {
        case 1:
            current_stage_json = level_1_json;
            break;
    }

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

function getTilePosition(index) { 
    let pos = getGridPosition(index)
    //console.log(pos)
    rowPos = pos.y * 16
    colPos = pos.x * 16

    return { x: rowPos, y : colPos }
}

function getGridPosition(index) {
    let colPos, rowPos;
    let rowLength = current_stage_json.tilemap[0].length;

    rowPos = floor(index / rowLength)
    colPos = index % rowLength
    //console.log(rowPos)
    return { x: colPos, y: rowPos}
}

function activateCheckpoint(index) {
    CheckPoints[index].activated = true;
    CheckPoints[index].changeAni('active');
    // set respawn
    camera.moveTo(128, current_stage_json.objects.flags[index].camera, 1) // get from json (whatever value is best for that checkpoint)
}

function collisionDetection() {
    for (i = 0; i < current_stage_json.objects.flags.length; i++) {
        if (Player.overlaps(CheckPoints[i])) {
            if (CheckPoints[i].activated == false) {
                activateCheckpoint(i);
            }
        }
    }

}

//colums = tilemap[0]/length()
//rows = tilemap.length()








