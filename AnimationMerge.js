
class AnimationMerge extends Animation {

  block = null;
  toMerge = null;
  callback = () =>{};
  constructor(type, block, toMerge, callback){
    super();
    this.type = type;
    this.callback = callback;
    this.block = block;
    this.toMerge = toMerge;
  }
  run(){
    var diffY = 0;
    var diffX = 0;
   
    diffY = this.toMerge.y - this.block.y;
    diffX = this.toMerge.x - this.block.x;
   
    
    //console.log('toMerge', this.toMerge.selCol, this.toMerge.row ,diffX, diffY);
    if( diffX != 0 ){
      if(this.type === 'left') {
        this.toMerge.x = this.toMerge.x +1;
      } else {
        this.toMerge.x = this.toMerge.x -1;
      }
    }
   
    if( diffY != 0){
      if(this.type === 'top'){
        this.toMerge.y =this.toMerge.y+ 1;
      } else {
        this.toMerge.y =this.toMerge.y- 1;
      }
      
    }
    if( diffY == 0 && diffX == 0){
      console.log('merge done')
      this.callback(this.toMerge);
      this.isDone = true;
    }

  }
  isDone = false 
}