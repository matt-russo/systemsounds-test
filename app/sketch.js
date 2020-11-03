let imWidth = 1080,imHeight = 810;
var cnv;
var imScale;
let cursorScale = .25;
var cursorObj, cursorAuto;

let nNotesO = 15; //number of notes for optical layer
let nNotesX = 15; //number of notes for xray layer

let minValue = 10; //pixels with value lower than this do not trigger sound
var pixNum = 0,lastPixNum = 0;

var mode='manual',xrayOn=true, optOn=true;
var notes = [],notesX =[];
var autox = 0,autoy = 0,autoTheta = 0,autoR = 0.5;
var speed = .005,maxSpeed = .16,minSpeed = 0.0006,speedSign = 1;

var touchIsDown = false;
let yearStart=1999;
var yearNow=2012;  //starting year///
let nYears=15;
let framesPerYear=5; //do not change without updating images//
var frame   = Math.floor(framesPerYear*(yearNow-yearStart)); //starting frame//
let nFrames = Math.floor(nYears*framesPerYear);
let framesPerSecond=2;
let frameTime=1000/framesPerSecond;
var compImgs=[],optImgs=[],xrayImgs=[];
var moviePlaying=false;

let optGain;
var optVolume=2   ;
let xrayGain;
var xrayVolume=5  ;
let maxXrayPix=160; //maximum pixel brightess in xray images, used to scale notes//

function preload() {
  // img1 = loadImage("./images/frames/comp"+frame+".jpg");
  // img2 = loadImage("./images/frames/opt"+frame+".jpg");
  // img3 = loadImage("./images/frames/xray"+frame+".jpg");

  for (i=0;i<nFrames;i++){
    compImgs.push(loadImage("./images/frames/comp"+i+".jpg"));
    optImgs.push(loadImage("./images/frames/opt"+i+".jpg"));
    xrayImgs.push(loadImage("./images/frames/xray"+i+".jpg"));
  }
  img1 = compImgs[frame]; //loadImage("./images/frames/comp"+frame+".jpg");
  img2 = optImgs[frame]; //loadImage("./images/frames/opt"+frame+".jpg");
  img3 = xrayImgs[frame]; //loadImage("./images/frames/xray"+frame+".jpg");

  cursorImg = loadImage("./images/crosshairs.png");
  soundFormats('mp3');
  optGain = new p5.Gain(); // setup a gain node
  xrayGain = new p5.Gain(); // setup a gain node
  reverb = new p5.Reverb();

  for (i = 0; i < nNotesO; i++) {
      note = loadSound('./sounds/optical/' + (i + 1) + '.mp3');
      note.disconnect();
      reverb.process(note, 5, 2); //// 5 second reverbTime, decayRate of 2%
      // reverb.amp(1);
      optGain.setInput(note);
      notes.push(note);
    }

  for (i = 0; i < nNotesX; i++) {
      noteX = loadSound('./sounds/xray/' + (i + 1) + '.mp3');
      noteX.disconnect();
      reverb.process(noteX, 5, 2); //// 5 second reverbTime, decayRate of 2%

      xrayGain.setInput(noteX);
      notesX.push(noteX);
    }
    optGain.connect();
    optGain.amp(optVolume);
    xrayGain.connect();
    xrayGain.amp(xrayVolume);
}


function setup() {
  frameRate(20);
  cnv = createCanvas(imWidth, imHeight);
  cnv.parent('canvas');
  cnv.id('cursorcanvas');

  background(0);
  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  image(img1, 0, 0);

  cursorObj = new cursorIm(0, 0);
  cursorAuto = new autoCursor(0, 0);
  // sound1.disconnect();
  // sound1Gain = new p5.Gain(); // setup a gain node
  // sound1Gain.setInput(sound1);
  // sound1Gain.connect();
  yearNow = Math.floor(yearStart + frame/framesPerYear);
  document.getElementById('yearCounter').innerHTML = yearNow;

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
    image(img1, 0, 0, imWidth / imScale, imHeight / imScale);
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
      if (pixNum != lastPixNum) {
        if (optOn){
          pixValue2 = (img2.pixels[pixNum] + img2.pixels[pixNum + 1] + img2.pixels[pixNum + 2]) / 3.;
          pixValue2 = Math.pow(pixValue2 / 256, 1.5) * 256; //scale brightness
        }
        if (xrayOn) {
          pixValue3 = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
          pixValue3 = Math.pow(pixValue3 / maxXrayPix, 1.5) * 256; //scale brightness
        }

        playNotes();
        lastPixNum = pixNum;
      }


      cursorObj.update(mouseX, mouseY);
      cursorObj.show();
    }
  }

  if (mode == 'automatic') {
    //oval orbit
    autoTheta += speed/autoR;
    autox = 0.5*imWidth/imScale*(1 + autoR*Math.cos(autoTheta));
    autoy = 0.5*imHeight/imScale*(1 + autoR*Math.sin(autoTheta));

    pixNum = 4*(Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth);
    // pixNum = Math.round(4 * pixNum); //labels pixel

    if (pixNum != lastPixNum) {
      if (optOn){
        pixValue2 = (img2.pixels[pixNum] + img2.pixels[pixNum + 1] + img2.pixels[pixNum + 2]) / 3.;
        pixValue2 = Math.pow(pixValue2 / 256, 1.5) * 256; //scale brightness
      }
      if (xrayOn) {
        pixValue3 = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
        pixValue3 = Math.pow(pixValue3 / 160, 1.5) * 256; //scale brightness
      }

      playNotes();
      lastPixNum = pixNum;
    }

    cursorAuto.update(autox, autoy);
    cursorAuto.show();
  }
}

//////////////////////////////////////////////////////////////////

var playButton = document.getElementById('control');
window.setTimeout(()=>{
  window.setInterval(nextFrame, frameTime);
}, frameTime);

function nextFrame(){
  if (moviePlaying){
    frame+=1;
    if (frame>=nFrames){
      frame=0;
    }
    yearNow = Math.floor(yearStart + frame/framesPerYear);
    document.getElementById('yearCounter').innerHTML = yearNow;
    img1 = compImgs[frame];
    img2 = optImgs[frame];
    img3 = xrayImgs[frame];
    img1.loadPixels();
    img2.loadPixels();
    img3.loadPixels();
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
function pauseVideo(){
  moviePlaying=!moviePlaying;
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
    // document.getElementById("checkbox").checked = true;
  } else {
    makeAutomatic();
    // document.getElementById("checkbox").checked = false;

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
    if  (xrayOn==false){
      document.getElementById('backgroundText').style.color = '#ddd';
    }
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
    if  (optOn==false){
      document.getElementById('backgroundText').style.color = '#ddd';
    }
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
// window.onload = function(){
//   document.getElementById('opt_button').addEventListener("click",
//   function(){
//     console.log('Stopped');
//   },
//   true);
// };
