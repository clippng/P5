////// Main /////////////////////////////////////////////////////////////////////
/* Contains all the p5 functions preload(), setup() and draw(). Also has all the
image definitions, input data, settings and manages scenes*/
/////////////////////////////////////////////////////////////////////////////////

const CANVASWIDTH = 256;
const CANVASHEIGHT = 256;

// make each object have a cooldown for grab / wall kick and remove grabbing side boundaries
// make in game overlay and pause menu
// fix clouds spawning on screen
// Idea to count save stats so like count jumps / deaths etc -- would satisfy the leaderboard requirement i think ?
// try to find a way to make the text clearer (stroke ?)
// falling icicles, fruit, rolling rocks -- have to load anim for icicle
// fix sprite rotations bugging out
// make loading screens actually functional
// fix lag /memory leaks -- the longer the program is running the worse the fps is

// All the varibles used to store images/ sprites (techniquely still just images)
let Player, player_collider_bottom, player_collider_left, player_collider_right,
player_hit_box, player_sprite, player_run_anim, player_grab_anim, player_wall_jump_anim;
let mainBackgroundImg, smallBackgroundImg, overlay;
let flag_anim;
let slider_idicator, slider_bar
let light_spikes, dark_spikes, light_spikes_bottom, dark_spikes_bottom;
let cloud_platform_1, cloud_platform_2, cloud_platform_3, wooden_platform, wooden_platform_m, outcrop;
let icicle_sprite_1, icicle_sprite_2, icicle_sprite_3, rolling_rock_sprite;
let grassN, grassE, grassS, grassW, grassC, grassNE, grassSE, grassSW, grassNW, grassM, grassNEC, grassSEC, grassSWC, grassNWC;
let menuOptions, menu_box_sprite, highlighted_menu_box_sprite, big_menu_box_sprite, highlighted_big_menu_box_sprite;


// Cache used to check if scene has changed recently
let scene_cache;
let currentScene = 0; 

// Object for storing input states
const Input = {
    movement: {
        jump: false,
        dash: false,
        grab: false,
        left: false,
        right: false,
        pause: false,
        locked: false
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

// Object for storing settings
const Settings = {
    music_volume: 100,
    sound_volume: 100
}

// Loads all the images and JSON data into variables
function preload() {
    mainBackgroundImg = loadImage('Sprites/Other/mountain_background_big.png');
    smallBackgroundImg = loadImage('Sprites/Other/mountain_background.png');
    player_sprite = loadImage('Sprites/Player/player.png');
    menu_box_sprite = loadImage('Sprites/Other/menu_box.png');
    highlighted_menu_box_sprite = loadImage('Sprites/Other/menuBox_H.png');
    rolling_rock_sprite = loadImage('Sprites/Obstacles/ball_obstacle.png');
    overlay = loadImage('Sprites/Other/overlay.png');
    dark_spikes = loadImage('Sprites/Obstacles/dark_spikes.png');
    dark_spikes_bottom = loadImage('Sprites/Obstacles/dark_spike_bottom.png')
    light_spikes = loadImage('Sprites/Obstacles/light_spikes.png');
    big_menu_box_sprite = loadImage('Sprites/Other/big_menu_box.png');
    highlighted_big_menu_box_sprite = loadImage('Sprites/Other/big_menu_box_H.png');
    slider_bar = loadImage('Sprites/Other/slider_bar.png');
    slider_idicator = loadImage('Sprites/Other/slider_indicator.png');
    cloud_platform_1 = loadImage('Sprites/Obstacles/cloud_platform_1.png');
    cloud_platform_2 = loadImage('Sprites/Obstacles/cloud_platform_2.png');
    cloud_platform_3 = loadImage('Sprites/Obstacles/cloud_platform_3.png');
    outcrop = loadImage('Sprites/Obstacles/outcrop_platform.png');
    wooden_platform = loadImage('Sprites/Obstacles/wooden_platform.png');
    wooden_platform_m = loadImage('Sprites/Obstacles/wooden_platform_m.png');
    icicle_sprite_1 = loadImage('Sprites/Obstacles/icicle_1.png');
    icicle_sprite_2 = loadImage('Sprites/Obstacles/icicle_2.png');
    icicle_sprite_3 = loadImage('Sprites/Obstacles/icicle_3.png');

    Clouds.sprites[0] = loadImage('Sprites/Clouds/cloud_1.png');
    Clouds.sprites[1] = loadImage('Sprites/Clouds/cloud_2.png');
    Clouds.sprites[2] = loadImage('Sprites/Clouds/cloud_3.png');
    Clouds.sprites[3] = loadImage('Sprites/Clouds/cloud_4.png');
    Clouds.sprites[4] = loadImage('Sprites/Clouds/cloud_5.png');

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
    grassNWC = loadImage('Sprites/Terrain/Grass/grass_NWC.png');

    level_1_json = loadJSON('Code/level_1.json');
    level_2_json = loadJSON('Code/level_2.json');
}

// Calls most of the initialisation functions for group definitions and sets up global
// variables such as gravity
function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')

    allSprites.pixelPerfect = true;
    initialisePlayer();
    initialiseMenu();
    initialiseObstacles();
    initialiseTiles();
    initialiseCheckPoints();
    initialiseBoundaries();
    initialisePlatforms();

    world.gravity.y = 5

    transitionScene(1, 2000);
}

// Calls update functions and then the current scene controller
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
}

// Draws the loading screen
function loadingScreen() {
    allSprites.visible = false;
    textAlign(CENTER); 
    image(smallBackgroundImg, 64, 64)
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
    fill('#816271');
    stroke(0);
    textSize(20);
}

// Main menu scene controller
function mainMenu() {
    allSprites.visible = false;

    loadMenu(0);
    menuSelect(0);
    highlightMenu();
    drawOverlay();

    text("Menu", 128, 40);
}

// Game controller
function game() {
    tint(200)
    image(mainBackgroundImg,0 , 0)
    noTint();
    Player.visible = true;
    if (Game.level_loaded == false ) {
        initialiseLevel();
        spawnPlayer(current_stage_json.start_pos[0], current_stage_json.start_pos[1]);
        spawnCheckPoints();
        spawnSpikes();
        spawnObstacles();
        spawnPlatforms();
        setUpBoundaries();
        Game.level_loaded = true;
    }
    boundaryCheck();
    collisionDetection();
    atmosphere();
    movePlayer();
    updatePlatforms();
    movePlatforms();
    obstacleDetection();
    updateCamera();
    drawOverlay();
}

// Save select scene controller
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

// Settings scene controller
function settings() { // maybe move into seperate functions try to reuse menu logic as much as possible 
    loadMenu(2)
    getKeyPressed();
    menuSelect(2);
    highlightMenu();
    if (Input.menu.back == true) {
        transitionScene(1, 200)
    }
    if (Input.menu.left == true){
        if (Menu.selected_menu == 0 && Settings.music_volume != 0) {
            Settings.music_volume -= 10;
        } else if (Menu.selected_menu == 1 && Settings.sound_volume != 0) {
            Settings.sound_volume -= 10;
        }
    } else if (Input.menu.right == true) {
        if (Menu.selected_menu == 0 && Settings.music_volume != 100) {
            Settings.music_volume += 10;
        } else if (Menu.selected_menu == 1 && Settings.sound_volume != 100) {
            Settings.sound_volume += 10;
        }
    }
    drawOverlay();
    image(slider_bar, 100, 77, 125, 6)
    image(slider_bar, 100, 122, 125, 6)
    image(slider_idicator, 100 + (Settings.music_volume * 1.2), 74, 6, 12)
    image(slider_idicator, 100 + (Settings.sound_volume * 1.2), 119, 6, 12)
    text("Settings", 128, 40)
    textSize(12)
    textAlign(LEFT)
    let music_ = "Music:" + Settings.music_volume;
    let sound_ = "Sound:" + Settings.sound_volume;
    text(music_, 30, 85)
    text(sound_, 30, 130)
}

// Takes a scene to transition to and a timer, displays loading scene until timer is 
// finished and then changes the current scene to the input scene
async function transitionScene(scene, time) {
    currentScene = 0;
    await sleep(time)
    currentScene = scene;
}

// Stores keyboard inputs in an object, helpful for having multiple keybindings for one action
// and seperating menu and game inputs
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

// Acts as a garbage collector for scenes, checks if scene has changed, if not waits 50ms and
// tries again, if true it calls the appropriate deconstructor
function sceneHandler() {
    if (currentScene === scene_cache) {
        setTimeout(sceneHandler, 50);
        return;
    }    
    sceneDeconstructor(scene_cache);
    scene_cache = currentScene;
}

// Used to remove all elements and resest a scene, some are made invisible and stored such as the player
// and others are permanenetly destroyed, such as menuOptions sprites
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

