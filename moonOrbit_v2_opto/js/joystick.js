var gamepadAPI = {
  controller: {},
  turbo: false,
  connect: function() {},
  disconnect: function() {},
  update: function() {},
  buttonPressed: function() {},
  buttons: [],
  buttonsCache: [],
  buttonsStatus: [],
  axesStatus: []
};


var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var gamepad1 = null;

function connecthandler(e) {
  addgamepad(e.gamepad);
}


function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gamepad.index, gamepad.id,
    gamepad.buttons.length, gamepad.axes.length);
  console.log(gamepad.buttons,gamepad.axes);
}



function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {

    var gp = navigator.getGamepads()[0];
    if (gp) {
      var a = gp.axes;
      yaw(a[0]);
      pitch(-a[1]);

      if (started==false && (a[0]==1 || a[0]==-1 || a[1]==1 || a[1]==-1)){
        play();
      }
    }
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}
