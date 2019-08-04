'use strict';
let craterData;
let n;
let nCraters=0;  //number of craters above minium size
let craters=[];

const minCraterRadius = 10; //minimum crater size to include

const craterRadSmall=25;  //craters smaller than this count as small
let craterSmallCount=0;
let craterLargeCount=0;


const craterScale=1/20;
let maxCraterRadius=0; //updated on load


function loadCraterData() {

    $.getJSON('data/craters10.json', {}, function (data) {  //this returns a promise?

        //init typed arrays for star data
        n = data.craters.length; //total craters in catalog

        craterData = {
            id: new Array(n),
            name: new Array(n),
            lon: new Array(n),
            lat: new Array(n),
            rad: new Array(n),
            midi: new Array(n)
        };


        for (let i=0;i<n;i++){
          if (data.craters[i].rad>minCraterRadius) {
            craterData.id[i] = data.craters[i].id;
            craterData.name[i] = data.craters[i].name;
            craterData.lon[i] = data.craters[i].lon;
            craterData.lat[i] = data.craters[i].lat;
            craterData.rad[i] = data.craters[i].rad;
            craterData.midi[i] = data.craters[i].midi;

            nCraters++;

            maxCraterRadius=Math.max(maxCraterRadius,data.craters[i].rad);

            if (data.craters[i].rad<craterRadSmall) {
              craterSmallCount++;
            } else {
              craterLargeCount++;
            }
          }
        }

    })

    .done(function() {
    console.log( "Loaded "+nCraters+" Craters of "+n);
    makeCraterPointsMultiple();
  });
}




const spotLightDist=200; //so that light angle = crater angle from origin
const moonRadiusKm=1737;
let expObjectsNames=[];

function triggerCrater(cName,cLon,cLat,cRadius,midi) {
  // console.log('triggered ',cName,nFixedIndex);
  var crater = cratersFixed[nFixedIndex];

  //STICK
  crater.stick.lookAt(position(1,cLon,cLat));
  crater.stick.name = cName+' stick'; //name stick after crater
  var dir = position2Dir(position(1,cLon,cLat));
  var craterH = getH(dir,canvas,imgData);
  crater.position.set( 0, 0, craterH);
  crater.name=cName;
  crater.lon=cLon;
  crater.lat=cLat
  crater.rad=cRadius;
  // circle.midi = midi; //referenced anywhere else?
  crater.notebuffer = eval('note'+midi);
  crater.t=t;

  //BLAST PATTERN
  var s = 1;
  var l = 0.8;

  var cR = Math.pow((cRadius-10)/(maxCraterRadius-10),.25); //to adjust for fact that most craters are small
  var b = Math.pow((3*(1-cR) +cR)*cR*cR,0.5); //scaled Bezier curve
  var hmin = 0;
  var hmax = 0.9;
  var h = hmin + b*(hmax-hmin) - 0.2;

  crater.blast.material.color.setHSL ( h, s, l );
  var blastSize=explosionFlashSize*cRadius/700;
  crater.blast.scale.set(blastSize,blastSize,blastSize);
  crater.blast.position.set(0,0,0);
  crater.blast.name = crater.name + ' blast';
  crater.blast.material.opacity=blastOpacity;

  //EXPLOSION
  crater.explosion.material.color.setHSL ( h, s, l );
  crater.explosion.name = crater.name +' explosion';
  crater.explosion.position.set(0,0,0);
  crater.explosion.material.opacity=explosionOpacity;

  //SPOTLIGHT
  var sPos = position(spotLightDist,cLon,cLat);
  var spotLight = spotLightsFixed[nFixedIndex];
  crater.spotlight.position.set( sPos.x, sPos.y, sPos.z );
  crater.spotlight.angle = cRadius/moonRadiusKm*0.88;
  crater.spotlight.color.setHSL ( h, s, l );
  crater.spotlight.name = cName + 'spotlight';
  crater.spotlight.intensity = spotLightOpacity;

  //initialize particle velocities
  crater.particles.material.color.setHSL ( h, s, l );
  for (let i = 0; i < nObjects; i ++){
    var particle =  crater.particles.geometry.vertices[i]
      particle.y =0;
      particle.x =0;
      particle.z =0;

    var theta = Math.random()*Math.PI*2;
    var phi = Math.random()*Math.PI/2;
    var xDir = movementSpeed*Math.sin(theta)*Math.pow(crater.rad/50,.5)*Math.sin(phi);
    var yDir = movementSpeed*Math.cos(theta)*Math.pow(crater.rad/50,.5)*Math.sin(phi);
    var zDir = 0.25*movementSpeed*Math.cos(phi)*Math.pow(crater.rad/50,.5);

    crater.dirs[i] = {x:xDir,y:yDir,z:zDir};
  }
  crater.particles.material.opacity=particleOpacity;
  crater.particles.material.size = objectSize + Math.random()*sizeRandomness;
  //need to include size randomness

}


function fadeCraters() {
  for (let i=0;i<cratersFixed.length;i++) {
    var crater = cratersFixed[i];
    crater.spotlight.intensity *= blastFade;
    crater.blast.material.opacity *= blastFade;

    var flashSize=explosionFlashSize*Math.pow(crater.rad/75,0.75);
    var reScale = flashSize*(1 - crater.explosion.material.opacity);
    crater.explosion.material.opacity*=expFade;
    crater.explosion.scale.set(reScale,reScale,reScale);

    //only if crater was recent?
    if (expObjectsNames.includes(crater.name)){
      var pCount = crater.particles.geometry.vertices.length;
      while(pCount--) {
        var particle =  crater.particles.geometry.vertices[pCount]
          particle.y += crater.dirs[pCount].y;
          particle.x += crater.dirs[pCount].x;
          particle.z += crater.dirs[pCount].z;
        }
      crater.particles.geometry.verticesNeedUpdate = true;
      crater.particles.material.opacity *= particleFade;
    };

  }

//move to fadeSites fucntion
  for (let i=0;i<sites.length;i++){
    sites[i].material.opacity *=siteOp;
    sites[i].label.material.opacity *=siteOp;
  }
}
