import Character from '../character.js';
import Vector from '../vector.js';
import settings from '../settings.js';

class Hedgehog extends Character {

  constructor(position, APP) {
    super(position, APP);
    this.width = 55;
    this.height = 35;
    this.type = 'hedgehog';
    this.date = new Date();
    this.statusSwitcherTimeout = 2000;
    this.offset = {};
    this.acceleration = new Vector(-0.1, 0);
    this.maxSpeed = 1;
    this.isDead = false;
    this.lastShootTime = null;
    this.frequencyOfShots = 2000;

    this.mode = 'wait';

    this.status = {
      damage: false,
      direction: 'left',
      jump: false,
      onPlatform: false,
      run: 'wait',
      animation: null
    };
  };


  update () {

      this.checkCollisions()
      super.update();      

      if (!this.status.animation) {
        this.status.animation = 'walkLeft';
      };

      if (this.nearbyHole === 'left') {
        this.status.direction = 'right';
        this.status.animation = 'walkRight';
        this.acceleration.x = 0.1;

      } else if(this.nearbyHole === 'right'){
        this.status.direction = 'left';

        this.status.animation = 'walkLeft';
        this.acceleration.x = -0.1;
      };
  };

  reverse(){    

    if (this.collisionStatus.type === 'left') {
      this.status.direction = 'right';
      this.status.animation = 'walkRight';
      this.acceleration.x = 0.1;
      this.speed.x = 1;
    };

    if (this.collisionStatus.type === 'right') {
      this.status.direction = 'left';
      this.status.animation = 'walkLeft';
      this.acceleration.x = -0.1;
      this.speed.x = -1;
    };
  };


  checkCollisions () {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  };

  whenCollision(obj, side){

    if (!obj) {
      return;
    };

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y - this.height;
        },

        left: () => {
          this.reverse();
        }
      },

      cactus: {
        top: () => {
          // ...
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.reverse();
        }
      },

      oldWoman: {
        top: () => {
          // ...
        },

        right: () => {
          this.reverse();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.reverse();
        }
      },

      player: {
        top: () => {

        },

        right: () => {
          // ...
        },

        bottom: () => {
          // ...
        },

        left: () => {
          // ...
        }
      },

      hedgehog: {
        top: () => {

        },

        right: () => {
          this.reverse();
        },

        bottom: () => {

        },

        left: () => {
          this.reverse();
        }
      }

    };

    if (!reactions[obj]) {
      return;
    };

    reactions[obj][side]();
  };

};

export default Hedgehog;