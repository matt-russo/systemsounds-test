
var Key = {
  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40,
  SPACE:  32,
};

function keyDown(event) {
  // console.log(event.key);
  if ([32,37,38,39,40].indexOf(event.keyCode) > -1) {
    event.preventDefault();
  }

  if (!event) {event = window.event;} // for old IE compatible
  var keycode = event.keyCode || event.which; // also for cross-browser compatible

  switch (keycode) {
    case Key.LEFT:
      var direction =(keycode-38);
      yaw(direction);
      if (started==false) {
        play();
      }
      break;
    case Key.UP:
      var direction = (keycode-39)
      pitch(direction );
      if (started==false) {
        play();
      }
      break;
    case Key.RIGHT:
      var direction =(keycode-38);
      yaw(direction);
      if (started==false) {
        play();
      }
      break;
    case Key.DOWN:
      var direction = (keycode-39)
      pitch(direction);
      if (started==false) {
        play();
      }
      break;
    case Key.SPACE:
    if (started==false) {
      play();
    } else {
      switchMode();}
      break;
    default:
}

}
