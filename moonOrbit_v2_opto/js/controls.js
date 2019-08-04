'use strict';

function switchMode() {
  if (mode=='manual') {
    mode='automatic';

  }
  else if (mode=='automatic') {
    mode='manual';
  }
}

function play() {
  audioContext.resume();
  playDrone(drone, gainNodeDrone);
  switchMode();
  // document.getElementById('playButton').classList.add('hidden');
  started=true;
}


function onMouseClick( event ) {
  mouse.x = ( event.offsetX / renderer.domElement.width ) * 2 - 1;
  mouse.y = -( event.offsetY / renderer.domElement.height ) * 2 + 1;
  if (firstRC==false) {
    rayCastMultiple(raycasters);
    rayCastMultipleSite(siteRaycaster);
  }
  firstRC=false;
}
