class Entity {
  constructor(pos) {
    this.pos = pos;
    this.speed = 10;
    this.dir = {x:0,y:0}
  }

  move(v) {
    this.pos.x += v.x * this.speed || 0;
    this.pos.y += v.y * this.speed || 0;
  }

  update() {
    this.move(this.dir)
  }

  draw(ctx, dt) {
    throw new Error("function draw need implementation in "+this.constructor.name);
  }

  get loaded(){
    return true
  }
}

class Sprite extends Entity{
  constructor(pos,src,divide){
    super(pos);
    this.animCounter = 0;
    this.animNumber = 0;
    this.animPlaying = true;
    this.animNbFrame = divide.x;
    this.nbAnimations = divide.y;
    this.dest = null;
    this.image = new Image();
    this.image.src = src;
    this.image.loaded = false;
    this.width = -1;
    this.height = -1;
    let sprite = this;
    this.image.onload = function () {
      sprite.width = this.width/sprite.animNbFrame;
      sprite.height = this.height/sprite.nbAnimations;
      this.loaded = true;
    };
  }

  draw(ctx, dt) {
    ctx.drawImage(
        this.image,
        Math.floor(this.animCounter) * this.width ,
        this.animNumber * this.height,
        this.width,
        this.height,
        this.pos.x,
        this.pos.y,
        this.width,
        this.height);
  }

  update() {
    super.update();
    if(this.dest !== null){
      if     (this.pos.x < this.dest.x)
        this.dir = {x:1, y:0};
      else if(this.pos.x > this.dest.x+this.width)
        this.dir = {x:-1, y:0};
      else if(this.pos.y < this.dest.y)
        this.dir = {x:0, y:1};
      else if(this.pos.y > this.dest.y+this.height)
        this.dir = {x:0, y:-1};
      else{
        console.log("arrived to dest"+JSON.stringify(this.dest));
        this.dir = {x:0, y:0};
        this.dest=null;
      }
    }
    if(this.animPlaying){
      this.animCounter = (this.animCounter+0.1)%this.animNbFrame;
    }
  }

  get loaded(){
    return this.image.loaded;
  }

  changeDir(dir){
    console.log(dir);
    this.animPlaying = true;
    if(dir.x > 0)
      this.animNumber = 1;
    else if(dir.x < 0)
      this.animNumber = 0;
    else if(dir.y < 0)
      this.animNumber = 3;
    else if(dir.y > 0)
      this.animNumber = 2;
    else
      this.animPlaying = false;
    this.dir=dir;
  }

  goto(dest) {
    this.dest = dest;
  }
}

class Square extends Entity{
  constructor(pos){
    super(pos);
    this.color="red"

  }
  draw(ctx, dt) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.pos.x, this.pos.y, 10, 10)
  }
}
