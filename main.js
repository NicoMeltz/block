let addBtn;
let deferredPrompt;

document.addEventListener('DOMContentLoaded', function () {


  cv = document.getElementById('cv');
  ctx = cv.getContext('2d');
  const app = new App();
  cv.addEventListener("mousedown", function (e) {
    currX = e.clientX - cv.offsetLeft;
    currY = e.clientY - cv.offsetTop;
   // console.log('xy: ' +currX,currY); 
    app.click(currX, currY);
  }, false);
  
  app.init(ctx);
  
  window.addEventListener('resize',() => {
      app.resize();
     // console.log('resize1');
  })

  app.onGameOver = () => {
    var div = document.getElementById('gameOver');
    div.classList.remove('hide');
    console.log('remove hide');
  }

  app.onLevelUp= () =>{
    var div = document.getElementById('level');
    div.innerText = app.level;
  }
  var newGAmeDiv = document.getElementById('newGame');
  newGAmeDiv.addEventListener("click", function (e) {
    var div = document.getElementById('gameOver');
    div.classList.add('hide');
    app.startNewGame();
    console.log('add hide');
  });


  addBtn = document.querySelector('.add-button');
  addBtn.style.display = 'none';
  cv.addEventListener('dblclick', function (e) {
     app.tapedTwice()
  });

  cv.addEventListener("touchstart", tapHandler);

  var tapedTwice = false;

  function tapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();
    //action on double tap goes below
    app.tapedTwice();
    
 }

  var pause = document.getElementById('pause');
  pause.addEventListener('click', function (e) {
    app.toggelRunning()
  });
/*
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => { console.log('Service Worker Registered'); });
  }
  */
})



window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});

