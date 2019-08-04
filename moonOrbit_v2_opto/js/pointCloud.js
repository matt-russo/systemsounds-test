'use strict';


var craterParticlesMultiple=[];
var craterSmallData;
var craterLargeData;
var craterDataMultiple=[];

function makeCraterPointsMultiple() {
  // console.log(craterSmallCount,'small',craterLargeCount,'larger');
  craterSmallData = {
      lon: new Array(craterSmallCount),
      lat: new Array(craterSmallCount),
      rad: new Array(craterSmallCount),
      name: new Array(craterSmallCount),
      midi: new Array(craterSmallCount)
  };
  craterLargeData = {
      lon: new Array(craterLargeCount),
      lat: new Array(craterLargeCount),
      rad: new Array(craterLargeCount),
      name: new Array(craterLargeCount),
      midi: new Array(craterLargeCount)
  };


  var pgeometry1 = new THREE.Geometry();
  var pgeometry5 = new THREE.Geometry();

  var cp1Count=0;
  var cp5Count=0;
  var craterSmallIndex=0;
  var craterLargeIndex=0;
  for (let i = 0; i < craterData.id.length; i ++)
  {
    if (craterData.rad[i]>minCraterRadius) {

      var cLon=-craterData.lon[i];
      var cLat=craterData.lat[i];
      var vertex = position(moonRadius,cLon,cLat);


      if (craterData.rad[i]>craterRadSmall)  {
        cp5Count++;

        craterLargeData.name[craterLargeIndex]=craterData.name[i];
        craterLargeData.lon[craterLargeIndex]=cLon;
        craterLargeData.lat[craterLargeIndex]=cLat;
        craterLargeData.rad[craterLargeIndex]=craterData.rad[i];
        craterLargeData.midi[craterLargeIndex]=craterData.midi[i];
        craterLargeIndex++;

        pgeometry5.vertices.push( vertex );

      } else {
        cp1Count++;

        craterSmallData.name[craterSmallIndex]=craterData.name[i];
        craterSmallData.lon[craterSmallIndex]=cLon;
        craterSmallData.lat[craterSmallIndex]=cLat;
        craterSmallData.rad[craterSmallIndex]=craterData.rad[i];
        craterSmallData.midi[craterSmallIndex]=craterData.midi[i];
        craterSmallIndex++;

        pgeometry1.vertices.push( vertex );
      }
    }

  }
  craterDataMultiple.push(craterSmallData,craterLargeData);


  var pmaterial1 = new THREE.PointsMaterial( {
    size: 10,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    opacity:0});

  var pmaterial5 = new THREE.PointsMaterial( {
      size: 10,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      opacity:0});

  var craterParticles1 = new THREE.Points( pgeometry1, pmaterial1 );
  var craterParticles5 = new THREE.Points( pgeometry5, pmaterial5 );

  craterParticlesMultiple.push(craterParticles1,craterParticles5);
  scene.add(craterParticles1);
  scene.add(craterParticles5);
  console.log('Made particles: ' +cp1Count+' small, '+cp5Count+' large');
  craterData=null; //clear array after crater points are made

}
