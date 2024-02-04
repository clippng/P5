////// Menus ////////////////////////////////////////////////////////////////////
/* All the menu related functions, groups and data.*/
/////////////////////////////////////////////////////////////////////////////////

// Object for current menu data
const Menu = {
    options: 0,
    loaded: false,
    selected_menu: 0,
    box_size: 0,
};

// Creates the menuOptions group which is basically just the rectangles used in
// all the menus
function initialiseMenu() {
    menu_options = new Group();
    menu_options.collider = 'n';
    menu_options.img = menu_box_sprite;
    menu_options.visible = false;
    menu_options.scale = 2;
    menu_options.textSize = 12;
    menu_options.textColor = '#816271';
    menu_options.textStroke = '#000000'
}

// A very large function that loads an input menu, menus are classified by
// an integer value that is loosely asociated with where it appears in game
// The actual name of each menu is commented in the function
function loadMenu(menu) {
    if (Menu.loaded == false) {
        Menu.selected_menu = 0;
        switch (menu ) {
            case 0: // Main menu
                Menu.options = 6;
                Menu.box_size = 0;
                for (i = 0; i < Menu.options; i++) {
                    let menu_options_ = new menu_options.Sprite();
                    if (i % 2 == 0) {
                        menu_options_.x = 74    
                    } else {
                        menu_options_.x = 186
                    } 
                    if (i < 2) {
                        menu_options_.y = 80;
                    } else if (i < 4) {
                        menu_options_.y = 125;
                    } else {
                        menu_options_.y = 170;
                    }
                }
                menu_options[0].text = "New Game"
                menu_options[1].text = "Continue"
                menu_options[2].text = "Endless"
                menu_options[3].text = "Leaderboard"
                menu_options[4].text = "Tutorial"
                menu_options[5].text = "Settings"
                break;
            case 1: // Load save
                Menu.options = 3;
                Menu.box_size = 1;
                for (i = 0; i < Menu.options; i++) { 
                    let menu_options_ = new menu_options.Sprite();
                    menu_options_.x = 128
                    menu_options_.y = 80 + (i * 45)
                }
                break;
            case 2: // settings
                Menu.options = 4;
                Menu.box_size = 1;
                for (i = 0; i < Menu.options; i++) { 
                    let menu_options_ = new menu_options.Sprite();
                    menu_options_.x = 128;
                    menu_options_.y = 80 + (i * 45)
                }         
                break;
            case 3: // level finished
                Menu.options = 2;
                Menu.box_size = 0;
                for (i = 0; i < Menu.options; i++) {
                    let menu_options_ = new menu_options.Sprite();
                    menu_options_.y = 200;
                    menu_options_.x = 74 + (i * 112);
                }
                menu_options[0].text = "Main Menu";
                menu_options[1].text = "Continue";
                break;
        }
    }
    Menu.loaded = true;
    menu_options.visible = true;
}

// Changes the currently selected menuOptions sprite, they're all setup so that
// 0 is the top left and increases left then down. The parameter is used to get
// which logic to use because different menus have different layouts
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
        case 3:
            if (Input.menu.right == true && Menu.selected_menu != Menu.options - 1) {
                Menu.selected_menu++;
            } else if (Input.menu.left == true && Menu.selected_menu != 0) {
                Menu.selected_menu--;
            }
    }
}

// Just changes the sprite of the currently selected menu, works with both sized
// boxes, also changes it back when it's not selected
function highlightMenu() {
    for (i = 0; i < Menu.options; i++) {
        if (Menu.box_size == 0) {
            if (i == Menu.selected_menu) {
                menu_options[i].img = highlighted_menu_box_sprite;
                menu_options[i].textColor = '#f6d6db';
            } else {
                menu_options[i].img = menu_box_sprite;
                menu_options[i].textColor = '#816271';
            }            
        } else if (Menu.box_size == 1) {
            if (i == Menu.selected_menu) {
                menu_options[i].img = highlighted_big_menu_box_sprite;
                menu_options[i].textColor = '#f6d6db';
            } else {
                menu_options[i].img = big_menu_box_sprite;
                menu_options[i].textColor = '#816271';
            }      
        }
    }
}

// Only used by the main menu, just does whatever the button says, mostly just
// changing to another menu
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
            //transitionScene(7, 200)
            break;
        case 5:
            transitionScene(6, 200)
            break;
    }

}