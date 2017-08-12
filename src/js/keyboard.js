const KEYS = {
  13: 'ENTER',

  37: 'LEFT',
  38: 'TOP',
  39: 'RIGHT',
  40: 'BOTTOM',

  65: 'A',
  87: 'W',
  68: 'D',
  83: 'S',

  80: 'P',

  17: 'CTRL',
  32: 'SPACE',
};

let pressedKeys = [];

let keyboard = {

  listen: (callback) => {
    document.addEventListener ('keydown', function(event) {
      if (KEYS[event.keyCode] != undefined && pressedKeys.indexOf(KEYS[event.keyCode]) === -1) {
        pressedKeys.push(KEYS[event.keyCode]);
        callback(pressedKeys, KEYS[event.keyCode]);
      };
    });

    document.addEventListener('keyup', function(event) {
      if (KEYS[event.keyCode] != undefined) {
        pressedKeys.splice(pressedKeys.indexOf(KEYS[event.keyCode]), 1);
        callback(pressedKeys);
      };
    })
  }
}

export default keyboard;
