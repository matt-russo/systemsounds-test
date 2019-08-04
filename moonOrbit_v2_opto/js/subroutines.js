'use strict';

function position(obR,obLong,obLat) {
  var obPos = new THREE.Vector3(
            obR*Math.cos(obLong*Math.PI/180)*Math.cos(obLat*Math.PI/180),
            obR*Math.sin(obLat*Math.PI/180),
            obR*Math.sin(obLong*Math.PI/180)*Math.cos(obLat*Math.PI/180));
  return obPos;
}


function rayCastMultiple(raycasters) {
  //raycaster for mouse clicks
  //multiple sizes of points (raycaster threshold)

  for (var i=0;i<raycasters.length;i++) {
    raycasters[i].setFromCamera( mouse, camera );
    raycasters[i].far = camera.position.length();
    var intersects = raycasters[i].intersectObjects( [craterParticlesMultiple[i]] );

    if (intersects.length) {

      var index = intersects[0].index;
      var craterDataTemp=craterDataMultiple[i];
      var cName=craterDataTemp.name[index];
      var cLon=craterDataTemp.lon[index];
      var cLat=craterDataTemp.lat[index];
      var cRadius=craterDataTemp.rad[index];
      var midi =craterDataTemp.midi[index] ;

      triggerCrater(cName,cLon,cLat,cRadius,midi);

      var intOb = cratersFixed[nFixedIndex];

      expObjectsNames.push(intOb.name);
      playSound(intOb, gainNode);

      nFixedIndex = (nFixedIndex +1)%nFixed;
      // nFixedParticlesIndex = (nFixedParticlesIndex +1)%nFixedParticles;

      if (expObjectsNames.length>nFixed) {
        expObjectsNames.shift();
      }

    }
  }

}

function rayCastMultipleSite(siteRaycaster) {
  //raycaster for mouse clicks
  //multiple sizes of points (raycaster threshold)

    siteRaycaster.setFromCamera( mouse, camera );
    siteRaycaster.far = camera.position.length();
    var intersects = siteRaycaster.intersectObjects( [siteParticles] );

    if (intersects.length) {

      var index = intersects[0].index;
      // console.log(sites[index].name);
      //turn on site label and line
      var intOb = sites[index];
      intOb.material.opacity =1;
      intOb.label.material.opacity =1;
      playSound(intOb, gainNodeSites);

  }
}


var intersectsArr = new Array(); //instantiate new array to feed intersectObjects so it doesn't create new ones

function orbiterRayCastMultiple() {
  // orbiterRaycaster.setFromCamera( orbiter.position,camera );
  var direction = orbiter.position.clone();
  direction.normalize();

  for (var i=0;i<orbiterRaycasters.length;i++)  {
    orbiterRaycasters[i].ray.set(origin,direction);

    // calculate objects intersecting the picking ray
    intersectsArr.length=0;
    var intersects = orbiterRaycasters[i].intersectObjects([craterParticlesMultiple[i]],false,intersectsArr );

    if (intersects.length) {

      var index = intersects[0].index;
      var craterDataTemp=craterDataMultiple[i];

      var cName=craterDataTemp.name[index];
      var cLon=craterDataTemp.lon[index];
      var cLat=craterDataTemp.lat[index];
      var cRadius=craterDataTemp.rad[index];
      var midi =craterDataTemp.midi[index] ;



      if (expObjectsNames.includes(cName)==false) {
        triggerCrater(cName,cLon,cLat,cRadius,midi);


        var intOb = cratersFixed[nFixedIndex];
        expObjectsNames.push(cName);

        playSound(intOb, gainNode);

        nFixedIndex = (nFixedIndex +1)%nFixed;

        if (expObjectsNames.length>nParticleUpdates) {
          expObjectsNames.shift();
        }
      }
    }
  }
}

function siteRayCast() {
  var direction = orbiter.position.clone();
  direction.normalize();

  siteRaycaster.ray.set(origin,direction);

  // calculate objects intersecting the picking ray
  intersectsArr.length=0;
  var intersects = siteRaycaster.intersectObjects([siteParticles],false,intersectsArr );

  if (intersects.length) {

    var index = intersects[0].index;
    var intOb = sites[index];
    if (t-intOb.t >10) {  //to prevent multiple triggers
      intOb.material.opacity =1;
      intOb.label.material.opacity =1;
      // playSound(intOb, gainNodeSites);
      intOb.t=t;
    }
  }
}

function getH(dir,canvas,imgData) {

  dir.az = 360 - dir.az + 180;
  dir.az = dir.az % 360;

  var x = Math.floor(canvas.width * dir.az / 360);
  var y = Math.floor(canvas.height * (dir.h + 90) / 180);
  // var pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data; //slow
  // var h = moonRadius + maxHeight*(pixelData[0] - 255/2)/ (255/2);

  var k = (x + canvas.width*y)*4; //find r channel pixel brightness
  var pixelData = imgData.data[k];
  var maxHeight=.3; //was 0.7
  var h = moonRadius + maxHeight*(pixelData - 255/2)/ (255/2);
  if (dir.az==180 && (dir.h ==90 || dir.h==-90)) {
    h = moonRadius;
  }
  return h;
}

function position2Dir(position) {
  var az = null;
  var h = null;

  var length = position.length();

  var hd = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.z, 2)) / length;

  h = Math.atan((position.y / length) / hd) / Math.PI * 180;
  h *= -1;

  az = Math.atan((position.z / hd) / (position.x / hd));

  if (position.x < 0 && position.z > 0) az = Math.PI + az;
  if (position.x < 0 && position.z <= 0) az = Math.PI + az;
  if (position.x > 0 && position.z < 0) az = Math.PI * 2 + az;

  az = az / Math.PI * 180;

  if (isNaN(az)) az = 0;

  return {
    az: az,
    h: h
  };
}

// function remove(id) {
//   //to remove objects from the scene, id is a name
//   var ob = scene.getObjectByName(id);
//   scene.remove(ob);
//
//   if (ob.material) {
//     ob.material.dispose();
//   }
//   if (ob.geometry) {
//     ob.geometry.dispose();
//   }
// }

function updateLight() {
  var tScale=50;
  var xl = rlight*Math.cos(t/tScale);
  var zl = rlight*Math.sin(t/tScale);
  light.position.set(xl, 0, zl);

  var xl = rSun*Math.cos(t/tScale);
  var zl = rSun*Math.sin(t/tScale);
  sunMesh.position.set(xl, 0, zl);
  sun.position.set(xl, 0, zl);
  starfield2.rotation.y=-t/tScale;
  earth.rotation.y=-t/tScale ;
  // clouds.rotation.y=-t/tScale ;
}

var qCamera = new THREE.Quaternion();
var qYaw = new THREE.Quaternion();
var qPitch = new THREE.Quaternion();

function updateCamera() {
  //update camera, orbiter, and look at

  var c = camera.position.clone().normalize(); //.negate()
  var o = orbiter.position.clone().normalize();
  var v = c.cross(o).normalize();

  var r = .1 * Math.PI / 180;

  var q = qCamera;
  q.setFromAxisAngle(v/*new THREE.Vector3(1, 0, 0)*/, r);
  camera.position.applyQuaternion(q);
  camera.up.applyQuaternion(q);
  orbiter.position.applyQuaternion(q);

  la.applyQuaternion(q);
  camera.lookAt(la);
}

function yaw(direction) {
  //update camera, orbiter, and look at
  var c = camera.position.clone().normalize(); //.negate()
  // var r = -direction*.25 * Math.PI / 180;
  var r = -direction*yawAngle * Math.PI / 180;
  var q = qYaw;
  q.setFromAxisAngle(c/*new THREE.Vector3(1, 0, 0)*/, r);
  orbiter.position.applyQuaternion(q);
  la.applyQuaternion(q);
  camera.lookAt(la);
}


function pitch(direction) {
  //update camera, orbiter, and look at

  var c = camera.position.clone().normalize(); //.negate()
  var o = orbiter.position.clone().normalize();
  var v = c.cross(o).normalize();

  var r = -direction*.2 * Math.PI / 180; //pitch speed

  // var q = new THREE.Quaternion();
  var q = qPitch;
  q.setFromAxisAngle(v/*new THREE.Vector3(1, 0, 0)*/, r);

  var la_temp=la.clone();
  la_temp.applyQuaternion(q);

  if (la_temp.angleTo(orbiter.position)<10*Math.PI/180) { //limit look at to be close to orbiter angle
    la.applyQuaternion(q);
    camera.lookAt(la);
  }

}


function autoSteer() {
  tsteer += 1/frameRate;
  if (tsteer>=tstraight && turning==false) {
    turning=true;
    tsteer=0;
  }
  if (turning==true) {
    if (tsteer<tturn) {
      yaw(steerDir);
    } else {turning=false; tsteer=0; steerDir*=-1;}
  }
}
