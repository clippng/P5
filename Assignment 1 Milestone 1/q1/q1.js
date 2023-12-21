const CANVASWIDTH = 800;
const CANVASHEIGHT = 900;
const WHITE = 255;
const BLACK = 0;
const BLUE = [34, 154, 214];
const RED = [255, 30, 30];
const GOLD = [235, 204, 52];
const BROWN = [66, 58, 54];


function setup() {
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
}

function draw() {
    background(WHITE);
    stroke(0);
    strokeWeight(4);

    fill(BLUE);
    ellipse(395, 265, 465, 460); // Head

    fill(WHITE);
    ellipse(460, 760, 160, 80); // Right foot
    ellipse(310, 780, 160, 80); // Left foot

    fill(BLUE);
    ellipse(255, 540, 120, 160); // Left Arm

    curveTightness(0.5);

    beginShape(); // Right arm
    curveVertex(560, 525);
    curveVertex(664, 414);
    curveVertex(620, 390);
    curveVertex(520, 450);
    endShape(CLOSE);

    fill(WHITE);
    rect(195, 130, 420, 350, 200); // Face

    fill(BLUE)
    beginShape(); // Body
    curveVertex(251, 460);
    curveVertex(260, 760);
    curveVertex(360, 765);
    curveVertex(386, 740);
    curveVertex(420, 750);
    curveVertex(515, 745);
    curveVertex(560, 590);
    curveVertex(535, 455);
    endShape(CLOSE);
    
    fill(WHITE);
    ellipse(650, 385, 80); // Hand

    ellipse(415, 560, 255, 230); //Stomach
    arc(415, 560, 200, 180, 0, PI, CHORD); 
    
    rect(270, 50, 126, 140, 1000, 100, 100, 100); // Left eye
    rect(400, 50, 125, 140, 100, 100, 100, 1000); // Right eye
    fill(BLACK);
    ellipse(350, 130, 30, 50); // Left pupil
    ellipse(440, 130, 30, 50); // Right pupil
    fill(WHITE);
    ellipse(350, 130, 12, 20); // Left pupil center
    ellipse(440, 130, 12, 20); // Right pupil cemter

    fill(RED);
    rect(250, 445, 300, 20, 15); // Collar

    ellipse(398, 192, 58); // Nose

    ellipse(215, 650, 50); // Tail
    line(240, 650, 255, 648); 
 

    fill(GOLD); // Bell
    ellipse(405, 485, 80);
    fill(BROWN); 
    rect(405, 510, 7, 14);
    rect(395, 491, 30, 20, 100);
    noFill(); 
    curve(405, 600, 367, 470, 440, 470, 400, 600);
    curve(405, 600, 365, 485, 442, 485, 400, 600);

    curve(400, 750, 386, 740, 410, 710, 550, 700); // Line between legs

    curve(240, 240, 330, 240, 200, 190, 240, 240); // Left whiskers
    curve(260, 310, 330, 285, 180, 295, 260, 320);
    curve(310, 400, 330, 330, 200, 380, 310, 400);
    curve(560, 260, 480, 230, 630, 180, 560, 260); // Right whiskers
    curve(570, 300, 480, 278, 640, 260, 670, 300);
    curve(560, 350, 480, 325, 640, 330, 560, 350);

    curve(200, 200, 398, 222, 395, 390, 365, 300); // Mouth
    curveTightness(-1.8);
    curve(300, 0, 230, 305, 565, 278, 500, 0); 

    stroke(BLUE); // Details
    strokeWeight(10);
    line(250, 468, 252, 500); 
    line(548, 470, 550, 478); 
    stroke(BLACK);
    strokeWeight(5);
    line(377, 755, 385, 742); 

    noStroke();
    fill(WHITE);
    ellipse(387, 185, 20); // Reflection on nose
}