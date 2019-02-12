let animFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    null;

let tics = 0;

//Canvas
let divArena;
let ctxArena;
let ArenaWidth = 700;
let ArenaHeight = 500;

///////////////////////////////////
let speedBoost=9;
let movingSpeed=1;
//keyCooldown[keyCode] = 2;

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
// score
let score;

// pieces
let pieces;


let fallingPiece;


function updateGame() {
    "use strict";

    tics++;

    fallingPiece.moveAndCollide(0,movingSpeed, pieces);
    for (let keyCode in keyCooldown) {
        if(keyCooldown[keyCode] === 0){
            if(keyCode == inputKeys.LEFT) {
                //keyCooldown[keyCode] = 2;
                fallingPiece.moveAndCollide(-movingSpeed,0, pieces);
            }
            if(keyCode == inputKeys.RIGHT) {
                //keyCooldown[keyCode] = 2;
                fallingPiece.moveAndCollide(movingSpeed,0, pieces);
            }
            if(keyCode == inputKeys.UP) {
                keyCooldown[keyCode] = -1;// touch up (not pressed)
                fallingPiece.rotate();
                if(fallingPiece.collide(pieces))
                    fallingPiece.rotateBack();
            }
            if(keyCode == inputKeys.DOWN) {
                fallingPiece.moveAndCollide(0,speedBoost, pieces);
            }
        }else if(keyCooldown[keyCode] > 0){
            keyCooldown[keyCode]--;
        }
    }

    if(fallingPiece.fallen || fallingPiece.pos.y + fallingPiece.height > ArenaHeight){
        fallingPiece.falling=false;
        //todo check position
        pieces.push(fallingPiece);
        fallingPiece = randomFallingPiece();
    }
}

function clearGame() {
    "use strict";
    ctxArena.clearRect(150,0,300,50);

    fallingPiece.clear(ctxArena);
}

function drawGame() {
    "use strict";
    //ctxArena.fillText("life : " + nbOfLives, 150, 25);
    ctxArena.fillText("score : " + score, 150 ,25);

    // game
    fallingPiece.draw(ctxArena);
    for(let p of pieces) p.draw(ctxArena);
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
    ctxArena = document.createElement("canvas");
    ctxArena.setAttribute("id", "canArena");
    ctxArena.setAttribute("height", ArenaHeight);
    ctxArena.setAttribute("width", ArenaWidth);
    divArena.appendChild(ctxArena);
    ctxArena = ctxArena.getContext("2d");
    ctxArena.fillStyle = "rgb(200,0,0)";
    ctxArena.font = 'bold 12pt Courier';


    fallingPiece = randomFallingPiece();
    pieces = [];
    score = 0;

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    animFrame( recursiveAnim );

}

window.addEventListener("load", init, false);