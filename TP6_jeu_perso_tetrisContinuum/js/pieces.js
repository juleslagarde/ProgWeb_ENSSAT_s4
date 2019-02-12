
let patternList = [
    [
        " * ",
        "***"],
    [
        "*  ",
        "***"],
    [
        "  *",
        "***"],
    [
        "****"],
    [
        "**",
        "**"]
];
let SQUARE_SIZE=40;


function randomFallingPiece(){
    let fallingPiece = new Piece(Math.random()*100+25,0, "#"+Math.floor(Math.random()*1000000),Math.floor(Math.random()*5));
    fallingPiece.falling=true;
    return fallingPiece;
}

class Piece{
    constructor(x, y, color, num){
        this.pos = {x:x,y:y};
        this.pattern=new Pattern(this,patternList[num]);
        this.color=color;
        this.falling=false;
    }
    draw(ctx){
        ctx.fillStyle=this.color;
        let padding = this.falling?5:0;
        this.pattern.drawAt(ctx, this.pos, padding);
    }
    clear(ctx){
        this.pattern.clearAt(ctx, this.pos);
    }
    collide(pieces){
        for(let p of pieces){
            if(!(p instanceof Piece))throw Error("collide only with pieces");
            p.pattern.collide(this.pattern, {x:this.pos.x-p.pos.x, y:this.pos.y-p.pos.y})
        }
    }
    rotate(){
        let oP = this.pattern.pivot;
        this.pattern.rotate();
        let nP = this.pattern.pivot;
        this.pos = {x:this.pos.x-nP.x+oP.x,y:this.pos.y-nP.y+oP.y}
    }
    rotateBack(){
        let oP = this.pattern.pivot;
        for(let i=0; i<3;i++) this.pattern.rotate();//rotate 3 times
        let nP = this.pattern.pivot;
        this.pos = {x:this.pos.x-nP.x+oP.x,y:this.pos.y-nP.y+oP.y}
    }
    get width(){
        return this.pattern.width*SQUARE_SIZE;
    }
    get height(){
        return this.pattern.height*SQUARE_SIZE;
    }
}

class Pattern{
    constructor(piece, tab) {
        this.piece=piece;
        this.tab=tab;
        this.width=tab[0].length;
        this.height=tab.length;
    }
    //rotate 90 degree
    rotate() {
        //transpose
        let ntab = [];
        for(let x=0; x<this.width; x++){
            ntab.push("");
            for(let y=0; y<this.height; y++)
                ntab[x]+=this.tab[y][x];
        }
        let tmp =this.width;
        this.width=this.height;
        this.height=tmp;
        //inverse colonnes
        for(let y=0; y<this.height; y++)
            ntab[y]=ntab[y].split("").reverse().join("");
        this.tab=ntab;
    }
    collide(p, off){
        for(let i=0)
    }

    drawAt(ctx,pos, padding){
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                // noinspection EqualityComparisonWithCoercionJS
                if(this.tab[y][x]=='*')
                    ctx.fillRect(pos.x+x*SQUARE_SIZE, pos.y+y*SQUARE_SIZE+padding, SQUARE_SIZE, SQUARE_SIZE-padding )
                    //ctx.fillRect(pos.x+x*SQUARE_SIZE+padding, pos.y+y*SQUARE_SIZE+padding, SQUARE_SIZE-padding*2, SQUARE_SIZE-padding*2 )
            }
        }
    }

    clearAt(ctx, pos) {
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                // noinspection EqualityComparisonWithCoercionJS
                if(this.tab[y][x]=='*')
                    ctx.clearRect(pos.x+x*SQUARE_SIZE, pos.y+y*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
            }
        }
    }

    get pivot(){
        return {x:this.width/2*SQUARE_SIZE,y:this.height/2*SQUARE_SIZE};
    }
}