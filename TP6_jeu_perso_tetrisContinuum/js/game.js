let animFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    null;

let tics = 0;
let _timeToBeAlive = 30;

//Canvas
let divArena;
let canArena;
let canScore;
let conArena;
let conScore;
let ArenaWidth = 700;
let ArenaHeight = 500;

//Background
let imgBackground;
let xBackgroundOffset = 0;
let xBackgroundSpeed = 1;
let backgroundWidth = 1782;
let backgroundHeight = 600;
//une modification

///////////////////////////////////
//Keys
let inputKeys = {
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    SPACE:  32,
    ENTER:  13
};

let keyCooldown = {};

function keyDownHandler(event) {
    "use strict";
    let keyCode = event.keyCode;
    for (let key in inputKeys) {
        if (inputKeys[key] === keyCode) {
            if(keyCooldown[keyCode]<0){
                keyCooldown[keyCode] = 0;
            }
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
    "use strict";
    let keyCode = event.keyCode;
    for (let key in inputKeys){
        if (inputKeys[key] === keyCode) {
            keyCooldown[keyCode] = -1;
        }
    }
}

// pieces
let pieces;
let fallingPiece;


function collision(tabOfObjects){
    let hits = null;
    for(let i in tabOfObjects){
        if ((tabOfObjects[i].cptExplosion === 0) && this.x < tabOfObjects[i].x + tabOfObjects[i].width &&
            this.x + this.width > tabOfObjects[i].x &&
            this.y < tabOfObjects[i].y + tabOfObjects[i].height &&
            this.height + this.y > tabOfObjects[i].y) {
            // collision detected!
            hits = tabOfObjects[i];
            break;
        }
    }
    return hits;
};


function drawItems() {
    "use strict";
}
function clearItems() {
    "use strict";
    player.clear();
    for(let e of enemies) e.clear();
}

function clearScore() {
    conScore.clearRect(0,0,300,50);
}

function drawScore() {

}
function updateGame() {
    "use strict";
    tics++;
    player.update();
    if(tics % 100 === 0) {
        let rand = Math.floor(Math.random() * ArenaHeight);
        enemies.push(new Enemy(ArenaWidth, rand,-2));
    }
    for(let e of enemies) e.update();
    /*
    for(let e of enemies){
        if(e.exists === false || e.x >ArenaWidth || e.x<0){
            enemies.splice(enemies.indexOf(e),1);
        }
    }*/

}
function clearGame() {
    "use strict";
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict";
    // score
    conScore.fillText("life : "+player.nbOfLives, 10, 25);
    conScore.fillText("score : "+player.projectileSet.score, 150,25);

    // game
    player.draw();
    for(let e of enemies) e.draw();
}


function mainloop () {
    "use strict";
    clearGame();
    updateGame();
    drawGame();
}

function recursiveAnim () {
    "use strict";
    mainloop();
    animFrame( recursiveAnim );
}

function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
    canArena.setAttribute("id", "canArena");
    canArena.setAttribute("height", ArenaHeight);
    canArena.setAttribute("width", ArenaWidth);
    conArena = canArena.getContext("2d");
    divArena.appendChild(canArena);

    canScore = document.createElement("canvas");
    canScore.setAttribute("id","canScore");
    canScore.setAttribute("height", ArenaHeight);
    canScore.setAttribute("width", ArenaWidth);
    conScore = canScore.getContext("2d");
    conScore.fillStyle = "rgb(200,0,0)";
    conScore.font = 'bold 12pt Courier';
    divArena.appendChild(canScore);


    player.init();
    enemies = [];

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    animFrame( recursiveAnim );

}

window.addEventListener("load", init, false);