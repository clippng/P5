////// Sources //////////////////////////////////////////////////////////////////
/* Opening video taken from https://www.youtube.com/watch?v=D1mS7tai_H0
   Game sounds and music from Pixabay https://pixabay.com 
    - sfx_jump_07-80241
    - 8-bit-game-2-186976
    - 8bit-music-for-game-68698
   Player sprite and aniamtions heavily inspired by Celeste
   https://store.steampowered.com/app/504230/Celeste/ */
/////////////////////////////////////////////////////////////////////////////////

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
// fix sprite rotations bugging out
// make loading screens actually functional
// fix lag /memory leaks -- the longer the program is running the worse the fps is
// remove rocks when spawn is on screen

// All the varibles used to store images
let Player, player_collider_bottom, player_collider_left, player_collider_right,
player_hit_box, player_sprite, player_run_anim, player_grab_anim, player_wall_jump_anim;
let main_background_img, small_background_img, overlay;
let flag_anim;
let slider_idicator, slider_bar
let light_spikes, dark_spikes, light_spikes_bottom, dark_spikes_bottom;
let cloud_platform_1, cloud_platform_2, cloud_platform_3, wooden_platform, wooden_platform_m, outcrop;
let icicle_sprite_1, icicle_sprite_2, icicle_sprite_3, rolling_rock_sprite;
let grassN, grassE, grassS, grassW, grassC, grassNE, grassSE, grassSW, grassNW, grassM, grassNEC, grassSEC, grassSWC, grassNWC,
grassNECF, grassSECF, grassSWCF, grassNWCF;
let menu_box_sprite, highlighted_menu_box_sprite, big_menu_box_sprite, highlighted_big_menu_box_sprite;
let fruit_sprite, title_card;
let jump_sound, death_sound, music;
let opening_video;

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

// Object that stores current save data would ideally export
// to a local file so that data isn't lost on refresh, but I
// don't know how to do that yet
const Saves = {
    name: " ",
    data: [
        {
            complete: false,
            fruits: [false, false, false],
            high_score: 0
        },
        {
            complete: false,
            fruits: [false, false, false],
            high_score: 0
        }
    ]
}

// Loads all the images and JSON data into variables
function preload() {
    main_background_img = loadImage('Sprites/Other/mountain_background_big.png');
    small_background_img = loadImage('Sprites/Other/mountain_background.png');
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
    fruit_sprite = loadImage('Sprites/Other/fruit.png');
    title_card = loadImage('Sprites/Other/opening_text.png');

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
    grassNECF = loadImage('Sprites/Terrain/Grass/grass_NECF.png');
    grassSECF = loadImage('Sprites/Terrain/Grass/grass_SECF.png');
    grassSWCF = loadImage('Sprites/Terrain/Grass/grass_NWCF.png');
    grassNWCF = loadImage('Sprites/Terrain/Grass/grass_NWCF.png');

    opening_video = createVideo('Videos/snow_video.mp4');

    jump_sound = loadSound('Sounds/jump_sound.mp3');
    death_sound = loadSound('Sounds/death_sound.mp3');
    music = loadSound('Sounds/music.mp3');

    level_1_json = loadJSON('Code/level_1.json');
    level_2_json = loadJSON('Code/level_2.json');
}

// Calls most of the initialisation functions for group definitions and sets up global
// variables such as gravity as well as starts the music (after mouse press)
function setup() {
    new Canvas(CANVASWIDTH, CANVASHEIGHT, 'pixelated')

    allSprites.pixelPerfect = true;
    world.gravity.y = 5;

    initialisePlayer();
    initialiseMenu();
    initialiseObstacles();
    initialiseTiles();
    initialiseCheckPoints();
    initialiseFruits();
    initialiseBoundaries();
    initialisePlatforms();

    opening_video.loop();
    opening_video.hide();

    world.gravity.y = 5;
    music.setVolume(1)
    music.play();
    music.setLoop(true);

    transitionScene(9, 2000);
}

// Calls update functions and then the current scene controller
function draw() {
    background(0)
    frameRate(60);
    getKeyPressed();
    sceneHandler();
    if (kb.presses('k')){ // REMOVE 
        levelComplete(1);
    }




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
    } else if (currentScene == 7) {        // post level
        levelFinished();
    } else if (currentScene == 8) {        // gets player name
        createSave();
    } else if (currentScene == 9) {        // title card
        opening();
    }
}

// Draws the loading screen
function loadingScreen() {
    allSprites.visible = false;
    image(small_background_img, 64, 64)
    textAlign(CENTER); 
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

// Game controller, calls all the initialisation functions for the
// level once and then calls all update functions every frame
function game() {
    tint(200)
    image(main_background_img,0 , 0)
    noTint();
    allSprites.visbile = true;
    Player.visible = true;

    // All functions called once, resets level timer
    if (Game.level_loaded == false ) {
        initialiseLevel();
        spawnPlayer(current_stage_json.start_pos[0], current_stage_json.start_pos[1]);
        spawnCheckPoints();
        spawnSpikes();
        spawnObstacles();
        spawnPlatforms();
        spawnFruits();
        setUpBoundaries();
        Game.level_time = 0;
        Game.level_loaded = true;
    }

    // Calls update functions and increases timer (should be 60 times
    // per second)
    boundaryCheck();
    collisionDetection();
    atmosphere();
    movePlayer();
    updatePlatforms();
    movePlatforms();
    obstacleDetection();
    updateCamera();
    drawOverlay();

    Game.level_time++
}

// Save select scene controller
function saveSelect() {
    loadMenu(1);
    getKeyPressed();
    menuSelect(1);
    highlightMenu();

    if (Input.menu.back == true) {
        transitionScene(1, 200)
    } else if (Input.menu.confirm == true) {
        transitionScene(3, 2000);
    }

    text("Select Save", 128, 40)
}

// Settings scene controller, checks for input and adjusts the
// sliders as necessary
function settings() { 
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
    // Adjusts volume variables
    music.setVolume(Settings.music_volume/ 100);
    death_sound.setVolume(Settings.sound_volume / 100);
    jump_sound.setVolume(Settings.sound_volume / 100);

    // Draws the text based off current settings variables
    drawOverlay();
    image(slider_bar, 100, 77, 125, 6)
    image(slider_bar, 100, 122, 125, 6)
    image(slider_idicator, 100 + (Settings.music_volume * 1.2), 74, 6, 12)
    image(slider_idicator, 100 + (Settings.sound_volume * 1.2), 119, 6, 12)
    textSize(20);
    textAlign(CENTER);
    text("Settings", 128, 40)
    textSize(12);
    textAlign(LEFT)
    let music_ = "Music:" + Settings.music_volume;
    let sound_ = "Sound:" + Settings.sound_volume;
    text(music_, 30, 85)
    text(sound_, 30, 130)
}

// Level finished scene controller, calculates and updates score data
// and waits for input to either go back to the menu or go to the 
// next level
function levelFinished() {
    loadMenu(3);
    menuSelect(3);
    highlightMenu();
    drawOverlay();

    let msg = Saves.name + " made it to\nthe top of the mountain\n in " + round(Game.level_time / 60) + " seconds!"
    let score
    if (Game.level_time < 10000) {
        score =  "Score: " + (10000 - Game.level_time);
    } else {
        score = 0;
    }
    if (10000 - Game.level_time > Saves.data[0].high_score) {
        Saves.data[0].high_score = Game.level_time;
    }
    textSize(20)
    text("Level Complete!", 128, 40);
    textSize(14)
    text(msg, 128, 80);
    text(score, 128, 150);

    loadLevel(2);
    Game.level_loaded = false;
    Game.game_running = true;
    Game.current_level = 2;

    if (Input.menu.confirm == true && Menu.selected_menu == 0) {
        transitionScene(1, 400);
    }     if (Input.menu.confirm == true && Menu.selected_menu == 1) {
        initialiseAtmosphere();
        allSprites.visible = true;
        transitionScene(3, 2000);
    }
}

// Sets the name of the save file
function createSave() {
    loadMenu(4);
    drawOverlay();
    text("Enter a name", 128, 40);
    if (Input.menu.confirm == true) {
        Saves.name = user_name.value();
        Game.saves[0].empty = false;
        Game.saves[0].name = user_name.value();
        newGame();
    }
}

function opening() {
    image(opening_video, 0, 0, 480, 270)
    image(title_card, 0, 0)

    if (Input.movement.jump == true || Input.menu.confirm == true) {
        transitionScene(1, 2000)
    }
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
            menu_options.removeAll();
            Menu.loaded = false;
            break;
        case 2:
            menu_options.removeAll();
            Menu.loaded = false;
            break;
        case 3:
            despawnPlayer();
            Platforms.removeAll();
            Boundaries.removeAll();
            Tiles.removeAll();
            Fruits.removeAll();
            CheckPoints.removeAll();
            Spikes.removeAll();
            Icicles.removeAll();
            camera.y = 128;
            Game.camera_cache = 128;
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            menu_options.removeAll();
            Menu.loaded = false;
            break;
        case 7:
            menu_options.removeAll();
            Menu.loaded = false;
            break;
        case 8:
            user_name.remove();
            Menu.loaded = false;
            break;
    }
}

// This is to prevent some browser specific error where sound can't 
// be played without the user explicitly allowing it (in this case it's
// just pressing the mouse), but yeah why wasn't this in the lecture notes?
function mousePressed() {
    userStartAudio();
}
