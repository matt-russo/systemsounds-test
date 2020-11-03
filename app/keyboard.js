//suppress default behavior for spacebar
window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if ([32].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

function keyPressed() {
  if (keyCode == 32) {
    pauseVideo();
  }
  if (keyCode == 90) {
    makeManual();
    document.getElementById("checkbox").checked = true;
  }
  if (keyCode == 88) {
    makeAutomatic();
    document.getElementById("checkbox").checked = false;
  }
  if (keyCode == 67) {
    slower();
  }
  if (keyCode == 86) {
    faster();
  }
  if (keyCode == 77) {
    makeXray();
  }
  if (keyCode == 78) {
    makeOpt();
  }
}
