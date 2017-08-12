import App from './APP.js';
import Vector from './vector.js';
import keyboard from './keyboard.js';

keyboard.listen(function(pressedKeys, keyDown){
  if (APP.underControl) {
    APP.underControl.control(pressedKeys, keyDown);
  };
  
  

  // pause
  if (keyDown === 'P') {
    if (APP.engine.status === 'active') {
      APP.engine.stop();

    } else if(APP.engine.status === 'inactive'){
      APP.engine.start();  
    };
  };
});

const APP = new App();
APP.init();