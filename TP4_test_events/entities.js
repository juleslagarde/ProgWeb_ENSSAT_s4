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

  draw(ctx) {
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
    this.animPlaying = false;
    this.image = new Image();
    this.image.src = src;
    this.image.loaded = false;
    this.image.onload = function () {
      this.loaded=true;
    };
    this.width = this.image.width/divide.x;
    this.height= this.image.height/divide.y;
  }

  draw(ctx) {
    ctx.drawImage(
        this.image,
        this.animCounter * this.width ,
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
    if(this.animPlaying){
      this.animCounter++;
    }
  }

  get loaded(){
    return this.image.loaded;
  }

  set speed(speed){
    this.animPlaying = true;
    if(speed.x > 1)
      this.animNumber = 1;
    else if(speed.x < 1)
      this.animNumber = 0;
    else if(speed.y < 1)
      this.animNumber = 3;
    else if(speed.y > 1)
      this.animNumber = 2;
    else
      this.animPlaying = false;
  }
}

class Square extends Entity{
  constructor(pos){
    super(pos);
    this.color="red"

  }
  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.pos.x, this.pos.y, 10, 10)
  }
}
