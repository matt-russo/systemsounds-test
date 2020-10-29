var imWidth = 1080,
  imHeight = 810;
var cnv;
var imScale;
var cursorScale = .25;
var cursorObj, cursorAuto;

var nNotesO = 23; //number of notes for optical layer
var nNotesX = 15; //number of notes for xray layer

var minValue = 10; //pixels with value lower than this do not trigger sound
var pixNum = 0,lastPixNum = 0;

var mode='manual',xrayOn=true, optOn=true;
var notes = [],notesX =[];
var autox = 0,autoy = 0,autoTheta = 0,autoR = 0.5;
var speed = .005,maxSpeed = .16,minSpeed = 0.0006,speedSign = 1;

var touchIsDown = false;

function preload() {
  img = loadImage("./images/comp500c.jpg");
  img2 = loadImage("./images/opt500c.jpg");
  img3 = loadImage("./images/xray500c.jpg");
  cursorImg = loadImage("./images/crosshairs2.png");
  soundFormats('mp3');

  for (i = 0; i < nNotesO; i++) {
      note = loadSound('./sounds/crystalBowl/' + (i + 1) + '.mp3');
      notes.push(note);
    }

  for (i = 0; i < nNotesX; i++) {
      noteX = loadSound('./sounds/wineGlass/' + (i + 1) + '.mp3');
      notesX.push(noteX);
    }
}


function setup() {
  frameRate(30);
  cnv = createCanvas(imWidth, imHeight);
  cnv.parent('canvas');
  cnv.id('cursorcanvas');

  background(0);
  img.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  image(img, 0, 0);

  cursorObj = new cursorIm(0, 0);
  cursorAuto = new autoCursor(0, 0);
}


function draw() {
  background(0);
  cnv.size(windowWidth, windowHeight);
  imScale =  imWidth / windowWidth;
  // cnv.size(1080, 1080);
  // imScale = imWidth / 1080; //  imWidth / windowWidth

  // document.getElementById('buttonbar').setAttribute("style", "width:100%");
  // document.getElementById('buttonbar').setAttribute("style", "width:1080"); //didn't work

  if (optOn==true && xrayOn==true) {
    image(img, 0, 0, imWidth / imScale, imHeight / imScale);
  }
  if (optOn==true && xrayOn==false) {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
  }
  if (optOn==false && xrayOn==true) {
    image(img3, 0, 0, imWidth / imScale, imHeight / imScale);
  }


  if (mode == 'manual') {
    if (mouseIsPressed || touchIsDown) {
      pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel

      if (pixNum != lastPixNum && optOn){
        pixValue2 = (img2.pixels[pixNum] + img2.pixels[pixNum + 1] + img2.pixels[pixNum + 2]) / 3.;
        pixValue2 = Math.pow(pixValue2 / 256, 1.5) * 256; //scale brightness
      }
      if (pixNum != lastPixNum && xrayOn) {
        pixValue3 = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
        pixValue3 = Math.pow(pixValue3 / 150, 1.5) * 256; //scale brightness
      }

      playNotes();
      lastPixNum = pixNum;

      cursorObj.update(mouseX, mouseY);
      cursorObj.show();
    }
  }

  if (mode == 'automatic') {
    //oval orbit
    autoTheta += speed/autoR;
    autox = 0.5*imWidth/imScale*(1 + autoR*Math.cos(autoTheta));
    autoy = 0.5*imHeight/imScale*(1 + autoR*Math.sin(autoTheta));

    pixNum = Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth;
    pixNum = Math.round(4 * pixNum); //labels pixel

    if (pixNum != lastPixNum && optOn){
      pixValue2 = (img2.pixels[pixNum] + img2.pixels[pixNum + 1] + img2.pixels[pixNum + 2]) / 3.;
      pixValue2 = Math.pow(pixValue2 / 256, 1.5) * 256; //scale brightness
    }
    if (pixNum != lastPixNum && xrayOn) {
      pixValue3 = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
      pixValue3 = Math.pow(pixValue3 / 150, 1.5) * 256; //scale brightness
    }

    playNotes();
    lastPixNum = pixNum;

    cursorAuto.update(autox, autoy);
    cursorAuto.show();
  }
}


function touchStarted() {
  if (mode == "automatic") {

    if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
      autox = mouseX;
      autoy = mouseY;
      dx = mouseX * imScale/imWidth - 0.5;
      dy = mouseY * imScale/imHeight - 0.5;
      autoTheta = Math.atan2(dy,dx);
      autoR = 2*Math.sqrt(dx*dx+dy*dy);
    }
  }
  touchIsDown = true;
}

function touchEnded() {
  touchIsDown = false;
}

function mousePressed() {
  if (radius(mouseX,mouseY)<.45) { //to avoid buttons, is there a better way?
    autox = mouseX;
    autoy = mouseY;

    dx = mouseX * imScale/imWidth - 0.5;
    dy = mouseY * imScale/imHeight - 0.5;
    autoTheta = Math.atan2(dy,dx);
    autoR = 2*Math.sqrt(dx*dx+dy*dy);
  }
}

function playNotes() {
  if (pixValue2>minValue && optOn) {
      i = Math.round(map(pixValue2 - minValue, 0, 256-minValue, 0, nNotesO-1));
      // console.log(pixValue,i);
      notes[i].play();
    }
    if (pixValue3>minValue && xrayOn){
      i = Math.round(map(pixValue3 - minValue, 0, 256-minValue, 0, nNotesX-1));
      // console.log(pixValue,i);
      notesX[i].play();
    }

}

// function checkBounce() {
//   if (autox >= imWidth / imScale || autox < 0) {
//     speedSign *= -1;
//     autoy += ySpeedSign*yJump;
//   }
//   if (autoy >= imHeight / imScale || autoy < 0) {
//     ySpeedSign *= -1
//     autoy += ySpeedSign*yJump;
//   }
// }


function faster() {
  speed *= 2.;
  speed = Math.min(speed, maxSpeed);
}

function slower() {
  speed *= 0.5;
  speed = Math.max(speed, minSpeed);
}


function toggleMode() {
  if (mode=='automatic'){
    makeManual();
  } else {
    makeAutomatic();
  }
}


function makeAutomatic() {
  mode = 'automatic';
  autoR = 0.5;
  document.getElementById('leftArrow').classList.remove("hidden");
  document.getElementById('rightArrow').classList.remove("hidden");
}

function makeManual() {
  mode = 'manual';
  document.getElementById('leftArrow').classList.add("hidden");
  document.getElementById('rightArrow').classList.add("hidden");
}

function makeOpt() {
  if (optOn==false) {
    optOn=true;
    document.getElementById('optOff_button').classList.add("hidden");
    document.getElementById('opt_button').classList.remove("hidden");
  }
  else {
    optOn=false;
    document.getElementById('opt_button').classList.add("hidden");
    document.getElementById('optOff_button').classList.remove("hidden");
  }
}

function makeXray() {
  if (xrayOn==false) {
    xrayOn=true;
    document.getElementById('xrayOff_button').classList.add("hidden");
    document.getElementById('xray_button').classList.remove("hidden");
  }
  else {
    xrayOn=false;
    document.getElementById('xray_button').classList.add("hidden");
    document.getElementById('xrayOff_button').classList.remove("hidden");
  }
}

function autoCursor(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = autox;
    this.y = autoy;
  }

  this.show = function() {
    image(cursorImg, this.x - cursorScale * cursorImg.width * 0.5, this.y - cursorScale * cursorImg.height * 0.5, cursorScale * cursorImg.width, cursorScale * cursorImg.height);

  }
}

function cursorIm(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = mouseX;
    this.y = mouseY;
  }

  this.show = function() {
    // var imScale = .4;
    image(cursorImg, this.x - cursorScale * cursorImg.width * 0.5, this.y - cursorScale * cursorImg.height * 0.5, cursorScale * cursorImg.width, cursorScale * cursorImg.height);

  }
}

function radius(x,y) {
  dx = Math.round(x * imScale)/imWidth - 0.5;
  dy = Math.round(y * imScale)/imHeight - 0.5;
  return Math.sqrt(dx*dx+dy*dy)
}
// window.onload = function(){
// $(".button").click(function(e) {
//     e.stopPropagation();
//     alert('child');
//     console.log('Stopped');
// });}
window.onload = function(){
  document.getElementById('opt_button').addEventListener("click",
  function(){
    console.log('Stopped');
  },
  true);
};
