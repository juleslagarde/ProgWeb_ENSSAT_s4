
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


function randomFallingPiece(){
    let p = new Piece(0,0, "#"+Math.floor(Math.random()*1000000),Math.floor(Math.random()*5));
    p.falling=true;
    p.pos.x=Math.random()*(GameWidth-p.width);
    return p;
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
            let collide = this.pattern.collide(p.pattern, {x:p.pos.x-this.pos.x, y:p.pos.y-this.pos.y})
            if(collide!==null)return collide;
        }
        return null;
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
    moveAndCollide(dx, dy, pieces){
        this.pos.x+=dx;
        if(this.pos.x>GameWidth-this.width) this.pos.x = GameWidth - this.width;
        else if(this.pos.x<0) this.pos.x=0;
        let diff = this.collide(pieces);
        if(diff !== null){
                 if(dx > 0) this.pos.x -= diff.right;
            else if(dx < 0) this.pos.x -= diff.left;
            else throw Error("error : dx == 0 (dx:"+dx+", dy:"+dy+")");
        }
        this.pos.y+=dy;
        if(fallingPiece.pos.y + fallingPiece.height > GameHeight) {
            this.pos.y=GameHeight-fallingPiece.height;
            this.falling=false;
        }
        diff = this.collide(pieces);
        if(diff !== null){
            if(dy > 0){
                this.pos.y -= diff.bottom;
                this.falling=false;
            }
            else throw Error("error : dy < 0 (dx:"+dx+", dy:"+dy+")");
        }
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
        this.squares=[];
        this.width=tab[0].length;
        this.height=tab.length;

        for(let x=0; x<this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // noinspection EqualityComparisonWithCoercionJS
                if (tab[y][x] == '*')
                    this.squares.push({x:x,y:y});
            }
        }
    }
    //rotate 90 degree
    rotate() {
        for(let s of this.squares){
            let tmp = s.x;
            s.x=this.width-1-s.y;
            s.y=tmp;
        }
        //search min (the piece need to be in the top left corner of it's own grid)
        let min = {x:this.squares[0].x, y:this.squares[0].y};
        for(let s of this.squares) {
            if(min.x>s.x) min.x=s.x;
            if(min.y>s.y) min.y=s.y;
        }
        //apply diff
        for(let s of this.squares){
            s.x-=min.x;
            s.y-=min.y;
        }

        let tmp =this.width;
        this.width=this.height;
        this.height=tmp;
    }
    collide(p, off){
        for(let s1 of this.squares){
            for(let s2 of p.squares) {
                let r1x = s1.x*SQUARE_SIZE;
                let r1y = s1.y*SQUARE_SIZE;
                let r2x = s2.x*SQUARE_SIZE+off.x;
                let r2y = s2.y*SQUARE_SIZE+off.y;
                if (r1x + SQUARE_SIZE > r2x &&       // r1 right edge past r2 left
                    r1x < r2x + SQUARE_SIZE &&       // r1 left edge past r2 right
                    r1y + SQUARE_SIZE > r2y &&       // r1 bottom edge past r2 top
                    r1y < r2y + SQUARE_SIZE) {
                    //if() todo return correct diff
                    return {
                        right   : r1x + SQUARE_SIZE - r2x,
                        left    : r1x - r2x - SQUARE_SIZE,
                        bottom     : r1y + SQUARE_SIZE - r2y,
                        top  : r1y - r2y - SQUARE_SIZE
                    };
                }
            }
        }
        return null;
    }

    drawAt(ctx,pos, padding){
        for(let s of this.squares){
            ctx.fillRect(pos.x+s.x*SQUARE_SIZE, pos.y+s.y*SQUARE_SIZE+padding, SQUARE_SIZE, SQUARE_SIZE-padding )
            //ctx.fillRect(pos.x+x*SQUARE_SIZE+padding, pos.y+y*SQUARE_SIZE+padding, SQUARE_SIZE-padding*2, SQUARE_SIZE-padding*2 )
        }
    }

    clearAt(ctx, pos) {
        for(let s of this.squares){
            ctx.clearRect(pos.x+s.x*SQUARE_SIZE, pos.y+s.y*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE )
        }
    }

    get pivot(){
        return {x:this.width/2*SQUARE_SIZE,y:this.height/2*SQUARE_SIZE};
    }
}

function removeCompleteLines(pieces) {
    let nb = [];//number of square by line
    //init
    for(let i=0; i<NB_LINE_MAX; i++) nb.push(0);

    //count number of square by line
    for(let p of pieces){
        for(let s of p.pattern.squares){
            let lineNumber = Math.floor((GameHeight-p.pos.y)/SQUARE_SIZE)-(s.y+1);
            nb[lineNumber]+=1;
        }
    }
    console.log(nb);

    //removing line
    for(let p of pieces) {
        let squares = p.pattern.squares;
        for (let i=0; i<squares.length;) {
            let lineNumber = Math.floor((GameHeight-p.pos.y)/SQUARE_SIZE)-(squares[i].y+1);
            if(nb[lineNumber] === 7){
                squares.splice(i,1);
            }else i++;
        }
    }

}