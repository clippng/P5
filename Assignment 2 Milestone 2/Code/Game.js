let camera_following_player = false;
let overlay

let grab_platform;
let Platforms, Boundaries, Tiles, CheckPoints, Spikes
let clouds = []
let current_stage_json, level_1_json, level_2_json;


const Game = {
    game_running: false,
    current_level: 1,
    level_loaded: false,
    camera_cache: 128
}

const Clouds = {
    x_pos: [],
    y_pos: [30, 65, 100, 135, 170, 205],
    sprite: [],
    speed: 0.05
};

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
    updateCamera();
    drawUI();
}

function newGame() {
    transitionScene(3, 2000);
    loadLevel(1);
    Game.game_running = true;
    Game.current_level = 1;
    initialiseAtmosphere();
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

function initialiseTiles() {
    Tiles = new Group();
    Tiles.w = 16;
    Tiles.h = 16;
    Tiles.collider = 's';
}

function initialiseObstacles() {
    RollingRocks = new Group();
    RollingRocks.img = rolling_rock_sprite;
    RollingRocks.friction = 0;

    Spikes = new Group();
    Spikes.facing = 'south'
    Spikes.img = dark_spikes;
    Spikes.collider = 'n'
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

function initialiseBoundaries() {
    Boundaries = new Group();
    Boundaries.collider = 'n';
    Boundaries.visible = false;
}

function initialisePlatforms() { 
    Platforms = new Group();
    Platforms.collider = 'n';
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

function spawnObstacles() { // improve - this is kinda shit currently like why do I have a seperate function for getting json info???
    for (i = 0; i < current_stage_json.objects.obstacles.length; i++) {
        let jsonData = getObstacle(i)
        if (jsonData[0] = "rolling_rock") {
            let obstacle_ = new RollingRocks.Sprite()
            obstacle_.applyTorque(1);
            obstacle_.x = jsonData[1];
            obstacle_.y = jsonData[2];
            obstacle_.shape = 'circle'
        }
    }
}

function spawnTiles() {
    let n = current_stage_json.tilemap[0].length * current_stage_json.tilemap.length
    for (i = 0; i < n; i++) {
        let tile_ = getTile(i)
        if (tile_ != '/') {
            let tile = new Tiles.Sprite()                    
            let pos = getTilePosition(i);
            tile.x = pos.x
            tile.y = pos.y //- 376// make this part of the getTilePosition() function
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
                    break;
                case '$':
                    tile.remove();
                    spawnFruit();
                    break;
                case '-':
                    tile.img = wooden_platform;
                    tile.debug = true;
                    break;
                case '_':
                    tile.img = wooden_platform
                    tile.mirror.x = true;
                    tile.debug = true;
                    break;
                case '=':
                    tile.img = wooden_platform_m
                    break;
            }
        }
    }
}

function setUpBoundaries() { //might not need top boundary or even sides
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

function getObstacle(index) {
    let obstacle_ = [];
    obstacle_[0] = current_stage_json.objects.obstacles[index].type;
    obstacle_[1] = current_stage_json.objects.obstacles[index].x_pos;
    obstacle_[2] = current_stage_json.objects.obstacles[index].y_pos;

    return obstacle_;
}

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

function spawnFruit() {

}

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

function drawUI() {
    camera.on();
    allSprites.draw()
    camera.off();
    image(overlay, 0, 0, 256, 256)
}

function initialiseLevel() {
    //spawnObstacles();
    spawnTiles();
    //RollingRocks.visible = true;
    Tiles.visible = true;
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
        animatePlayer();
    } else {
        Player.changeAni('idle')
    }

}

async function moveCamera(position, speed) {
    Input.movement.locked = true;
    await camera.moveTo(128, position, speed);
    updateBoundaries()
    Input.movement.locked = false;
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

function boundaryCheck() {
    if (player_hit_box.overlaps(Boundaries)) {
        killPlayer();
    }
}

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
    if (player_hit_box.overlaps(Spikes)) {
        killPlayer();
    }

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

function updatePlatforms() {
    for (i = 0; i < current_stage_json.objects.platforms.length; i++) {
        if (player_collider_bottom.y - player_collider_bottom.h <= Platforms[i].y && Platforms[i].type != "outcrop") {
            Platforms[i].collider = 'k';
        } else {
            Platforms[i].collider = 'n';
        }
    }
}

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

function levelComplete(level) {
    Game.current_level = level + 1
    //currentLevel++
    console.log("complete")
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

function getTile(index) { 
    let pos = getGridPosition(index);
    rowPos = pos.y
    colPos = pos.x
    tile = current_stage_json.tilemap[rowPos].charAt(colPos)

    return tile;
}

function getTilePosition(index) { 
    let pos = getGridPosition(index)
    rowPos = (pos.y * 16) - (current_stage_json.tilemap.length * 16) + 296
    colPos = pos.x * 16

    return { x: colPos, y : rowPos }
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
    Player.respawn = [CheckPoints[i].x, CheckPoints[i].y]
    moveCamera(current_stage_json.objects.flags[index].camera, 1);
    if (current_stage_json.objects.flags[index].camera_type == "follow") {
        Game.camera_cache = current_stage_json.objects.flags[index].camera;
        changeCamera(1);
    }
}


function killPlayer() {
    // do some sort of death anim / respawn timer
    // also could do different death types so like falling / spikes should be different
    respawnPlayer();
}

function respawnPlayer() {
    Player.x = Player.respawn[0];
    Player.y = Player.respawn[1];
}

function changeCamera(type) {
    if (type == 0) {
        camera_following_player = false;
    } else if (type == 1) {
        camera_following_player = true;
    }
}

function updateCamera() {
    if (camera_following_player == true) {
        if (Player.y < Game.camera_cache) {
            camera.y = floor(Player.y)
        }
    }
}

function triggerRollingRock(index) {
    RollingRocks[i].vel.x = 0.1
}
