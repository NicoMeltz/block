var roundRect = function (ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
  return this;
}

class Block {
 
  value = 2;
  y = 0;
  x = 0;
  selCol = 1;
  row = 0;
  blockWidth = 50;
  blockHeight = 30;
  level = 1;
  gep = 2;
  constructor(blockWidth,blockHeight, gep){
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight
    this.gep = gep;
  }
  setData(data){
    Object.assign(this, data);
  }
  toJson(){
    return JSON.stringify({
      value: this.value,
      y: this.y,
      x: this.x,
      selCol: this.selCol,
      row: this.row,
      blockWidth: this.blockWidth,
      blockHeight: this.blockHeight,
      level:  this.level,
      gep: this.gep
    })
  }
  fromJsonData(data){
    this.value = data.value;
    this.y = data.y;
    this.x = data.x;
    this.selCol = data.selCol;
    this.row = data.row;
    this.blockWidth = data.blockWidth;
    this.blockHeight = data.blockHeight;
    this.level =  data.level;
    this.gep = data.gep;
    this.setPosi(this.selCol, 10 - this.row)
  }
  setPosi(c, r){
    this.selCol = c ;
    var rows = 10;
    var row = rows - r;
    this.row = row;
    this.x = Block.calcX(this.gep, this.selCol, this.blockWidth);
    this.y = Block.calcY(this.gep, this.selCol, r, this.blockHeight, rows);
  }
  static calcY (gep, col, r, blockHeight, rows){
    //console.log(gep, col, r, blockHeight, rows);
    return (r * blockHeight ) - blockHeight + (rows * gep);
  }
  
  static calcX (gep, col, blockWidth){
    //console.log(gep, col, blockWidth);
    return (gep * (col)) +  (blockWidth * (col-1)) + 1;
  }
  draw(ctx){
   
    //console.log(this)
    var blockHeight = this.blockHeight - this.gep;
    ctx.save();
    ctx.fillStyle = 'green';
    roundRect(ctx, this.x, this.y, this.blockWidth-4,blockHeight, 4);
    //ctx.fillRect(x, y, this.blockWidth-4,this.blockHeight, 4)
   
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    roundRect(ctx, this.x, this.y, this.blockWidth-4,blockHeight, 4);
    ctx.stroke();
    ctx.restore();
 
    ctx.fillStyle = 'white';

    ctx.font = '24px sans-serif';
    //ctx.filter = 'blur(1px)';
    ctx.textAlign = 'center';
    ctx.fillText(this.value, this.x+(this.blockWidth /2) -3 , this.y+30,100);
    ctx.restore();
    
  }
}