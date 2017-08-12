import Character from '../character.js';
import Vector from '../vector.js';
import settings from '../settings.js';

class Player extends Character {

  constructor(position, APP) {
    super(position, APP);
    this.type = 'player';
    this.maxSpeed = 4;
    this.defaultMaxSpeed = 4;
    this.nearbyTransport = null;
    this.transport = null;
    this.isInTransport = false;
    this.width = 16;
    this.height = 64;
    this.isGoingTo = null;
    this.deadZoneScale = {
      width: 200,
      height: 150,
    }
  };

  control(pressedKeys, keyDown){
    this.acceleration.x = 0;

    if (pressedKeys.indexOf('RIGHT') != -1 || pressedKeys.indexOf('D') != -1) {
      this.acceleration.x = 0.2;
    };

    if (pressedKeys.indexOf('LEFT') != -1 || pressedKeys.indexOf('A') != -1) {
      this.acceleration.x = -0.2;
    };

    if (keyDown === 'TOP' || pressedKeys.indexOf('W') != -1 || pressedKeys.indexOf('SPACE') != -1) {
      this.jump();
    };

    if (keyDown === 'CTRL') {

    };

    if (keyDown === 'ENTER') {
      if (!this.transport) {
        this.goToTransport();

      } else {
        this.transportOutput();
      }
    };
  }

  setStatus () {
    if (this.status.damage) {
      if (this.status.direction === 'left') {
        this.status.animation = 'damageLeft';

      } else if (this.status.direction === 'right') {
        this.status.animation = 'damageRight';
      };
      
      return;
    };

    if (this.speed.x > 0 && this.acceleration.x > 0) {
      this.status.direction = 'right';
    
      if (this.speed.x < 4) {
        this.status.animation = 'walkRight';

      } else{
        this.status.animation = 'runRight'
      };
    };

    if (this.speed.x < 0 && this.acceleration.x < 0) {
      this.status.direction = 'left';
      
      if (this.speed.x > -4) {
        this.status.animation = 'walkLeft';

      } else {
        this.status.animation = 'runLeft';
      };
    };

    if (this.speed.x > 0 && this.acceleration.x < 0) {      
      this.status.animation = 'rightAndBrake';
    };

    if (this.speed.x < 0 && this.acceleration.x > 0) {      
      this.status.animation = 'leftAndBrake';
    };

    if (this.speed.x > 0.5 && this.acceleration.x === 0) {
      this.status.animation = 'walkRight';
    };

    if (this.speed.x < -0.5 && this.acceleration.x === 0) {
      this.status.animation = 'walkLeft';
    };

    if (this.acceleration.x === 0 && this.speed.x < 0.5 && this.speed.x > -0.5) {
      
      if (this.status.direction === 'right') {
        this.status.animation = 'standRight';

      } else {
        this.status.animation = 'standLeft';
      };
    };
    
    if (this.status.jump === true) {
      if (this.status.direction === 'right') {
        this.status.animation = 'jumpRight';
      };

      if (this.status.direction === 'left') {
        this.status.animation = 'jumpLeft';
      }
    };

    if (this.status.jump === false && this.isOnPlatform === false && !this.isInTransport) {
      if (this.status.direction === 'right') {
        this.status.animation = 'jumpRight';
      };

      if (this.status.direction === 'left') {
        this.status.animation = 'jumpLeft';
      }
    };
  };

  goTo(target, speed, callback) {
    this.isGoingTo = {
      target: target,
      speed: speed,
      callback: callback
    };
  };

  goToTransport() {
    if (!this.nearbyTransport) {
      return;
    };

    this.transport = this.nearbyTransport;

    this.goTo(this.transport.input, 2, () => {
      this.isGoingTo = null;
      this.transportInput();
    });
  };

  goToUpdate(){
    if (this.isGoingTo) {
      let target = this.isGoingTo.target;
      this.maxSpeed = this.isGoingTo.speed;

      if (target.position.x - this.position.x > this.width / 2 + 1) {
        this.acceleration.x = 0.2;

      } else if(this.position.x - target.position.x > -(this.width / 2 - 1)){
        this.acceleration.x = -0.2;

      } else {
        this.acceleration.x = 0;
        this.speed.x = 0;
        this.maxSpeed = this.defaultMaxSpeed;
        this.isGoingTo.callback();
      }
    };
  };



  transportInput(){

    if (!this.nearbyTransport) {
      return;
    };

    this.collisions = false;
    this.nearbyTransport = null;
    this.APP.camera.bindTo(this.transport);
    this.isInTransport = true;
    this.transport.driver = this;

    this.APP.underControl = this.transport;

    // this.APP.get(this.APP.camera).animate({offsetY: this.APP.camera.offsetY - 100}, 2000)
    this.APP.get(this.APP.scene.camera).stop().animate({
      zoom: this.transport.zoom,
      // offsetX: this.APP.camera.offsetY - 200,
      // offsetY: this.APP.camera.offsetY - 300
    }, 500);

  };


  transportOutput(){
    if (!this.transport) {
      return;
    };

    this.collisions = true;
    this.APP.underControl = this;
    this.transport.driver = null;
    this.transport = null;
    this.APP.camera.bindTo(this);
    this.isInTransport = false;
    
    // this.APP.get(this.APP.scene.camera).animate({zoom: 1}, 2000)
    this.APP.get(this.APP.scene.camera).stop().animate({
      zoom: 1,
      // offsetX: this.APP.camera.offsetY + 200,
      // offsetY: this.APP.camera.offsetY + 300
    }, 500);
  };

  checkCollisions () {
    if (this.currentCollisions.length !== 0) {
      for(let collision of this.currentCollisions){
        this.whenCollision(collision);
      };
    };
  };

  whenCollision(collision) {   

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = collision.with.position.y + collision.with.height;
        },

        right: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x - this.width - 1;
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          if (this.status.beforeJump !== true) {
            this.status.jump = false;
            this.status.damage = false;
          };
          
          this.position.y = collision.with.position.y - this.height;
        },

        left: () => {
          this.speed.x = 0;
          this.position.x = collision.with.position.x + collision.with.width + 1;
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {
          this.status.direction = 'right';
          this.damage();
        },

        bottom: () => {
          this.status.direction = 'left';
          this.damage();
        },

        left: () => {
          this.status.direction = 'left';
          this.damage();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          this.status.direction = 'right';
          this.damage();
        },

        bottom: () => {
          this.spring(10);
        },

        left: () => {
          this.status.direction = 'left';
          this.damage();
        }
      },

      crutch: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage('right');
        },

        bottom: () => {
          this.damage();
        },

        left: () => {
          this.damage('left');
        }
      },

      hedgehog: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage('right');
        },

        bottom: () => {
          this.damage();
        },

        left: () => {
          this.damage('left');
        }
      },

      balloon: {
        top: (obj) => {
          
        },

        right: (obj) => {
          
        },

        bottom: (obj) => {
          
        },

        left: (obj) => {
          
        },

        all: (obj) => {
          if (this.platform === obj.platform) {
            this.nearbyTransport = obj;
          };
        }
      },

    };

    if (reactions[collision.with.type]) {
      reactions[collision.with.type][collision.type](collision.with);
      if (reactions[collision.with.type]['all']) {
        reactions[collision.with.type]['all'](collision.with);
      }
    };

    
  };

  update(){
    this.nearbyTransport = null;
    this.checkCollisions();
    super.update();
    this.goToUpdate();
    if (this.isInTransport) {
      this.position.x = this.transport.driverPlace.position.x - this.width / 2;
      this.position.y = this.transport.driverPlace.position.y;
    }
  };

};

export default Player;