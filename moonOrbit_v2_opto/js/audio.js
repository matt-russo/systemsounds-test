'use strict';  //causes problems with scope of eval
//////////////////////////////////////////////////
// audio.js - Web audio stuff

// ----- buffer-loader.js
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  const loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (let i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
// ----- end buffer-loader.js

//////////////////////////////////////////////////
// Main section
let audioContext;
let bufferLoader;


const nNotes=26;  //notes for craters


for (var i=0;i<nNotes;i++){
      // eval('note' + i + " = null");
      (function(){
        eval.apply(this, arguments);
      }('var note' + i + " = null"))
}
let noteb = null;
let drone = null;


// Create audio context and load sounds
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();


const gainNode = audioContext.createGain();
gainNode.gain.value = 1;
gainNode.connect(audioContext.destination);

const gainNodeDrone = audioContext.createGain();
gainNodeDrone.gain.value = 0.3;
gainNodeDrone.connect(audioContext.destination);

// const gainNodeSites = audioContext.createGain();
// gainNodeSites.gain.value = 1;
// gainNodeSites.connect(audioContext.destination);

let bufferArr =[];
for (let i=0;i<nNotes;i++) {
    // let buffName='./sounds/note'+i+'.mp3';
    bufferArr.push('./sounds/note'+i+'.mp3');
}

// let buffName='./sounds/noteb.mp3';
bufferArr.push('./sounds/noteb.mp3');

// let buffName='./sounds/drone.mp3';
bufferArr.push('./sounds/drone.mp3');

// for (let i=0;i<nSites;i++) {
//     // let buffName='./sounds/note'+i+'.mp3';
//     bufferArr.push('./sounds/site'+i+'.mp3');
// }

console.log(bufferArr.length,'audio files');

bufferLoader = new BufferLoader(
	audioContext,bufferArr,

	function(bufferList) {

    for (let i=0;i<nNotes;i++) {
        eval('note' + i + " = bufferList[i];");
    }
    // eval('noteb' +"= bufferList[nNotes];");
    noteb = bufferList[nNotes];
    drone = bufferList[nNotes+1];
	});

bufferLoader.load();


function playSound(object, gainNode) {   //now taking notebuffer or drumbuffer
  //var buffer = eval(object.name + object.note);
  let buffer = object.notebuffer;
	let source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(gainNode);
	source.start(0);
}

function playDrone(buffer, gainNodeDrone) {   //now taking notebuffer or drumbuffer
	let source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(gainNodeDrone);
  let loopingEnabled = source.loop;
  source.loop = true;
	source.start(0);
}

document.body.addEventListener('touchend', activate);
function activate() {
    console.log('touchend event did fire');
    audioContext.resume();
    if (audioContext.state === 'running') {
        document.body.removeEventListener('touchend', activate);
    }
}
