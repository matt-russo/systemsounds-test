var imWidth = 1080,
  imHeight = 810;
var cnv;
var imScale;
var cursorScale = .3;

var nNotes = 23; //saturn had 15
var minValue = 10;
var step = (256. - minValue) / nNotes;
var pixNum = 0,pixNum0 = 0,lastPixNum = 0,lastPixNum0 = 0;

var mode, wavelength;
var notes = [];

var autox = 0,autoy = 0,autoTheta = 0,autoR = 0.5;

var speed = .005, scanSpeed= 1;
var yJump = 25;
var maxSpeed = 40.,minSpeed = 0.01;
var speedSign = 1,ySpeedSign = 2;

var cursorObj, cursorAuto;

var touchIsDown = false;

function preload() {
  img = loadImage("./images/comp500c.jpg");
  img2 = loadImage("./images/opt500c.jpg");
  img3 = loadImage("./images/xray500c.jpg");
  cursorImg = loadImage("./images/crosshairs2.png");
  soundFormats('mp3');
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

  // mode='oscillator';
  osc = new p5.Oscillator(20,'sine'); // set frequency and type
  osc.amp(0);
  osc.freq(40);
  // osc.start();

  // mode='manual';

  init();

}


function draw() {
  background(0);
  cnv.size(windowWidth, windowHeight);
  imScale =  imWidth / windowWidth;
  // cnv.size(1080, 1080);
  // imScale = imWidth / 1080; //  imWidth / windowWidth

  // document.getElementById('buttonbar').setAttribute("style", "width:100%");
  // document.getElementById('buttonbar').setAttribute("style", "width:1080"); //didn't work

  if (wavelength == 'comp') {
    image(img, 0, 0, imWidth / imScale, imHeight / imScale);
    imgData= img;
    imgData2=img2;
    imgData3=img3;
  }
  if (wavelength == 'opt') {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
    imgData= img2;
  }
  if (wavelength == 'xray') {
    image(img3, 0, 0, imWidth / imScale, imHeight / imScale);
    imgData= img3;
  }

  if (mode=='oscillator'){
    if (mouseIsPressed || touchIsDown) {
      pixRad = radius(mouseX,mouseY);

      pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel
      pixValue = (imgData.pixels[pixNum] + imgData.pixels[pixNum + 1] + imgData.pixels[pixNum + 2]) / 3.;
      pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness

      var amp = map(pixValue, 0, 256, 0, 1);
      osc.amp(amp);

      //map radius to freq
      var freq = map(pixRad, 0, 1, 40, 800);
      osc.freq(freq);

      //map brightness to freq
      // var freq = map(pixValue, 0, 256, 40, 800);
      // osc.freq(freq);

      lastPixNum = pixNum;

      cursorObj.update(mouseX, mouseY);
      cursorObj.show();
    } else {osc.amp(0);}



  }
  if (mode == 'manual') {
    if (mouseIsPressed || touchIsDown) {

      pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel
      if (wavelength=='comp'){
        pixValue = (imgData2.pixels[pixNum] + imgData2.pixels[pixNum + 1] + imgData2.pixels[pixNum + 2]) / 3.;
        pixValue2 = (imgData3.pixels[pixNum] + imgData3.pixels[pixNum + 1] + imgData3.pixels[pixNum + 2]) / 3.;

      } else {
        pixValue = (imgData.pixels[pixNum] + imgData.pixels[pixNum + 1] + imgData.pixels[pixNum + 2]) / 3.;
        pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
      }

      if (pixNum != lastPixNum) {
        playNotes();
      }
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
    //scan
    // autox += speedSign * scanSpeed;

    // autox += speedSign * speed;
    // autoy = autoy0 + imHeight / imWidth * (autox - autox0);
    // checkBounce();

    pixNum0 = Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth;
    pixNum = Math.round(4 * pixNum0); //labels pixel

    if (wavelength=='comp'){
      pixValue = (imgData2.pixels[pixNum] + imgData2.pixels[pixNum + 1] + imgData2.pixels[pixNum + 2]) / 3.;
      pixValue2 = (imgData3.pixels[pixNum] + imgData3.pixels[pixNum + 1] + imgData3.pixels[pixNum + 2]) / 3.;

    } else {
      pixValue = (imgData.pixels[pixNum] + imgData.pixels[pixNum + 1] + imgData.pixels[pixNum + 2]) / 3.;
      pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
    }
    if (pixNum0 != lastPixNum0) {
      playNotes();
    }
    lastPixNum0 = pixNum0;

    cursorAuto.update(autox, autoy);
    cursorAuto.show();
  }
}


function init() {
  for (i = 0; i < nNotes; i++) {
    note = loadSound('./sounds/crystalBowl/' + (i + 1) + '.mp3');
    notes.push(note);
  }
  // makeComp();
  wavelength = 'comp';
  makeManual();
}


function touchStarted() {
  userStartAudio();
  if (mode == "automatic") {

    if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
      autox = mouseX;
      autoy = mouseY;
      // autox0 = mouseX;
      // autoy0 = mouseY;
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
  userStartAudio();
  if (radius(mouseX,mouseY)<.45) { //to avoid buttons, is there a better way?
  // if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
    autox = mouseX;
    autoy = mouseY;
    // autox0 = mouseX;
    // autoy0 = mouseY;
    // autoR = radius(mouseX,mouseY);
    dx = mouseX * imScale/imWidth - 0.5;
    dy = mouseY * imScale/imHeight - 0.5;
    autoTheta = Math.atan2(dy,dx);
    autoR = 2*Math.sqrt(dx*dx+dy*dy);
    // console.log(autoR,mouseX * imScale/imWidth,dx);
    // console.log(autoR,mouseY * imScale/imHeight,dy);
  }
}

function playNotes() {
  if (pixValue>minValue) {
    i = Math.round(map(pixValue - minValue, 0, 256-minValue, 0, nNotes-1));
    // console.log(pixValue,i);
    notes[i].play();

    if (wavelength=='comp' && pixValue2>minValue){
      i = Math.round(map(pixValue2 - minValue, 0, 256-minValue, 0, nNotes-1));
      // console.log(pixValue,i);
      notes[i].play();
    }
  }
}


function checkBounce() {
  if (autox >= imWidth / imScale || autox < 0) {
    speedSign *= -1;
    autoy += ySpeedSign*yJump;
  }
  if (autoy >= imHeight / imScale || autoy < 0) {
    ySpeedSign *= -1
    autoy += ySpeedSign*yJump;
  }
}


function faster() {
  speed *= 2.;
  speed = Math.min(speed, maxSpeed);
  scanSpeed *= 2.;
  scanSpeed = Math.min(scanSpeed, maxSpeed);
}

function slower() {
  speed *= 0.5;
  speed = Math.max(speed, minSpeed);
  scanSpeed *= 0.5;
  scanSpeed = Math.min(scanSpeed, maxSpeed);
}

function makeOscillator() {
  mode = 'oscillator';
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
  osc.stop();
  autoR = 0.5;
  // document.getElementById('autogrey_button').classList.add("hidden");
  // document.getElementById('auto_button').classList.remove("hidden");
  // document.getElementById('manualgrey_button').classList.remove("hidden");
  // document.getElementById('manual_button').classList.add("hidden");
  //
  // document.getElementById('slower_button').classList.remove("hidden");
  // document.getElementById('faster_button').classList.remove("hidden");
  document.getElementById('leftArrow').classList.remove("hidden");
  document.getElementById('rightArrow').classList.remove("hidden");
}

function makeManual() {
  mode = 'manual';
  osc.stop();
  // document.getElementById('manualgrey_button').classList.add("hidden");
  // document.getElementById('manual_button').classList.remove("hidden");
  // document.getElementById('autogrey_button').classList.remove("hidden");
  // document.getElementById('auto_button').classList.add("hidden");
  //
  // document.getElementById('slower_button').classList.add("hidden");
  // document.getElementById('faster_button').classList.add("hidden");
  document.getElementById('leftArrow').classList.add("hidden");
  document.getElementById('rightArrow').classList.add("hidden");
}

function makeOpt() {
  if (wavelength=='xray') {
    wavelength='comp';
    document.getElementById('optgrey_button').classList.add("hidden");
    document.getElementById('opt_button').classList.remove("hidden");
  }
  else if (wavelength=='comp') {
    wavelength='xray';
    document.getElementById('opt_button').classList.add("hidden");
    document.getElementById('optgrey_button').classList.remove("hidden");
  }
}

function makeXray() {
  if (wavelength=='opt') {
    wavelength='comp';
    document.getElementById('xraygrey_button').classList.add("hidden");
    document.getElementById('xray_button').classList.remove("hidden");
  }
  else if (wavelength=='comp') {
    wavelength='opt';
    document.getElementById('xray_button').classList.add("hidden");
    document.getElementById('xraygrey_button').classList.remove("hidden");
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
