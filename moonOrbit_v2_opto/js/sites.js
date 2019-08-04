'use strict';
var siteData;
var nSites;
var sites=[];


function loadSiteData() {

    $.getJSON('data/apollo_sites.json', {}, function (data) {

        //init typed arrays for star data
        nSites = data.sites.length;
        // console.log(nSites, 'sites');

        siteData = {
            name: new Array(nSites),
            lon: new Array(nSites),
            lat: new Array(nSites)
        };

        //populated typed arrays with star data
        var i = 0;
        while (i < nSites) {
            siteData.name[i] = data.sites[i].name;
            siteData.lon[i] = data.sites[i].lon;
            siteData.lat[i] = data.sites[i].lat;
            i++;
        }

    })
    .done(function() {
    console.log( "Loaded "+nSites+" Sites" );
    addSites();
  });
    // console.log('Loading Sites');
}


////sites//////////

var siteAlt = 2;
var siteParticles;

function addSites() {

  var pgeometrySites = new THREE.Geometry();
  var pmaterialSites = new THREE.PointsMaterial( {
          size: 10,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          transparent: true,
          opacity:0}); //>0 only to see them in testing

  for (let i=0;i<siteData.name.length;i++) {

    //site line
    var siteGeometry = new THREE.Geometry();
    var siteMaterial = new THREE.LineBasicMaterial({
    	color: 0xffffff,
      transparent:true,
      opacity:0
    });

    var sitePos = position(moonRadius +siteAlt,-siteData.lon[i],siteData.lat[i]);
    siteGeometry.vertices.push(sitePos,new THREE.Vector3( 0, 0, 0 ));
    var site = new THREE.Line( siteGeometry, siteMaterial);
    site.name = siteData.name[i];
    site.index = i;
    site.t = 0;
    // site.notebuffer = eval('site'+i);
    sites.push(site);
    scene.add(site);

    //site label
    var label = makeTextSprite( siteData.name[i], {fontsize:16} );
    label.position.set(sitePos.x, sitePos.y, sitePos.z);
    site.label = label;
    scene.add(label);

    //site triggers
    // var vertex = sites[i].geometry.vertices[0];
    pgeometrySites.vertices.push( position(moonRadius,-siteData.lon[i],siteData.lat[i]));
  }
  siteParticles = new THREE.Points( pgeometrySites, pmaterialSites );
  scene.add(siteParticles);
}




function makeTextSprite( message, parameters )
    {
        if ( parameters === undefined ) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 75;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 0;
        var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:0 };
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:0 };
        var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:255, g:255, b:255, a:1 };

        var canvas = document.createElement('canvas');
        canvas.width = 512;  //needs to be large for text to be small and sharp
        canvas.height = 256;
        var context = canvas.getContext('2d');
        // context.font = "Bold " + fontsize + "px " + fontface;
        context.font = fontsize + "px " + fontface;
        var metrics = context.measureText( message );
        var textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        // context.fillText( message, borderThickness, fontsize + borderThickness);

        context.fillText( message, canvas.width/2 - textWidth/2, canvas.height/2 - textWidth/8 );

        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial( { map: texture, opacity:0} );
        var sprite = new THREE.Sprite( spriteMaterial );
        // sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        sprite.scale.set(1 * fontsize, .5 * fontsize, 1.5 * fontsize);

        return sprite;
    }
