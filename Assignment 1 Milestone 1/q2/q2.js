const CANVASWIDTH = 700;
const CANVASHEIGHT = 700;
const ORIGINX = CANVASWIDTH / 2;
const ORIGINY = CANVASHEIGHT / 2;
const DIAMETER = 600;

const BLACK = 0;
const BACKGROUNDCOLOUR = 250;
const COLOUR1 = [185,171,223]; 
const COLOUR2 = [230,175,202]; 
const COLOUR3 = [234,209,220];
const COLOUR4 = [253,234,179];
const COLOUR5 = [199,223,189];


let comedy = 18;
let action = 23; 
let romance = 14;
let drama = 11; 
let sciFi = 8; 
let total = comedy + action + romance + drama + sciFi;
let fontSize = DIAMETER / 25;

let sect; // Used to store the value of 1 unit (1 vote) in radians
let radius = DIAMETER / 2;
let halfRadius = radius / 2;
let sect1, sect2, sect3; // Variables to help align the arcs
let comedyPercent, actionPercent, romancePercent, dramaPercent, sciFiPercent; 
let comedyData, actionData, romanceData, dramaData, sciFiData;


function setup() {
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    background(BACKGROUNDCOLOUR);   

    sect = 2 * PI / total;
    sect1 = comedy + action;
    sect2 = sect1 + romance;
    sect3 = sect2 + drama;

    comedyPercent =  round(comedy / total * 100, 2);
    actionPercent = round(action / total * 100, 2);
    romancePercent = round(romance / total * 100, 2);
    dramaPercent = round(drama / total * 100, 2);
    sciFiPercent = round(sciFi / total * 100, 2);
    
    comedyData = "Comedy - " + comedy + " (" + comedyPercent + "%)";
    actionData =  "Action - " + action + " (" + actionPercent + "%)";
    romanceData = "Romance - " + romance + "(" + romancePercent + "%)";
    dramaData = "Drama - " + drama + "(" + dramaPercent + "%)";
    sciFiData = "SciFi - " + sciFi + " (" + sciFiPercent + "%)";    
}

function draw() {
    background(BLACK)
    // Draw the pie chart
    fill(COLOUR1);
    arc(CENTER_X, CENTER_Y, DIAMETER, DIAMETER, 0, comedy * sect, PIE);
    fill(COLOUR2);
    arc(CENTER_X, CENTER_Y, DIAMETER, DIAMETER, comedy * sect, sect1 * sect, PIE);
    fill(COLOUR3);
    arc(CENTER_X, CENTER_Y, DIAMETER, DIAMETER, sect1 * sect, sect2 * sect, PIE);
    fill(COLOUR4);
    arc(CENTER_X, CENTER_Y, DIAMETER, DIAMETER, sect2 * sect, sect3 * sect, PIE);
    fill(COLOUR5);
    arc(CENTER_X, CENTER_Y, DIAMETER, DIAMETER, sect3 * sect, total * sect, PIE);

    background(COLOUR1);
    // Labels
    fill(BLACK);
    textAlign(CENTER, BOTTOM);
    textSize(fontSize); 

    push();
    translate(CENTER_X, CENTER_Y);
    rotate(comedy * sect);
    if (comedy > total * 0.25 && comedy < total * 0.75) {
        textAlign(CENTER, TOP);
        rotate(PI);
        text(comedyData, halfRadius * -1, 0);
    } else {
        text(comedyData, halfRadius, 0);
    }
    pop();

    push();
    translate(CENTER_X, CENTER_Y);
    rotate(sect1 * sect);
    if (sect1 > total * 0.25 && sect1 < total * 0.75) {
        textAlign(CENTER, TOP);
        rotate(PI);
        text(actionData, halfRadius * -1, 0);
    } else {
        text(actionData, halfRadius, 0);
    }
    pop();

    push();
    translate(CENTER_X, CENTER_Y);
    rotate(sect2 * sect);
    if (sect2 > total * 0.25 && sect2 < total * 0.75) {
        textAlign(CENTER, TOP);
        rotate(PI);
        text(romanceData, halfRadius * -1, 0);
    } else {
        text(romanceData, halfRadius, 0);
    }
    pop();

    push();
    translate(CENTER_X, CENTER_Y);
    rotate(sect3 * sect);
    if (sect3 > total * 0.25 && sect3 < total * 0.75) {
        textAlign(CENTER, TOP);
        rotate(PI);
        text(dramaData, halfRadius * -1, 0);
    } else {
        text(dramaData, halfRadius, 0);
    }
    pop();

    push();
    translate(CENTER_X, CENTER_Y);
    rotate(total * sect);
    text(sciFiData, halfRadius, 0);
    pop();
}
