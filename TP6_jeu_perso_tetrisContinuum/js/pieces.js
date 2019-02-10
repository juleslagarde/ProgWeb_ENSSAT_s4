
patternList = [
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

class Piece{
    falling;
    constructor(x, y, color, num){
        this.pos = {x:x,y:y};
        this.pattern=new Pattern(this,patternList[num]);
        this.color=color;
    }
    draw(ctx){
        ctx.fillStyle=color;
        let size = this.falling?30:40;
        this.pattern.drawAt(ctx, pos, size)
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
        let ntab = [];
        for(let x=0; x<this.width; x++){
            ntab.push("");
            for(let y=0; y<this.height; y++)
                ntab[x]+=this.tab[y][x];
        }
    }
    drawAt(ctx,pos, size){
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                // noinspection EqualityComparisonWithCoercionJS
                if(this.tab[y][x]=='*')
                    ctx.fillRect(pos.x+x, pos.y+y, size, size)
            }
        }
    }
}