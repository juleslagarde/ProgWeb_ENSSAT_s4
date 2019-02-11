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

let movingSpeed=5;

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

// score
let score;
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


}

function updateGame() {
    "use strict";
    tics++;

    for (let keyCode in keyCooldown) {
        if(keyCooldown[keyCode] === 0){
            if(keyCode == inputKeys.LEFT) {
                keyCooldown[keyCode] = 2;
                fallingPiece.pos.x -= movingSpeed;
                if(fallingPiece.pos.x<0) fallingPiece.pos.x=0;
            }
            if(keyCode == inputKeys.RIGHT) {
                keyCooldown[keyCode] = 2;
                fallingPiece.pos.x += movingSpeed;
                if(fallingPiece.pos.x>ArenaHeight-this.height) fallingPiece.pos.x=ArenaHeight-this.height;
            }
            if(keyCode == inputKeys.UP) {
                //shoot
                keyCooldown[keyCode] = 2;
                fallingPiece.rotate();
            }
        }else if(keyCooldown[keyCode] > 0){
            keyCooldown[keyCode]--;
        }
    }

    if(fallingPiece.collide(pieces)){
        fallingPiece.falling=false;
        //todo check position
        pieces.push(fallingPiece);
        fallingPiece = randomFallingPiece();
    }

    fallingPiece.pos.y+=movingSpeed;

}

function randomFallingPiece(){
    let fallingPiece = new Piece(Math.random()*100+25,0, "#"+Math.floor(Math.random()*1000000),Math.floor(Math.random()*5));
    fallingPiece.falling=true;
    return fallingPiece;
}

function clearGame() {
    "use strict";
    ctxArena.clearRect(150,0,300,50);//todo update coords

    fallingPiece.clear(ctxArena);
}

function drawGame() {
    "use strict";
    //ctxArena.fillText("life : " + nbOfLives, 150, 25);
    ctxArena.fillText("score : " + score, 150 ,25);

    // game
    fallingPiece.draw(ctxArena);
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

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    animFrame( recursiveAnim );

}

window.addEventListener("load", init, false);