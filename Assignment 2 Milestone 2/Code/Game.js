////// Game /////////////////////////////////////////////////////////////////////
/* Contains all the functions used by the actual game, includes stuff like moving
the player, spawning levels and other useful functions */
/////////////////////////////////////////////////////////////////////////////////


// Group definitions
let Platforms, Boundaries, Tiles, Fruits, CheckPoints, Spikes, Icicles

// variables to store JSON data
let current_stage_json, level_1_json, level_2_json;

// used for grabWall() function
let grab_platform;

// Object to store game related data, camera cache is used for moving the camera
// between checkpoints
const Game = {
    saves: [
        {
            empty: true,
            name: "No Name",
            current_level: 1,
        },
        {
            empty: true,
            name: "No Name",
            current_level: 1,
        },
        {
            empty: true,
            name: "No Name",
            current_level: 1,
        }
    ],
    name: "No Name",
    game_running: false,
    current_level: 1,
    level_time: 0,
    level_loaded: false,
    camera_cache: 128,
    camera_following_player: false
}



// Object to store highly unnesscary cloud data (not the platform clouds the barely
// visible ones in the background)
const Clouds = {
    sprites: [],
    x_pos: [],
    y_pos: [30, 65, 100, 135, 170, 205],
    sprite: [],
    speed: 0.05
};

// Sets game data to level 1 and starts the game
function newGame() {
    transitionScene(3, 2000);
    loadLevel(1);
    Game.game_running = true;
    Game.current_level = 1;
    initialiseAtmosphere();
    allSprites.visible = true;
}

// Initialises the player variables, it's animations and various colliders
function initialisePlayer() {
    Player = new Sprite();
    Player.img = player_sprite;
    Player.collider = 'k';
    Player.rotationLock = true;
    Player.mass = 1000;
    Player.bounciness = 0.001
    Player.dashCooldown = 1000;
    Player.dashOnCooldown = false;
    Player.facingDirection = 'right';
    Player.jumps = 0;
    Player.maxJumps = 2;
    Player.jumpHeight = 2.5;
    Player.touchingWall = false;
    Player.holdingWall = false;
    Player.jumping = false;
    Player.respawn = [];

    Player.removeColliders()
    Player.addCollider(1, 7, 10, 15)

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

    player_hit_box = new Sprite();
    player_hit_box.collider = 'n';
    player_hit_box.w = 7;
    player_hit_box.h = 11;
    player_hit_box.x = Player.x + 1;
    player_hit_box.y = Player.y + 6
    player_hit_box.visible = false;
    player_hit_box.mass = 0.01;

    let joint_bottom = new GlueJoint(Player, player_collider_bottom);
    joint_bottom.visible = false;

    let joint_left = new GlueJoint(Player, player_collider_left);
    joint_left.visible = false;

    let joint_right = new GlueJoint(Player, player_collider_right);
    joint_right.visible = false;

    let joint_center = new GlueJoint(Player, player_hit_box);
    joint_center.visible = false;
}

// Creates the Tiles group, used to create all the solid blocks that make
// up the levels
function initialiseTiles() {
    Tiles = new Group();
    Tiles.w = 16;
    Tiles.h = 16;
    Tiles.collider = 's';

    WallTiles = new Group()
    WallTiles.w = 16;
    WallTiles.h = 16;
    WallTiles.collider = 's';
    WallTiles.colour = 0;
}

// Creates all the obstacle groups (they should probably be seperate but it's fine)
function initialiseObstacles() {
    RollingRocks = new Group();
    RollingRocks.img = rolling_rock_sprite;
    RollingRocks.friction = 0;
    RollingRocks.collider = 's';

    Spikes = new Group();
    Spikes.facing = 'south'
    Spikes.img = dark_spikes;
    Spikes.collider = 'n'

    Icicles = new Group();
    Icicles.collider = 's';
    Icicles.img = icicle_sprite_3;
}

// Creates the CheckPoints group (sometimes to refered to as flags)
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

// Creates Boundaries group, basically only used for detecting falling deaths
function initialiseBoundaries() {
    Boundaries = new Group();
    Boundaries.collider = 'n';
    Boundaries.visible = false;
}

// Creates Platforms group, all the platforms that are one way (you can jump up
// though them but not down) are part of this group
function initialisePlatforms() { 
    Platforms = new Group();
    Platforms.collider = 'n';
}

// Creates the Fruits group, used as bonus objectives in levels
function initialiseFruits() {
    Fruits = new Group();
    Fruits.img = fruit_sprite;
    Fruits.collider = 'n';
}

// Spawns the checkpoints based on the current level JSON data, works for any
// amount
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

// Spawns the current level obstacles, currently just rocks and icicles
function spawnObstacles() {
    for (i = 0; i < current_stage_json.objects.obstacles.length; i++) {
        let jsonData = getObstacle(i)
        if (jsonData[0] == "rolling_rock") {
            let obstacle_ = new RollingRocks.Sprite()
            obstacle_.x = jsonData[1];
            obstacle_.y = jsonData[2];
            obstacle_.trigger = jsonData[3]
            obstacle_.default_x = jsonData[1];
            obstacle_.default_y = jsonData[2];
            obstacle_.cooldown = 2000;
            obstacle_.on_cooldown = false;
            obstacle_.falling = false;
            obstacle_.shape = 'circle'
            obstacle_.visible = true;
        } else if (jsonData[0] == "icicle") {
            let obstacle_ = new Icicles.Sprite();
            obstacle_.rotationLock = true;
            obstacle_.x = jsonData[1];
            obstacle_.y = jsonData[2];
            obstacle_.trigger = jsonData[3];
            obstacle_.default_x = jsonData[1];
            obstacle_.default_y = jsonData[2];
            obstacle_.cooldown = 2000;
            obstacle_.on_cooldown = false;
            obstacle_.falling = false;
            obstacle_.visible = true;
            obstacle_.removeColliders();
            obstacle_.addCollider(-4, -5, 3, 3);
        }
    }
}

// Gets tilemap data from current level JSON data and creates the "blocks". Works
// well, tilemap can be extended infinitely and it will still load properly.
// The appearance of each tile is set with characters in the tilemap n, e, s, w are 
// the cardinal directions and refer to orientation capitals are variations (usually 
// means rotated 45 degress clockwise so n would be a north east corner), I ran out 
// of letters after that so u, d, l, r for up, down, left, right but they work in the 
// same way, with capitals for filled versions.
function spawnTiles() {
    let n = current_stage_json.tilemap[0].length * current_stage_json.tilemap.length
    for (i = 0; i < n; i++) {
        let tile_ = getTile(i)
        let pos = getTilePosition(i);
        if (tile_ != '/' && tile_ != 'p') {
            let tile = new Tiles.Sprite();
            tile.x = pos.x;
            tile.y = pos.y;                 
            switch (tile_) {
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
                    break;
                case 'u':
                    tile.img = grassNEC;
                    break;
                case 'l':
                    tile.img = grassSEC;
                    break;
                case 'd':
                    tile.img = grassSWC;
                    break;
                case 'r':
                    tile.img = grassNWC;
                    break;
                case 'U':
                    tile.img = grassNECF;
                    break;
                case 'L':
                    tile.img = grassSECF;
                    break;
                case 'D':
                    tile.img = grassSWCF;
                    break;
                case 'R':
                    tile.img = grassNWCF;
                    break;
            }
        } else if (tile_ == 'p') {
            let tile = new WallTiles.Sprite();
            tile.x = pos.x;
            tile.y = pos.y;
        }
    }
}

// Spawns the level boundaries at the start of the level
function setUpBoundaries() {
    for (i = 0; i < 3; i++) {
        let boundary_ = new Boundaries.Sprite();
        switch (i) {
            case 0:
                boundary_.x = CANVASWIDTH;
                boundary_.y = CANVASHEIGHT / 2;
                boundary_.w = 10;
                boundary_.h = CANVASHEIGHT;
                break;
            case 1:
                boundary_.x = CANVASWIDTH / 2;
                boundary_.y = CANVASHEIGHT;
                boundary_.w = CANVASWIDTH;
                boundary_.h = 10;
                break;
            case 2: 
                boundary_.x = 0;
                boundary_.y = CANVASHEIGHT / 2;
                boundary_.w = 10;
                boundary_.h = CANVASHEIGHT;
                break;
        }
    }
}

// Moves the boundaries when a new checkpoint is reached
function updateBoundaries() {
    for (i = 0; i < 3; i++) {
        switch (i) {
            case 0:
                Boundaries[i].y = camera.y;
                break;
            case 1:
                Boundaries[i].y = camera.y + (CANVASHEIGHT / 2);
                break;
            case 2: 
                Boundaries[i].y = camera.y;
                break;
        }
    }
}

// Just gets obstacle data based of an index number (index of the array 
// in JSON file) and returns it as an array in the format [type, x, y, radius]. 
// Radius refers to trigger radius and isn't actually a radius just a value
// that determines when the trap will trigger, works differently for different
// obstacle types
function getObstacle(index) {
    let obstacle_ = [];
    obstacle_[0] = current_stage_json.objects.obstacles[index].type;
    obstacle_[1] = current_stage_json.objects.obstacles[index].x_pos;
    obstacle_[2] = current_stage_json.objects.obstacles[index].y_pos;
    obstacle_[3] = current_stage_json.objects.obstacles[index].trigger_radius;
    return obstacle_;
}

// Spawns spike sprites from JSON, also handles orientation
function spawnSpikes() {
    for (i = 0; i < current_stage_json.objects.spikes.length; i++) {
        let spike_ = new Spikes.Sprite();
        spike_.x = current_stage_json.objects.spikes[i].x;
        spike_.y = current_stage_json.objects.spikes[i].y
        spike_.visible = true;
        spike_.facing = current_stage_json.objects.spikes[i].facing
        switch (current_stage_json.objects.spikes[i].facing) {
            case "south":
                break;
            case "north":
                spike_.img = dark_spikes_bottom
                break;
            case "east":
                spike_.rotation = 270;
                spike_.rotationLock = true;
                break;
            case "west":
                spike_.rotation = 90
                spike_.rotationLock = true;
                break
        }
    }
}

// Spawns in the fruits from the JSON data, pretty simple
function spawnFruits() {
    for (i = 0; i < current_stage_json.objects.fruits.length; i++) {
        let fruit_ = new Fruits.Sprite();
        fruit_.x = current_stage_json.objects.fruits[i].x;
        fruit_.y = current_stage_json.objects.fruits[i].y;
        fruit_.visible = true;
    }
}

// Spawns the platform sprites, includes the wooden platforms, moving 
// clouds and the ending oremoveAll();utcrop platform
function spawnPlatforms() {
    for (i = 0; i < current_stage_json.objects.platforms.length; i++) {
        let platform_ = new Platforms.Sprite();
        platform_.collider = 'n'
        platform_.x = current_stage_json.objects.platforms[i].x;
        platform_.y = current_stage_json.objects.platforms[i].y;
        platform_.visible = true;
        platform_.removeColliders();
        if (current_stage_json.objects.platforms[i].type == "wooden") {
            platform_.type = "wooden"
            switch (current_stage_json.objects.platforms[i].sprite) {
                case "left":
                    platform_.img = wooden_platform;
                    platform_.mirror.x = true;
                    platform_.addCollider(0, 0, 16, 7)
                    break;
                case "right":
                    platform_.img = wooden_platform
                    platform_.addCollider(0, 0, 16, 7)
                    break;
                case "middle":
                    platform_.img = wooden_platform_m;
                    platform_.addCollider(0, 0, 16, 3)
                    break;
            }
        } else if (current_stage_json.objects.platforms[i].type == "cloud") {
            platform_.type = "cloud"
            switch (current_stage_json.objects.platforms[i].sprite) {
                case "small":
                    platform_.img = cloud_platform_2;
                    platform_.addCollider(0, 0, 16, 3);
                    platform_.moving = "left";
                    break;
                case "medium":
                    platform_.img = cloud_platform_3;
                    platform_.addCollider(0, 0, 22, 3);
                    platform_.moving = "right";
                    break;
                case "large":
                    platform_.img = cloud_platform_1;
                    platform_.addCollider(0, 0, 30, 3);
                    platform_.moving = "left";
                    break;
            } 
        } else if (current_stage_json.objects.platforms[i].type == "outcrop") {
            platform_.type = "outcrop";
            platform_.img = outcrop;
            platform_.scale = 2;
            platform_.collider = 'n';

            let collider_top_ = new Sprite(platform_.x, platform_.y - platform_.hh + 7, platform_.w - 40, 10)
            collider_top_.visible = false;
            collider_top_.collider = 's';
        }
    }
}

// Calls the draw function for all sprites and then draws the overlay
// so that the overlay is drawn above all sprites
function drawOverlay() {
    camera.on();
    allSprites.draw()
    camera.off();
    image(overlay, 0, 0, 256, 256)
}

// Spawns the tiles and makes sure theyre visible
function initialiseLevel() {
    spawnTiles();
    Tiles.visible = true;
}

// Gets the player out from cryostasis and puts it at the input parameter 
// coordinates
function spawnPlayer(x, y) {
    Player.x = x;
    Player.y = y;
    Player.visible = true;
    Player.collider = 'd';
}

// Puts the player in cyrostasis (Because the player cannot actually be
// removed from the scene it will fall indefinitely and eventually despawn
// when it reaches 10000 pixels below the camera and this fixes it by making
// invisible but locked to the screen to prevent actual despawning)
function despawnPlayer() {
    Player.x = 128;
    Player.y = 128;
    Player.visible = false;
    Player.collider = 's';
}

// Just updates the current_stage_json variable to store the data from
// the parameter stage json data
function loadLevel(level) {
    switch(level) {
        case 1:
            current_stage_json = level_1_json;
            break;
        case 2:
            current_stage_json = level_2_json;
            break;
    }
    Player.respawn = current_stage_json.start_pos
}

// Handles the cinematic scroll to the next checkpoint area, takes a y 
// position and a speed (pixels per second), also locks the player
// from moving while it is happening
async function moveCamera(position, speed) {
    Input.movement.locked = true;
    await camera.moveTo(128, position, speed);
    updateBoundaries()
    Input.movement.locked = false;
}

// Main movement controller, handles movement input and some collision for
// things such as grabbing walls, seperate functions are used for jumping,
// dashing, grabbing walls and animations
function movePlayer() {
    if (player_collider_left.overlapping(Tiles) || player_collider_right.overlapping(Tiles)) {
        Player.touchingWall = true;
    } else {
        Player.touchingWall = false;
    }
    if (player_collider_bottom.overlapping(Tiles) || player_collider_bottom.overlapping(Platforms)) {
        Player.jumping = false;
        setJumps(1)
    }
    if (Input.movement.locked == false) {
        if (Input.movement.grab == true && Player.touchingWall == true && Input.movement.jump == false) {
            grabWall();
        } else if (Player.holdingWall == true) {
            releaseWall();
        }
        if (Player.holdingWall == false) {
            if (Input.movement.left == true && !(player_collider_left.overlapping(Tiles) || 
            player_collider_left.overlapping(WallTiles))) {
                Player.vel.x = -1;
                Player.facingDirection = 'left';
            } else if (Input.movement.right == true && !(player_collider_right.overlapping(Tiles) || 
            player_collider_right.overlapping(WallTiles))) {
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
            playerDash();``
        }    
        animatePlayer();
    } else {
        Player.changeAni('idle')
    }

}

// Applies an upward force if the player has not yet reached their maximum
// consecutive jumps value and also updates that value
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
    jump_sound.play();
} 

// Literally just sets the current jumps value ?? Why did I write this ??
function setJumps(val) {
    Player.jumps = val;
}

// Creates the illusion that the player is holding the wall by spawning an
// invisible platform beneath them
function grabWall() {
    if (Player.holdingWall == false) {
        grab_platform = new Sprite(player_collider_bottom.x, player_collider_bottom.y + 1, Player.w, 1, 's');
        grab_platform.visible = false;
    }
    Player.jumping = false;
    Player.holdingWall = true;
}

// Deletes the invisible platform created during grabWall()
function releaseWall() {
    grab_platform.remove();
    Player.holdingWall = false;
}

// Gives the player a short burst of x velocity, based on the direction
// they are facing. Doesn't let them teleport through walls and also
// starts the timer for when the dash can be used again
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

// Counts down the time until the player can dash again, I have no idea
// why I need the 1ms sleep but it works with it and doesn't without it
async function dashCooldown() {
    await sleep(1);
    Player.dashOnCooldown = true;
    await sleep(Player.dashCooldown);
    Player.dashOnCooldown = false;
}

// Handles all the player animations, uses a range of variables such as
// Player states, input states and priorities to determine which animation
// to play
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

// Just checks if the player is out of bounds
function boundaryCheck() {
    if (player_hit_box.overlaps(Boundaries)) {
        killPlayer();
    }
}

// Detects player activating flags and dying to various obstacles
function collisionDetection() {
    for (i = 0; i < current_stage_json.objects.flags.length; i++) {
        if (player_hit_box.overlaps(CheckPoints[i])) {
            if (i == current_stage_json.objects.flags.length - 1) {
                levelComplete(Game.current_level);
            } else if (CheckPoints[i].activated == false) {
                activateCheckpoint(i);
            }
        }
    }
    if (player_hit_box.overlaps(Spikes) || Player.collides(RollingRocks) ||
        Player.collides(Icicles)) {
        killPlayer();
        death_sound.play();
    }
    for (i = 0; i < current_stage_json.objects.fruits.length; i++) {
        if (player_hit_box.overlaps(Fruits[i])) {
            Fruits[i].visible = false;
            Saves.data[Game.current_level - 1].fruits[i] = true;
        }
    }
}

// Moves the clouds in the background and resets them when
// off screen
function atmosphere() {
    for (i = 0; i < 6; i++) {
        if (Clouds.x_pos[i] > CANVASWIDTH) {
            resetCloud(i);
        }
    }

    tint(0, 100)
    for (i = 0; i < 6; i++) {
        Clouds.x_pos[i] += Clouds.speed
        image(Clouds.sprites[Clouds.sprite[i]], Clouds.x_pos[i], Clouds.y_pos[i], 256, 32)  
    }
    noTint()
}

// Sets the collider for one way platforms, if player is above
// it's solid, if below its not solid
function updatePlatforms() {
    for (i = 0; i < current_stage_json.objects.platforms.length; i++) {
        if (player_collider_bottom.y - player_collider_bottom.h <= Platforms[i].y && Platforms[i].type != "outcrop") {
            Platforms[i].collider = 'k';
        } else {
            Platforms[i].collider = 'n';
        }
    }
}

// Moves the cloud platforms between their range
function movePlatforms() {
    for (i = 0; i < current_stage_json.objects.platforms.length; i++) {
        if (Platforms[i].type == "cloud") {
            if (Platforms[i].moving == "left") {
                Platforms[i].x -= current_stage_json.objects.platforms[i].speed
                if (Platforms[i].x <= current_stage_json.objects.platforms[i].range.min) {
                    Platforms[i].moving = "right"
                }
            } else if (Platforms[i].moving == "right") {
                Platforms[i].x += current_stage_json.objects.platforms[i].speed
                if (Platforms[i].x >= current_stage_json.objects.platforms[i].range.max) {
                    Platforms[i].moving = "left"
                }
            }
        }
    }
}

// Triggers at the completion of a level and begins the transition
// onto the next
function levelComplete(level) {
    Game.current_level = level + 1;
    Game.saves[0].current_level = level + 1;
    Game.game_running = false;
    Game.level_loaded = false;
    transitionScene(7, 1000);
}

// Spawns the clouds at random x values and assigns one of 
// the 5 cloud sprites
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

// Resets the position of the cloud in position [index] of
// the cloud array
function resetCloud(index) {
    let n = round(random(100)) - 200;
    let m = round(random(4))
    Clouds.x_pos[index] = n
    Clouds.sprite[index] = m
}

// Returns the character at the parameter value in the tilemap
function getTile(index) { 
    let pos = getGridPosition(index);
    rowPos = pos.y
    colPos = pos.x
    tile = current_stage_json.tilemap[rowPos].charAt(colPos)

    return tile;
}

// Returns the row, column / x , y values of the tile at the 
// index parameter
function getTilePosition(index) { 
    let pos = getGridPosition(index)

    rowPos = (pos.y * 16) - (current_stage_json.tilemap.length * 16) + 296
    colPos = pos.x * 16

    return { x: colPos, y : rowPos }
}

// Returns the grid position (world coordinates) of the tile
// at the index parameter
function getGridPosition(index) {
    let colPos, rowPos;
    let rowLength = current_stage_json.tilemap[0].length;

    rowPos = floor(index / rowLength)
    colPos = index % rowLength

    return { x: colPos, y: rowPos}
}

// Activates the index value checkpoint and sets the player's
// respawn to it, also triggers the camera to move and change
// it's mode (static, follow)
function activateCheckpoint(index) {
    CheckPoints[index].activated = true;
    CheckPoints[index].changeAni('active');
    Player.respawn = [CheckPoints[i].x, CheckPoints[i].y]
    moveCamera(current_stage_json.objects.flags[index].camera, 1);
    Game.camera_cache = current_stage_json.objects.flags[index].camera;
    if (current_stage_json.objects.flags[index].camera_type == "follow") {
        changeCamera(1);
    }
}

// Kills and then respawns the player
function killPlayer() {
    // do some sort of death anim / respawn timer
    // also could do different death types so like falling / spikes should be different
    respawnPlayer();
}

// Resets the player position to it's respawn coordinates
function respawnPlayer() {
    Player.x = Player.respawn[0];
    Player.y = Player.respawn[1];
    camera.y = Game.camera_cache;
}

// Updates the camera mode to either stay static or follow the
// Player's y value
function changeCamera(type) {
    if (type == 0) {
        Game.camera_following_player = false;
    } else if (type == 1) {
        Game.camera_following_player = true;
    }
}

// If the current camera mode is follow the camera.y value is 
// set to the Player.y value, floored to make it look smoother
function updateCamera() {
    if (Game.camera_following_player == true) {
        if (Player.y < Game.camera_cache) {
            camera.y = floor(Player.y)
        }
    }
}

function obstacleDetection() { // fix detection in the negative y positions
    for (i = 0; i < RollingRocks.length; i++) {
        if (Player.y - RollingRocks[i].y > RollingRocks[i].radius) {
            triggerRollingRock(i);
        }
        if (RollingRocks[i].collides(WallTiles) || RollingRocks[i].collides(Player) || 
            RollingRocks[i].overlaps(Spikes)) {
            RollingRocks[i].x = RollingRocks[i].default_x;
            RollingRocks[i].y = RollingRocks[i].default_y;
            RollingRocks[i].collider = 's';
            if (Player.y < RollingRocks[i].y) {
                RollingRocks[i].remove();
            }
        }
    }
    for (i = 0; i < Icicles.length; i++) {
        if (Icicles[i].x - Player.x < Icicles[i].trigger && Icicles[i].x - Player.x > 
            -(Icicles[i].trigger) && Icicles[i].y < Player.y && Icicles[i].on_cooldown == false) {
            Icicles[i].falling = true;
            triggerIcicle(i);
        }
        if ((Icicles[i].collides(Tiles) || Icicles[i].collides(WallTiles) || 
            Icicles[i].collides(Player)) && Icicles[i].falling == false) {
            Icicles[i].x = Icicles[i].default_x;
            Icicles[i].y = Icicles[i].default_y;
            Icicles[i].collider = 's';
            Icicles[i].img = icicle_sprite_3;
        }
    }
}

async function triggerRollingRock(index) {
    RollingRocks[index].on_cooldown = true;
    RollingRocks[index].falling = true;
    RollingRocks[index].collider = 'd';
}

async function triggerIcicle(index) { 
    Icicles[index].on_cooldown = true;
    Icicles[index].img = icicle_sprite_2;
    await sleep(800);
    Icicles[index].img = icicle_sprite_1;
    Icicles[index].addCollider(-4, -1, 3, 9);
    Icicles[index].collider = 'd'
    await sleep(300);
    Icicles[index].falling = false;
    await sleep(Icicles[index].cooldown);
    Icicles[index].removeColliders();
    Icicles[index].addCollider(-4, -5, 3, 3);
    Icicles[index].on_cooldown = false;
}