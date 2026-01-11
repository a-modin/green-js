import Transport from '../transport.js';
import Vector from '../vector.js';

class Balloon extends Transport{

  constructor(position, APP) {
    super(position, 300, 440, APP);
    this.maxSpeed = 10;
    this.image = new Image();
    this.image.src = 'images/balloon.png';
    this.type = 'balloon';
    this.zoom = 0.6;
    this.driver = null;
    this.maxSpeed = 6
    
    this.input = {
      position: new Vector(this.position.x + this.width / 2, this.position.y + 400)
    };

    this.driverPlace = {
      position: new Vector(this.position.x + this.width / 2, this.position.y + 530)
    };

    this.status = {
      beforeFlight: false,
    };

    this.deadZoneScale = {
      width: 600,
      height: 500,
    }
  };

  control(pressedKeys, keyDown){
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    if (pressedKeys.indexOf('RIGHT') !== -1 || pressedKeys.indexOf('D') !== -1) {
      this.acceleration.x = 0.01;
    };

    if (pressedKeys.indexOf('LEFT') !== -1 || pressedKeys.indexOf('A') !== -1) {
      this.acceleration.x = -0.01;
    };

    if (pressedKeys.indexOf('TOP') !== -1 || pressedKeys.indexOf('W') !== -1) {
      this.acceleration.y = -0.022;
    };

    if (pressedKeys.indexOf('BOTTOM') !== -1) {
      this.acceleration.y = 0.05;
    };

    if (keyDown === 'CTRL') {
      // this.acceleration.y = 0.01;
    };

    if (keyDown === 'ENTER') {
      this.driver.transportOutput();
    };
  };

  draw(ctx){
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    // ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.fillRect(this.driverPlace.position.x, this.driverPlace.position.y, 10, 10);
  };

  update(){
    this.checkCollisions();
    this.checkOnPlatform();

    const delta = this.APP.engine.deltaTime;

    if (this.acceleration.x === 0) {
      const windageFactor = Math.pow(this.APP.settings.windage + 0.02, delta);
      this.speed.multiply(
        {
          x: windageFactor, 
          y: 1
        }).fixed(7);
    };

    if (this.acceleration.y === 0) {
      if (!this.isOnPlatform) {
        if (this.speed.y < 1) {
          this.speed.y = 0.2;
        }

        const yFactor = Math.pow(0.8, delta);
        this.speed.multiply(
          {
            x: 1, 
            y: yFactor
          }).fixed(7);
      };
      
    };

    this.speed.plus({
      x: this.acceleration.x * delta,
      y: this.acceleration.y * delta
    });

    // Лимит скорости
    if (this.speed.x > this.maxSpeed) {
      this.speed.x = this.maxSpeed;
    };

    if (this.speed.y > 40) {
      this.speed.y = 40;
    };

    if (this.speed.x < -this.maxSpeed) {
      this.speed.x = -this.maxSpeed;
    };

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

    this.position.plus({
      x: this.speed.x * delta,
      y: this.speed.y * delta
    }).fixed(7);

    this.input.position.x = this.position.x + this.width / 2;
    this.input.position.y = this.position.y + 400;

    this.driverPlace.position.x = this.position.x + this.width / 2;
    this.driverPlace.position.y = this.position.y + 370;

    if (this.driver) {
      if (this.acceleration.x > 0) {
        this.driver.status.direction = 'right';

      } else if (this.acceleration.x < 0) {
        this.driver.status.direction = 'left';
      };
    }
  };

  checkOnPlatform(){
    for(let platform of this.APP.tilesMap.collisionsMap){

      if (platform.position.x < this.position.x + this.width &&
          platform.position.x + platform.width > this.position.x &&
          platform.position.y === this.position.y + this.height) {
        
        this.isOnPlatform = true;
        this.platform = platform;

        break;

      } else {
        this.isOnPlatform = false;
        this.platform = null;
      }
    }
  };

  checkCollisions () {
    // if (this.collisionStatus) {
    //   // console.log('balloon', this.collisionStatus);
    //   this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    // };
    if (this.currentCollisions.length !== 0) {
      for(let collision of this.currentCollisions){
        this.whenCollision(collision);
      };
    };
  };

  whenCollision(collision){
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

        },

        bottom: () => {

        },

        left: () => {

        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {

        },

        bottom: () => {

        },

        left: () => {

        }
      },

      crutch: {
        top: () => {

        },

        right: () => {

        },

        bottom: () => {

        },

        left: () => {

        }
      },

      hedgehog: {
        top: () => {

        },

        right: () => {

        },

        bottom: () => {

        },

        left: () => {

        }
      },

      player: {
        top: () => {

        },

        right: () => {

        },

        bottom: () => {

        },

        left: () => {

        }
      }

    };

    // if (reactions[obj]) {
    //   reactions[obj][side]();
    // };
    if (reactions[collision.with.type]) {
      reactions[collision.with.type][collision.type](collision.with);
      if (reactions[collision.with.type]['all']) {
        reactions[collision.with.type]['all'](collision.with);
      }
    };
  };
  
};

export default Balloon;