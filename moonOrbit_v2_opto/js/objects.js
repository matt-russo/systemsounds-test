'use strict';


///////////////MOON/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
const moonRadius = 100;

////////////TEST BOX to SPHERE/////////////////

var bWidth = 100, nSegs= 128 ;
var moonGeometry2 = new THREE.BoxGeometry(bWidth, bWidth, bWidth, nSegs,nSegs,nSegs);
for (var i in moonGeometry2.vertices) {
		var vertex = moonGeometry2.vertices[i];
		vertex.normalize().multiplyScalar(moonRadius);
	}
computeGeometry(moonGeometry2);
// moonGeometry2.verticesNeedUpdate=true;
// moonGeometry2.computeVertexNormals();//for shadows to work properly


const bumpScale=.05;
const shine=0.2;

const loader = new THREE.TextureLoader();
 //pos-x, neg-x, pos-y, neg-y, pos-z, neg-z
const cubeMaterials = [
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/nz.jpg'),
          bumpMap: loader.load('./images/heightmap4K/nz.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/pz.jpg'),
          bumpMap: loader.load('./images/heightmap4K/pz.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/py.jpg'),
          bumpMap: loader.load('./images/heightmap4K/py.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/ny.jpg'),
          bumpMap: loader.load('./images/heightmap4K/ny.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/px.jpg'),
          bumpMap: loader.load('./images/heightmap4K/px.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
     new THREE.MeshPhongMaterial({map: loader.load('./images/cubemap4K/nx.jpg'),
          bumpMap: loader.load('./images/heightmap4K/nx.jpg'),
          bumpScale:  bumpScale,
          shininess: shine}),
   ];
var moonMesh2= new THREE.Mesh(moonGeometry2, cubeMaterials);

function computeGeometry(geometry) {
	// geometry.makeGroups(); //removed
	geometry.computeVertexNormals()
	geometry.computeFaceNormals();
	geometry.computeMorphNormals();
	geometry.computeBoundingSphere();
	geometry.computeBoundingBox();
	// geometry.computeLineDistances(); //removed

	geometry.verticesNeedUpdate = true;
	geometry.elementsNeedUpdate = true;
	geometry.uvsNeedUpdate = true;
	geometry.normalsNeedUpdate = true;
	geometry.tangentsNeedUpdate = true;
	geometry.colorsNeedUpdate = true;
	geometry.lineDistancesNeedUpdate = true;
	geometry.buffersNeedUpdate = true;
	geometry.groupsNeedUpdate = true;
}

//HEIGHT MAP
const img = document.createElement('img');
img.crossOrigin = "Anonymous";
img.src = "./images/heightmap2K.jpg";

var canvas,imgData;

function getImage(){

  canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  imgData = ctx.getImageData(0,0,canvas.width, canvas.height); //doesn't alway have canvas here
  return imgData
}

var hmVector = new THREE.Vector3();

function applyHeightmap() {
  //imgData = getImage();
  var verts = moonGeometry2.vertices;
  for (var i = 0, l = verts.length; i < l; i++) {
    var dir = position2Dir(verts[i]);
    var h = getH(dir,canvas,imgData);

    // var vector = new THREE.Vector3()
    hmVector.set(verts[i].x, verts[i].y, verts[i].z);
    hmVector.setLength(h);
    verts[i].x = hmVector.x;
    verts[i].y = hmVector.y;
    verts[i].z = hmVector.z;
  }
  moonGeometry2.verticesNeedUpdate=true;
  moonGeometry2.computeVertexNormals();//for shadows to work properly
  // scene.add(sphere);
}


///////////////////STARFIELD/////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

const starRadius = 200;

var sWidth = 400, nSegs= 2 ;
var starGeometry2 = new THREE.BoxGeometry(sWidth, sWidth, sWidth, nSegs,nSegs,nSegs);
for (var i in starGeometry2.vertices) {
		var vertex = starGeometry2.vertices[i];
		vertex.normalize().multiplyScalar(starRadius);
	}
computeGeometry(starGeometry2);

 //pos-x, neg-x, pos-y, neg-y, pos-z, neg-z
const cubeMaterialsS = [
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/nz.jpg'), side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/pz.jpg'),side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/py.jpg'),side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/ny.jpg'),side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/px.jpg'),side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
     new THREE.MeshBasicMaterial({map: loader.load('./images/starfield4K/nx.jpg'),side: THREE.DoubleSide,
     transparent: false,
     color: 0x444444,
     opacity: .5}),
   ];
var starfield2= new THREE.Mesh(starGeometry2 , cubeMaterialsS);


///////////////////EARTH/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const earthD=175;

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 50, 50),
  // new THREE.MeshBasicMaterial({
  new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('./images/earthmap.jpg'),
    transparent: false,
    shininess: 0.5,
    color: 0XAAAAAA,
    opacity: 1
  })
);
earth.position.set(earthD,0,0);

const cloudTexture = new THREE.TextureLoader().load("./images/clouds.jpg");
const cloudGeometry = new THREE.SphereGeometry(1.5+.1,  50, 50);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5
});

//Create a cloud mesh and add it to the scene.
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
clouds.position.set(earthD,0,0);



///////////////////SUN/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// var sunD=175;
const rSun = 190;

const sunGlareMap = new THREE.TextureLoader().load("images/G2.png");
const sunGlare = new THREE.SpriteMaterial({
  map: sunGlareMap ,
  transparent: true,
  opacity: 0.9
});
const sun = new THREE.Sprite(sunGlare);
sun.position.set(rSun, 0, 0);
sun.scale.set(20, 20, 20)

const sunGeometry = new THREE.SphereGeometry( .5, 50, 50 );
const sunMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,
});

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(rSun, 0, 0);

//////////////////LIGHTS////////////////////////////////
const rlight=1000;
const light = new THREE.PointLight(0xffffff, 0.85); //to appear to come from sun
// var light = new THREE.DirectionalLight(0xffffff, .85);
// var light = new THREE.SpotLight(0xffffff, 1);
light.position.set(rlight, 0, 0)
const amLight = new THREE.AmbientLight(0x333333,0.85);

//////////////////////orbiter///////////
var dlat=0.15;
var dlon=0.02;
var orbiterHeight=6; //was 5
var thetaOrb=20; //was 25

function Orbiter (lon,lat){
		this.lon = lon;
    this.lat = lat;

    this.position =  position(moonRadius+orbiterHeight,this.lon,this.lat);
		this.show= true;					// display moon or not (boolean)  (NOT USING RIGHT NOW)


		this.update = function() {
			this.latlast = this.lat;
			this.lon+=dlon;
			this.lat+=dlat;

			this.position =  position(moonRadius+orbiterHeight,this.lon,this.lat);

		}
	}
var orbiter = new Orbiter(thetaOrb,0);

////////////// FIXED OBJECT ARRAYS///////////////////////////////

// var nObjects=50; //number of particles

const explosionTexture= new THREE.TextureLoader().load('images/glow_wh2.png');
const blastTexture= new THREE.TextureLoader().load('images/F2.png');
const particleTexture= new THREE.TextureLoader().load("images/clouds4.png");

const cratersFixed = [];
const sticksFixed = [];
const spotLightsFixed = [];

//make all fixed object

function makeFixedCraters() {
  for (let i=0;i<nFixed;i++) {
    // CRATERS
    var crater= new THREE.Object3D();
    crater.name="unassigned";
    crater.t=-10000;
    cratersFixed.push(crater);

    // STICKS
    var stick = new THREE.Object3D();
    sticksFixed.push(stick);
    stick.add(crater);
    crater.stick=stick;

    //BLASTS
    var geometry = new THREE.CircleGeometry( 3, 50 ); //radius, segments
    var material = new THREE.MeshBasicMaterial( {
      map:blastTexture,
      // side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent:true} );
    var blast = new THREE.Mesh( geometry, material );
    blast.material.opacity = blastOpacity;
    // blastsFixed.push(blast);
    crater.add(blast);
    crater.blast=blast;

    //EXPLOSION
    var fgeometry = new THREE.CircleGeometry( 3, 32 ); //radius, segments
    var fmaterial = new THREE.MeshBasicMaterial( {
        map:explosionTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent:true} );

    var explosion = new THREE.Mesh( fgeometry, fmaterial );
    crater.add(explosion);
    crater.explosion=explosion;

    //PARTICLES

    var pgeometry = new THREE.Geometry();
    for (let j = 0; j < nObjects; j ++){
      var vertex = new THREE.Vector3();  //bottleneck?
      pgeometry.vertices.push( vertex );
    }

    var pmaterial = new THREE.PointsMaterial( {
      size: 1,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true});

    var particles = new THREE.Points( pgeometry, pmaterial );
    // particlesFixed.push(particles);
    crater.add(particles);
    crater.particles=particles;

    var dirs = [];
    for (let k = 0; k < nObjects; k++){
      dirs.push({x:0,y:0,z:0});
      crater.dirs=dirs;
    }

    //SPOTLIGHTS
    var spotlight = new THREE.SpotLight( 0xffffff);
    spotLightsFixed.push(spotlight);
    // crater.add(spotlight);
    crater.spotlight=spotlight;

  }

}



function addObjects() {
	scene.add(starfield2);
  scene.add(earth);
  scene.add(clouds);
  scene.add(sun);
  scene.add(sunMesh);
  scene.add(light);
  scene.add(amLight);
  scene.add(moonMesh2);


  for (let i=0;i<nFixed;i++) {
    scene.add(sticksFixed[i]);
    scene.add(spotLightsFixed[i]);
  }

}


/////////RAYCASTERS////////////////////////////////////
// var raycaster = new THREE.Raycaster();   //for mouse
// raycaster.params.Points.threshold = 1;

const mouse = new THREE.Vector2();
const origin = new THREE.Vector3();
var firstRC=true;

const raycasters=[];
const raycaster1 = new THREE.Raycaster();
raycaster1.params.Points.threshold = 1;
const raycaster5 = new THREE.Raycaster();
raycaster5.params.Points.threshold = 5;
raycasters.push(raycaster1);
raycasters.push(raycaster5);

const orbiterRaycasters=[];
const orbiterRaycaster1 = new THREE.Raycaster();
orbiterRaycaster1.params.Points.threshold = 2;
const orbiterRaycaster5 = new THREE.Raycaster();
orbiterRaycaster5.params.Points.threshold = 3;
orbiterRaycasters.push(orbiterRaycaster1);
orbiterRaycasters.push(orbiterRaycaster5);

const siteRaycaster = new THREE.Raycaster();
siteRaycaster.params.Points.threshold = 2;
