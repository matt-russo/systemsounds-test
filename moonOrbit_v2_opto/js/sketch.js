'use strict';

//OPTIMIZED FOR WEB BE REMOVING ALL UNUSED FUNCTIONS/IMAGES, USING LOWER RES MAPS, LESS VERTICES, LESS EXPLOSION PARTICLES


const width = 1000;
const aspect = 1080/1920*1.1; //larger values will flatten out surface
const height = width*aspect;


/////////SET UP SCENE AND CAMERA//////////////////////

const scene = new THREE.Scene();
const camFOV=25;
const camera = new THREE.PerspectiveCamera(camFOV, 1/aspect, 1, 10000);

const camRadius=1.3*moonRadius; //was 1.6
camera.position.x = camRadius;

var theta_la=23*Math.PI/180; //initial angle between camera and lookat point, was 20
var laRadius=moonRadius+5;
var la = new THREE.Vector3(laRadius*Math.cos(theta_la),0,laRadius*Math.sin(theta_la));

camera.up.set(camera.position.x,0,-10);
camera.lookAt(la);



///////////SET UP RENDERER/////////////////////////
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement); //create <canvas> in body

/////CAMERA CONTROLS////////////////////////
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = false;

/////LOAD ASSESTS//////////////////
loadSiteData();  //should disable this for AKM
loadCraterData();
makeFixedCraters();
addObjects();

window.onload = function () {

  imgData = getImage();
  applyHeightmap();
  // document.getElementById('loaderText').style.visibility = "hidden";
  document.getElementById('loader').style.visibility = "hidden";
  document.getElementById('blackOverlay').style.visibility = "hidden";
  // document.getElementById('playButton').classList.remove('hidden');
  // document.getElementById('orbiter').classList.remove('hidden');
}


updateCamera();


//STATS
if (showStats) {
  (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
}


let tjoystick=3;

function render() {
  t=frameCounter/frameRate;
  if (t>tjoystick) {
    updateStatus();  //here so that it can switch to automatic with joystick
  }
  if (mode=='automatic') {
    updateCamera();
    orbiterRayCastMultiple();
    siteRayCast();
    if (steering) autoSteer();
  }

  updateLight();
  fadeCraters();

  requestAnimationFrame(render);
  renderer.render(scene, camera);
  frameCounter++;
}


document.addEventListener( 'click', onMouseClick, false );
document.addEventListener("keydown", keyDown);
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

render();
