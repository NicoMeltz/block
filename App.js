


class App {

  constructor(){
    const saveGame = JSON.parse( localStorage.getItem('data'));
    
    if(false && saveGame){ 
        Object.assign(this, saveGame);

        for(var r = 0 ; this.columns.length> r ;r++){
            for(var key in this.columns[r].blocks){
              //console.log('draw', key);
              if(this.columns[r].blocks[key]){
                const newB = new Block()
                newB.setData(this.columns[r].blocks[key]);
                this.columns[r].blocks[key] = newB;
              }
            }
          }
        this.newBlock();
        /*if(!this.runningBlock){
          this.newBlock();
        } else {
          const newB = new Block()
          newB.setData(this.runningBlock);
          this.runningBlock = newB;
          this.saveGameloaded = true;
          this.runningBlock.y= 0;
        }*/
    }
  }
  saveGameloaded  = false;
  ctx= null;
  h = 0;
  w = 0;
  columns=[];
  firstTime= true;
  cols = 5;
  currentCol = 1;
  rows = 10;
  gep = 2;
  blockWidth = 0;
  blockHeight = 30;
  mapBlock=[];
  level=2;
  randomBlocks = [];
  speed=0.12;
  startSpeed = 0.12;
  lastLevelBlock = 2;
  running = false;
  foundMerge = false;
  animations=[];
  elapsed = 0;
  now = 0;
  mergeCount = 0; 
  maxMergeCount = 0;
  score = 0;
  bestScore = 0;
  onGameOver = ()=> {};
  onLevelUp = ()=> {};
  onMergeCount = () => {};
  tapedTwice(){
    this.speed=0.5;
  }
 
  exportToLocalStore(){

    localStorage.setItem('data', JSON.stringify(this));
  }
 
  gameOver(){
  
    if( this.score > parseInt(localStorage.getItem('bestScore') )) {
     
      this.bestScore = this.score;
      localStorage.setItem('bestScore', this.score);
    }
    // localStorage.setItem('score', this.score);
    localStorage.setItem('data', JSON.stringify({gameOver:1}));
    //console.log('localStorage.setItem')
    this.toggelRunning();
    this.onGameOver();
    console.log('gameOver')
  }

  levelUp(value) {
      this.maxMergeCount ++;
 
      console.log('cal',this.maxMergeCount, this.level*5);
      if(this.maxMergeCount  > this.level*5 ) {
        this.level = this.level + 1;
        //console.log(this.level);
        this.lastLevelBlock = value;
        if(this.lastLevelBlock <= 1024){
          this.makeLevelBlocks();
        }
        this.onLevelUp();
      }
  }

  toggelRunning(){
    this.running = !this.running;
    //console.log('this.running', this.running);
    if(this.running){
      // console.log('requestAnimationFrame')
     
      window.requestAnimationFrame((t) =>{   this.then = t; this.gameLoop(t)});
    } else {
      this.exportToLocalStore()
    }
  }

  resize(){
    this.blockWidth = (this.ctx.canvas.width / this.cols)-this.gep;
    this.blockHeight = (this.ctx.canvas.height / this.rows)-this.gep;
    this.h = this.ctx.canvas.height;
    this.w = this.ctx.canvas.width;
    //console.log('resize');
  }

  randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  init(ctx){
    this.ctx = ctx;

    this.resize();
    window.requestAnimationFrame((t)=>{this.gameLoop(t)});

    this.grdBg1 = ctx.createLinearGradient(0, 0, 0, this.h);
    this.grdBg1.addColorStop(0, "#f5f5f5");
    this.grdBg1.addColorStop(1, '#000');
    
    this.grdBg2 = ctx.createLinearGradient(0, 0, 0, this.h);
    this.grdBg2.addColorStop(0, "#f0f0f0");
    this.grdBg2.addColorStop(1, '#000');
    //console.log(this.randomBlocks);
  
    this.startNewGame()
      if(!localStorage.hasOwnProperty('bestScore')){
      localStorage.setItem('bestScore', 0);
    }else{
      this.bestScore = parseInt(localStorage.getItem('bestScore'));
    }
  }
  
  makeLevelBlocks(){
    var value = 2;
    this.mapBlock = [];
    
    for(var i=1; i <= this.level ; i++){
      this.mapBlock[i-1] = 
      { value: Math.pow(value, i), ch: this.level-i+1 };
    }
    console.log(this.mapBlock);
    this.randomBlocks=[];
    for(var i=0; i < this.level ; i++){
      for(var k=0; k < this.mapBlock[i].ch ; k++){
        this.randomBlocks.push(this.mapBlock[i].value)
      }
    }
  }
  
  startNewGame(){
    if(!this.saveGameloaded ){
      this.saveGameloaded = false;
      this.level=1;
      this.lastLevelBlock = 2;
      this.score= 0;
      this.maxMergeCount = 0
      this.mergeCount = 0
      this.makeLevelBlocks();
      this.firstTime = true
      this.newBlock();
    }
    this.toggelRunning();
  }
  
  newBlock(){
    var b = new Block(this.blockWidth,this.blockHeight, this.gep);
    b.value = this.randomBlocks[this.randomInt(0, this.randomBlocks.length-1)];
    b.setPosi(this.currentCol, 0);
    this.runningBlock = b;
  }

  canChangeCol (toCol){
    if(!this.runningBlock){
      return;
    }
    var hs =this.columns[toCol-1].blocks.filter(a => !!a).map(a=> a.y);
    var min = Math.min.apply(null, hs);
    if(min > 0 && this.runningBlock.y + this.blockHeight > min){
      return false
    }
    return true;
  }

  click(x, y){
    var found = 0;    
    for(var i = 0; i < this.cols; i++ ){
      if(this.columns[i].widthx >= x){
        found = i;
        break;
      }
    }
    if(found == 0){
      found = 5;
    }
    if(this.canChangeCol(found)){
      this.currentCol = found;
      if(this.runningBlock){
        this.runningBlock.selCol = this.currentCol;
        this.runningBlock.x = (this.gep * (this.currentCol)) +  (this.blockWidth * (this.currentCol-1))+ 1;
      }
    }
  }

  drwcols(ctx) {
    ctx.save();
    for(var x = 0; x < this.cols; x++ ){
      var gep = (this.gep * x)+1;
     
      if(x % 2 == 0 ){
        //console.log( 'grdBg1');
        ctx.fillStyle ='#57575e';

        ctx.fillRect( x * this.blockWidth+gep,0, this.blockWidth , this.h);
      } else {
        //console.log( 'grdBg2');
        ctx.fillStyle = '#48484d'
        ctx.fillRect( x * this.blockWidth+gep,0, this.blockWidth , this.h);
      }

      if(this.firstTime){
        this.columns[x] = { widthx : x * this.blockWidth+gep, blocks:[]};
      }
      ctx.restore();
    }
    this.firstTime = false;
  }

  checkIfHit() {
      if(!this.runningBlock){
        return;
      }
      var col = this.runningBlock.selCol;
   
   
      for(var key in this.columns[col-1].blocks){
        var b = this.columns[col-1].blocks[key];
        if(!b){
          continue;
        }
        if(b.y < this.runningBlock.y + ( this.runningBlock.blockHeight )){
          return true;
        }
      }
      if(this.runningBlock.y > this.h - ( this.runningBlock.blockHeight )){
        return true;
      }
      return false;
  }
  
  getValue(col, row) {
    if(this.columns[col-1] && this.columns[col-1].blocks && this.columns[col-1].blocks[row]){
      return this.columns[col-1].blocks[row];
    }
  }
  
  doAnimations(){
    for(var i=this.animations.length-1; 0 <= i; i--){
      this.animations[i].run();
      if(this.animations[i].isDone){
        this.animations.splice(i,1);
      }
    }
  }

  mergeBlocks(){
  
    for(var r = 0 ; this.columns.length> r ;r++){
      for(var key in this.columns[r].blocks){
        //console.log('draw', key);
        if(this.columns[r].blocks[key]){
          this.foundMerge = false;
          if(this.mergeBlock(this.columns[r].blocks[key])){
            //console.log('mergeBlock found')
            return true;
          }
        }
      }
    }
    return false;
  }

  shiftBlocks(callback){
    // 0 ist unten
    //console.log('shiftBlocks');
    for(var c = 0 ; this.columns.length> c;c++){
      for(var key of [0,1,2,3,4,5,6,7,8,9]){
        //console.log('draw', key);
        if(!this.columns[c].blocks[key]){
          if(this.columns[c].blocks[key+1]){
            this.animations.push(new AnimationSchift(c+1, 10-key,  this.columns[c].blocks[key+1], ()=> {
              //console.log('shiftBlocks AnimationSchift');
              this.columns[c].blocks[key] = this.columns[c].blocks[key+1];
              this.columns[c].blocks[key+1] = null;
              this.columns[c].blocks[key].setPosi(c+1, 10-key)
              this.shiftBlocks(callback);
            }))
            return;
           
          }
        }
      }
    }
    //console.log('shift done');
    callback();
  }

  mergeBlock(lastBlock) {
    //console.log('find merge Block');
    this.runningBlock = null;
  
    var delfunction = (delBlock) => {
        //console.log('done');
        lastBlock.value = lastBlock.value * 2;
        this.mergeCount++;
        this.onMergeCount(this.mergeCount);
        if(lastBlock.value > this.lastLevelBlock){
          
          this.levelUp(lastBlock.value);

        }
        this.score = this.level * this.mergeCount;
        //console.log('removeBlock');
        this.columns[delBlock.selCol-1].blocks[delBlock.row] = null;
        //console.log('shiftBlocks');
        this.shiftBlocks(()=>{
          if(!this.mergeBlocks()){
            this.foundMerge = false;
          }

        });
    }
   
    //check bottom
    var blockB = this.getValue(lastBlock.selCol, lastBlock.row-1);
    if(!this.foundMerge && blockB && lastBlock.value == blockB.value) {
      this.animations.push(new AnimationMerge('bottom', lastBlock, blockB  , delfunction ));
      this.foundMerge = true;
      //console.log('find bottom');
    }

    //check left
    var blockL = this.getValue(lastBlock.selCol - 1, lastBlock.row);
    if(!this.foundMerge && blockL && lastBlock.value == blockL.value) {
      this.animations.push(new AnimationMerge('left', lastBlock, blockL, delfunction));
      this.foundMerge = true;
      //console.log('find left');
    }

    //check top
    var blockT = this.getValue(lastBlock.selCol, lastBlock.row+1);
    if(!this.foundMerge && blockT && lastBlock.value == blockT.value) {
      this.animations.push(new AnimationMerge('top',lastBlock, blockT, delfunction ));
      this.foundMerge = true;
       //console.log('find top');
    }

    //check right
    var blockr = this.getValue(lastBlock.selCol + 1, lastBlock.row);
    if(!this.foundMerge && blockr && lastBlock.value == blockr.value) {
      this.animations.push(new AnimationMerge('right',lastBlock, blockr,delfunction ));
      this.foundMerge = true;
      //console.log('find right');
    }
    //schift all ohers blocks
    if(!this.foundMerge){   
      this.newBlock();
    }
    return this.foundMerge;
  }

  gameLoop(time) {
   
    this.now = time;
    this.elapsed = this.now - this.then;
    this.then = time;
    //console.log(this.elapsed);
    this.y++;
    this.ctx.restore();
    this.ctx.clearRect(0, 0, cv.width, cv.height);
    this.ctx.save();
    
    this.drwcols(ctx);
     if(this.runningBlock){
       // check if hit
      if(this.runningBlock.y < 0){
        this.runningBlock.y= 0;
      }
      if(!this.checkIfHit()){
          var s = this.runningBlock.y + ( this.elapsed * this.speed);
          //console.log(s);
          if(!isNaN(s)){
            this.runningBlock.y = s;
          }
          //this.runningBlock.y = this.runningBlock.y + ( (this.elapsed/10) * this.speed);
          
      } else {
          this.speed = this.startSpeed;
          if(this.columns[this.runningBlock.selCol-1].blocks.filter((a)=>!!a).length >=10 ){
            if(this.running){
              this.gameOver();
            }
          }
          // place block
          var r =  Math.ceil(this.runningBlock.y/ this.runningBlock.blockHeight);
          var row = this.rows - r;
          this.columns[this.runningBlock.selCol-1].blocks[row] = this.runningBlock;
      
 
          this.runningBlock.setPosi(this.runningBlock.selCol,  r);
          this.mergeBlock(this.runningBlock);
          
          //console.log(this.columns[0].blocks);
      }
      if(this.runningBlock){
        this.runningBlock.draw(ctx);
      }
    }
   
    for(var r = 0 ; this.columns.length> r ;r++){
      for(var key in this.columns[r].blocks){
        //console.log('draw', key);
        if(this.columns[r].blocks[key]){
          this.columns[r].blocks[key].draw(ctx);
        }
      }
    }

    this.doAnimations()
    if(this.running){
      window.requestAnimationFrame((t)=>{this.gameLoop(t)});
    }
  }
  
}