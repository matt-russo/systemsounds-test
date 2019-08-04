////////SET PARAMETERS/////////////////////
const showStats=false; //doesn't seem to work in node, needs connection?
var mode='manual';
var started = false;

const nFixed = 10;  //number of objects in fixed arrays
var nFixedIndex=0; //current index to access objects in fixed arrays

var nObjects=50; //number of particles for each explosion
var nParticleUpdates=5; //only update the last n particles

const tFade = 4;
const colorRadius=100;
var t = 0;
var frameCounter=0;
const frameRate=60; //


var blastOpacity = 0.65;
var explosionOpacity = 0.4;
var particleOpacity=1;
var opacityFade = 0.98;
var blastFade= 0.99;
var expFade = 0.96;
var particleFade=0.96;
var spotLightOpacity = .7;
var explosionFlashSize=75;

var movementSpeed = 1*2; //scale to account for throttling in render loop
var objectSize = 0.25;  //particles
var sizeRandomness = .25;


var siteOp=0.995; //opacity of site labels

let yawAngle = 0.25;  //0.25 for Sonic Orbiter

//STEERING FOR RENDERED VIDEO
let steering = false;

if (steering) yawAngle = 0.075;   //0.25 for Sonic Orbiter
const tstraight = 30; //time to move straight before turning
const tturn = 4; //time to turn
let tsteer=0;
let turning=false;
let steerDir=1;
