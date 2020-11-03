//suppress default behavior for spacebar
window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if ([32].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

function keyPressed() {
  if (keyCode == 32 || keyCode==80) {
    pauseVideo();
  }
  if (keyCode == 77) {
    makeManual();
    document.getElementById("checkbox").checked = true;
  }
  if (keyCode == 65) {
    makeAutomatic();
    document.getElementById("checkbox").checked = false;
  }
  if (keyCode == 83) {
    slower();
  }
  if (keyCode == 70) {
    faster();
  }
  if (keyCode == 88) {
    makeXray();
  }
  if (keyCode == 79) {
    makeOpt();
  }
}
