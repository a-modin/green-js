import Character from '../character.js';
import Vector from '../vector.js';
import settings from '../settings.js';

class Cactus extends Character {

  constructor(position, APP) {
    super(position, APP);
    this.width = 45;
    this.height = 45;
    this.type = 'cactus';
    this.date = new Date();
    this.statusSwitcherTimeout = 2000;
    this.offset = {};
    this.eyesStatus = 'lookAtPlayer';
    this.eyes = [

      {
        position: new Vector(),
        width: 6,
        height: 6,
        offset: {
          x: 16,
          y: 12,
        }
      },

      {
        position: new Vector(),
        width: 6,
        height: 6,
        offset: {
          x: 24,
          y: 12,
        }
      }
    ];

    this.pupils = [
      
      {
        position: new Vector(this.eyes[0].position.x, this.eyes[0].position.y),
        width: 1,
        height: 1,
        offset: {
          x: 3,
          y: 2,
        }
      },

      {
        position: new Vector(this.eyes[1].position.x, this.eyes[1].position.y),
        width: 1,
        height: 1,
        offset: {
          x: 11,
          y: 2,
        }
      }
    ];
  };

  statusSwitcher() {
    let date = new Date();

    if (date - this.date > this.statusSwitcherTimeout){

      if (this.eyesStatus === 'lookAtPlayer') {
        this.eyesStatus = false;
        this.APP.get(this.pupils[0].offset).stop().animate({x: 3, y: 2}, 500);
        this.APP.get(this.pupils[1].offset).stop().animate({x: 11, y: 2}, 500);
        this.statusSwitcherTimeout = this.APP.rand_1(300, 1200);

      } else {
        this.eyesStatus = 'lookAtPlayer';
        this.statusSwitcherTimeout = this.APP.rand_1(1500, 4000);
      }

      this.date = new Date();
    }

  };

  update () {
    super.update();
    this.checkCollisions();
    this.statusSwitcher();
    this.pupilsUpdate();

    if (this.eyesStatus === 'lookAtPlayer') {
      this.lookAtPlayer();
    };
  };

  damage(){
    let that = this;
    this.status.damage = true;
    this.APP.get(this.pupils[0].offset).stop().animate({x: 3, y: 2}, 500);
    this.APP.get(this.pupils[1].offset).stop().animate({x: 11, y: 2}, 500);

    this.APP.timeout(function(){
      that.status.damage = false;
    }, 700);
  }



  lookAtPlayer () {
    let player = this.APP.scene.player;

    if (player.center.y > this.eyes[0].position.y && player.center.y < this.eyes[0].position.y + this.eyes[0].height) {
      this.pupils[0].position.y = player.center.y;
      this.pupils[1].position.y = player.center.y;
    
    } else {
      if (player.center.y < this.eyes[0].position.y && this.eyes[0].position.y - player.center.y > 50) {
        this.pupils[0].position.y = this.eyes[0].position.y;
        this.pupils[1].position.y = this.eyes[1].position.y;

      } else if (player.center.y > this.eyes[0].position.y && player.center.y - this.eyes[0].position.y > 50) {
        this.pupils[0].position.y = this.eyes[0].position.y + this.eyes[0].height - 2;
        this.pupils[1].position.y = this.eyes[1].position.y + this.eyes[1].height - 2;
      }
    }

    if (player.center.x > this.eyes[0].position.x && player.center.x < this.eyes[0].position.x + this.eyes[0].width) {
      this.pupils[0].position.y = player.center.y;
      this.pupils[1].position.y = player.center.y;
   
    } else {
      if (player.center.x < this.eyes[0].position.x) {
        this.pupils[0].position.x = this.eyes[0].position.x;
        this.pupils[1].position.x = this.eyes[1].position.x;

      } else if (player.center.x > this.eyes[0].position.x) {
        this.pupils[0].position.x = this.eyes[0].position.x + this.eyes[0].width;
        this.pupils[1].position.x = this.eyes[1].position.x + this.eyes[1].width;
      }
    }
  };

  pupilsUpdate () {
    this.eyes[0].position.x = this.position.x + this.eyes[0].offset.x;
    this.eyes[0].position.y = this.position.y + this.eyes[0].offset.y;

    this.eyes[1].position.x = this.position.x + this.eyes[1].offset.x;
    this.eyes[1].position.y = this.position.y + this.eyes[1].offset.y;

    this.pupils[0].position.x = this.eyes[0].position.x + this.pupils[0].offset.x;
    this.pupils[0].position.y = this.eyes[0].position.y + this.pupils[0].offset.y;

    this.pupils[1].position.x = this.eyes[0].position.x + this.pupils[1].offset.x;
    this.pupils[1].position.y = this.eyes[0].position.y + this.pupils[1].offset.y;
  };

  setStatus () {
    if (this.status.damage) {
      if (this.status.direction === 'left') {
        this.status.animation = 'damageLeft';

      } else if (this.status.direction === 'right') {
        this.status.animation = 'damageRight';
      };
      
      return;
    };

    if (this.acceleration.x === 0 && this.speed.x < 0.5 && this.speed.x > -0.5) {
      
      if (this.status.direction === 'right') {
        this.status.animation = 'standRight';

      } else {
        this.status.animation = 'standLeft';
      };
    };    
  };

  checkCollisions () {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  };

  whenCollision(obj, side){
    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          this.speed.x = 0;
          this.position.x = this.collisionStatus.with.position.x - this.width - 1;
        },

        bottom: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;

          if (this.status.beforeJump !== true) {
            this.status.jump = false;
            this.status.damage = false;
          };
          
          this.position.y = this.collisionStatus.with.position.y - this.height;
        },

        left: () => {
          this.speed.x = 0;
          this.position.x = this.collisionStatus.with.position.x + this.collisionStatus.with.width + 1;
        }
      },

      player: {
        top: () => {
          this.damage();
        },

        right: () => {
          this.damage();
        },

        bottom: () => {
          // ...
        },

        left: () => {
          this.damage();
        }
      },

      oldWoman: {
        top: () => {
          // ...
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
      }

    };

    if (reactions[obj]) {
      reactions[obj][side]();
    }
  };

};

export default Cactus;