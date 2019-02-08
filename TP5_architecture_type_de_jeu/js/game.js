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
    UP: 38,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13
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
///////////////////////////////////


///////////////////
// une collection de projectiles
function ProjectileSet(tabTarget){
    this.tabTarget = tabTarget;
    this.score = 0;
    this.tabProjectiles = [];
    this.add = function (projectile) {
        this.tabProjectiles.push(projectile);
    };
    this.remove = function () {

        this.tabProjectiles.map(function(obj,index,array){
            if(obj.exists === false ||obj.x >ArenaWidth || obj.x<0){
                delete array[index];
            }
        });

    };


    this.update = function(){
        this.remove();
        let score = 0;
        this.tabProjectiles.map(function(obj){
            obj.update();
            if(obj.exists === false) {//hit
                score = score +1;
            }
        });
        this.score = this.score + score;
    };
    this.clear = function(){
        this.tabProjectiles.map(function(obj){
            obj.clear();
        });
    };
    this.draw = function(){
        this.tabProjectiles.map(function(obj){
            obj.draw();
        });
        //console.log(this.tabProjectiles.length);
    };

};

////////////////////
// un objet Projectile
function Projectile(x,y,speed,width,height,color){
    this.x = x;
    this.y = y;
    this.xSpeed = speed;
    this.width = width;
    this.height = height;
    this.color = color;
    this.exists = true;
    this.collision = function(tabOfObjects){
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
    this.draw = function(){
        if(this.exists){
            conArena.fillStyle = this.color;
            conArena.fillRect(this.x,this.y,this.width,this.height);
        }
    };
    this.clear = function(){
        if(this.exists){
            conArena.clearRect(this.x-1,this.y-1,this.width+2,this.height+2);
        }
    };
    this.update = function(){
        if(this.exists){
            this.x +=   this.xSpeed ;
            let tmp = this.collision([player].concat(enemies.tabEnemies));
            if(tmp != null){
                tmp.explodes();
                this.exists = false;
            }
        }
    };
}
/////////////////////////////////

/////////////////////////////////
// Enemy
let enemies = {
    init : function(){
        this.tabEnemies = [];
    },
    add : function (enemy) {
        this.tabEnemies.push(enemy);
    },
    remove : function () {
        this.tabEnemies.map(function(obj,index,array){
            if(obj.exists === false ||obj.x >ArenaWidth || obj.x<0){
                delete array[index];
            }
        });
    },
    draw : function(){
        this.tabEnemies.map(function(obj){
            obj.draw();
        });
    },
    clear : function(){
        this.tabEnemies.map(function(obj){
            obj.clear();
        });
    },
    update : function(){

        this.tabEnemies.map(function(obj){
            obj.update();
        });
        this.remove();
    }

};
//test
function Enemy(x,y,speed){
    this.x = x;
    this.yOrigine = y;
    this.y = this.yOrigine;
    this.xSpeed = speed;
    this.exists = true;
    this.height = 30;
    this.width = 40;
    this.img = new Image();
    this.img.src = "./assets/Enemy/eSpritesheet_40x30.png";
    this.cpt = 0;

    this.cptExplosion =  0;//10 images
    this.imgExplosion = new Image();
    this.imgExplosionHeight = 128;
    this.imgExplosionWidth = 128;
    this.imgExplosion.src = "./assets/Explosion/explosionSpritesheet_1280x128.png";

    this.projectileSet = new ProjectileSet();
    this.explodes = function(){
        this.cptExplosion = 1;
    };
    this.collision = function(tabOfObjects){
        let hits = null;
        for(let i in tabOfObjects){
            if (this.x < tabOfObjects[i].x + tabOfObjects[i].width &&
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
    this.fire = function (){
        let tmp = new Projectile(this.x-10,this.y+this.height/2,-4,10,5,"rgb(0,200,0)");
        this.projectileSet.add(tmp);
    };
    this.draw = function(){

        this.projectileSet.draw();

        if(this.cptExplosion !== 0){
            conArena.drawImage(this.imgExplosion, this.cptExplosion*this.imgExplosionWidth, 0, this.imgExplosionWidth,this.imgExplosionHeight, this.x,this.y,this.width,this.height);
        }else{
            conArena.drawImage(this.img,  0,this.cpt*this.height,this.width,this.height, this.x,this.y,this.width,this.height);
        }
    };
    this.clear = function(){
        if(this.exists){
            conArena.clearRect(this.x,this.y,this.width,this.height);
        }
        this.projectileSet.clear();
    };
    this.update = function(){
        if(this.cptExplosion === 0){//is not exploding
            this.x +=   this.xSpeed ;
            this.y = this.yOrigine+ ArenaHeight/3 * Math.sin(this.x / 100);
            let tmp = this.collision([player]);
            if(tmp != null){
                tmp.explodes();
                this.exists = false;
            }

            if(tics % 5 === 1) {
                this.cpt = (this.cpt + 1) % 6;
            }
            //if(tics % 50 == 1) this.fire();
        }else{
            if(tics % 3 === 1) {
                this.cptExplosion++;
            }
            if(this.cptExplosion>10){//end of animation
                this.cptExplosion=0;
                this.exists = false;
            }
        }
        this.projectileSet.update();
    };
}
/////////////////////////////////

/////////////////////////////////
// Hero Player
let player = {
    init : function(){
        this.img = new Image();
        this.img.src = "./assets/Ship/Spritesheet_64x29.png";
        this.cpt = 0;
        this.cptExplosion =  10;//10 images
        this.imgExplosion = new Image();
        this.imgExplosionHeight = 128;
        this.imgExplosionWidth = 128;
        this.imgExplosion.src = "./assets/Explosion/explosionSpritesheet_1280x128.png";
        this.projectileSet = new ProjectileSet();
    },
    x : 20,
    ySpeed : 10,
    y : 100,
    height : 29,
    width : 64,
    nbOfLives : 2,
    timeToBeAlive : 0,
    fires : function(){
        let tmp = new Projectile(this.x+this.width,this.y+this.height/2,4,10,3,"rgb(200,0,0)");
        this.projectileSet.add(tmp);
    },
    explodes : function(){
        if(this.timeToBeAlive === 0) {
            this.nbOfLives--;
            if(this.nbOfLives>0){
                this.timeToBeAlive = _timeToBeAlive;
                this.cptExplosion = 1;
            }else{
                //Game Over
                alert("GAME OVER");
            }
        }
    },
    clear : function(){
        conArena.clearRect(this.x,this.y,this.width,this.height);
        this.projectileSet.clear();
    },
    update :  function(){
        if(tics % 10 === 1) {
            this.cpt = (this.cpt + 1) % 4;
        }
        if(this.timeToBeAlive>0) {
            this.timeToBeAlive --;
        }else{
            for (let keyCode in keyCooldown) {
                if(keyCooldown[keyCode] === 0){
                    if(keyCode == inputKeys.UP) {
                        keyCooldown[keyCode] = 2;
                        this.y -= this.ySpeed;
                        if(this.y<0) this.y=0;
                    }
                    if(keyCode == inputKeys.DOWN) {
                        keyCooldown[keyCode] = 2;
                        this.y += this.ySpeed;
                        if(this.y>ArenaHeight-this.height) this.y=ArenaHeight-this.height;
                    }
                    if(keyCode == inputKeys.SPACE) {
                        //shoot
                        keyCooldown[keyCode] = 10;
                        this.fires();
                    }
                }else if(keyCooldown[keyCode] > 0){
                    keyCooldown[keyCode]--;
                }
            }
        }
        this.projectileSet.update();
    },
    draw : function(){
        if(this.timeToBeAlive === 0) {

            conArena.drawImage(this.img, 0,this.cpt*this.height,this.width,this.height, this.x,this.y,this.width,this.height);
        }else{
            //exploding
            if(this.cptExplosion !== 0){
                conArena.drawImage(this.imgExplosion, this.cptExplosion*this.imgExplosionWidth, 0, this.imgExplosionWidth,this.imgExplosionHeight, this.x,this.y,this.width,this.height);
                if(tics % 3 === 0) {this.cptExplosion++;}
                if(this.cptExplosion>10) this.cptExplosion=0;
            }
        }
        this.projectileSet.draw();
    }
};



function updateScene() {
    "use strict";
    xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
}
function updateItems() {
    "use strict";
    player.update();
    tics++;
    if(tics % 100 === 0) {
        let rand = Math.floor(Math.random() * ArenaHeight);

        enemies.add(new Enemy(ArenaWidth, rand,-2));
    }
    enemies.update();
}
function drawScene() {
    "use strict";
    canArena.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}
function drawItems() {
    "use strict";
    player.draw();
    enemies.draw();
}
function clearItems() {
    "use strict";
    player.clear();
    enemies.clear();
}

function clearScore() {
    conScore.clearRect(0,0,300,50);
}
function drawScore() {
    conScore.fillText("life : "+player.nbOfLives, 10, 25);
    conScore.fillText("score : "+player.projectileSet.score, 150,25);
}
function updateGame() {
    "use strict";
    updateScene();
    updateItems();
}
function clearGame() {
    "use strict";
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict";
    drawScene();
    drawScore();
    drawItems();
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
    enemies.init();

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    animFrame( recursiveAnim );

}

window.addEventListener("load", init, false);