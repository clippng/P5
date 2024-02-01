let menuOptions, menu_box_sprite, highlighted_menu_box_sprite, big_menu_box_sprite, highlighted_big_menu_box_sprite;


const Menu = {
    options: 0,
    loaded: false,
    selected_menu: 0,
    box_size: 0,
};

function initialiseMenu() {
    menuOptions = new Group();
    menuOptions.collider = 'n';
    menuOptions.img = menu_box_sprite;
    menuOptions.visible = false;
    menuOptions.scale = 2;
    menuOptions.textSize = 12;
    menuOptions.textColor = '#816271';
    menuOptions.textStroke = '#000000'
}

function loadMenu(menu) {
    if (Menu.loaded == false) {
        Menu.selected_menu = 0;
        switch (menu ) {
            case 0:
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
                menuOptions[0].text = "New Game"
                menuOptions[1].text = "Continue"
                menuOptions[2].text = "Endless"
                menuOptions[3].text = "Leaderboard"
                menuOptions[4].text = "Tutorial"
                menuOptions[5].text = "Settings"
                Menu.loaded = true;
                break;
            case 1:
                Menu.options = 3;
                Menu.box_size = 1;
                for (i = 0; i < Menu.options; i++) { // make bigger sprites (108px wide)
                    let menuOptions_ = new menuOptions.Sprite();
                    menuOptions_.x = 128
                    menuOptions_.y = 80 + (i * 45)
                }
                Menu.loaded = true;
                break;
            case 2: // settings
                Menu.options = 4;
                Menu.box_size = 1;
                for (i = 0; i < Menu.options; i++) { // also want bigger sprites here
                    let menuOptions_ = new menuOptions.Sprite();
                    menuOptions_.x = 128;
                    menuOptions_.y = 80 + (i * 45)
                }         
                Menu.loaded = true;
                break;
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