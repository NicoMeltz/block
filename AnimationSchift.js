

class AnimationSchift extends Animation {
  toMerge = null;
  callback = () =>{};
  constructor(toCol,toRow, block, callback){
    super();
    this.toCol = toCol;
    this.toRow = toRow;
    //console.log('asda',block);
    this.toMerge = { 
      y: Block.calcY(block.gep, toCol, toRow , block.blockHeight, 10) , 
      x: Block.calcX(block.gep, toCol, block.blockWidth)
    };
    this.callback = callback;
    this.block = block; 
  }
  run(){
    //console.log('toMerge', this.toMerge.selCol, this.toMerge.row ,diffX, diffY);
    const diffY = this.toMerge.y - this.block.y;
    const diffX = this.toMerge.x - this.block.x;
    if( diffX != 0 ){
      if(diffX > 0) {
        this.block.x = this.block.x +1;
      } else {
        this.block.x = this.block.x -1;
      }
    }
   
    if( diffY != 0){
      if(diffY > 0){
        this.block.y = this.block.y+ 1;
      } else {
        this.block.y = this.block.y- 1;
      }
      
    }
    if( diffY == 0 && diffX == 0){
      //console.log('shift done')
      this.callback(this.toMerge);
      this.isDone = true;
    }

  }
  isDone = false 
}