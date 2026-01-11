import Character from '../character.js';
import Vector from '../vector.js';
import settings from '../settings.js';
import Crutch from '../bullets/crutch.js'

class OldWoman extends Character {

  constructor(position, APP) {
    super(position, APP);
    this.width = 48;
    this.height = 48;
    this.type = 'oldWoman';
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

  shoot(direction) {
    let that = this;

    if (this.timerBeforeShoot) {
      this.timerBeforeShoot.delete();
      this.timerBeforeShoot = null;
    };

    if (this.timerAfterShoot) {
      this.timerAfterShoot.delete();
      this.timerAfterShoot = null;
    };

    if (direction === 'left') {
      that.status.animation = 'shootLeft';
      
    } else if(direction === 'right'){
      that.status.animation = 'shootRight';
    };

    this.timerBeforeShoot = this.APP.timeout(function(){
      if (direction === 'left') {
        let bullet = new Crutch(new Vector(that.position.x, that.position.y + 15), 23, 15, new Vector(-5, -1.5), that, that.APP);

      } else if (direction === 'right') {
        let bullet = new Crutch(new Vector(that.position.x + 15, that.position.y + 15), 23, 15, new Vector(5, -1.5), that, that.APP);
      };
    }, 750);

    this.timerAfterShoot = this.APP.timeout(function(){
      if (direction === 'left') {
        that.status.animation = 'agressiveLeft';

      } else if(direction === 'right'){
        that.status.animation = 'agressiveRight';
      };
      
    }, 1500);
  };

  update () {
    if (!this.isDead) {
      this.checkCollisions()
      super.update();

      if (this.aggression) {

        if (this.mode !== 'aggressionMode') {
          this.setAggressionMode();

        } else {
          if (this.timerBeforeExitAgressionMode) {
            this.timerBeforeExitAgressionMode.delete();
            this.timerBeforeExitAgressionMode = null;
          };
        };

      } else if(this.mode !== 'wait' && !this.timerBeforeExitAgressionMode) {
        this.setWaitMode();
      };

      if (this.aggression) {
        this.status.direction = this.aggression;

        if (this.aggression === 'left' && this.status.animation !== 'shootLeft') {
          this.status.animation = 'agressiveLeft';
        
        } else if(this.aggression === 'right' && this.status.animation !== 'shootRight') {
          this.status.animation = 'agressiveRight';
        };

        if (new Date() - this.lastShootTime > this.frequencyOfShots) {
          this.lastShootTime = new Date();
          this.shoot(this.status.direction);
        }
      };

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

  };

  reverse(){
    if (this.collisionStatus.type === 'left') {
      this.status.direction = 'right';
      this.status.animation = 'walkRight';
      this.acceleration.x = 0.1;
    };

    if (this.collisionStatus.type === 'right') {
      this.status.direction = 'left';
      this.status.animation = 'walkLeft';
      this.acceleration.x = -0.1;
    };
  };

  setAggressionMode() {
    this.mode = 'aggressionMode';
    this.acceleration = new Vector(0, 0);
    this.status.directionBeforeAggressive = this.status.direction;
  };

  setWaitMode() {
    if (this.isDead) {
      return
    };

    let that = this;

    this.timerBeforeExitAgressionMode = this.APP.timeout(function(){
      that.mode = 'wait'
      that.status.direction = that.status.directionBeforeAggressive;

      if (that.status.direction === 'left') {
        that.acceleration = new Vector(-0.1, 0);
        that.status.animation = 'walkLeft';
      
      } else if(that.status.direction === 'right'){
        that.acceleration = new Vector(0.1, 0);
        that.status.animation = 'walkRight'
      }
    }, 2000);
    
  };

  die(){
    if (this.timerBeforeShoot || this.timerAfterShoot) {
      this.timerBeforeShoot.delete();
      this.timerAfterShoot.delete();
      this.timerBeforeShoot = null;
      this.timerAfterShoot = null;
    };

    if (this.timerBeforeExitAgressionMode){
      this.timerBeforeExitAgressionMode.delete();
      this.timerBeforeExitAgressionMode = null;
    };    

    this.acceleration.x = 0;
    this.collisions = false;
    this.isDead = true;
    let that = this;
    this.APP.timeout(function(){

      if (that.status.direction === 'left') {
        that.status.animation = "dieLeft";

      } else if(that.status.direction === 'right'){
        that.status.animation = "dieRight";
      };

    }, 10);
  };

  checkCollisions () {
    if (this.collisionStatus) {
      this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
    };
  };

  whenCollision(obj, side){

    if (!obj) {
      return
    };

    let reactions = {

      tile: {
        top: () => {
          this.acceleration.y = 0;
          this.speed.y = 0;
          this.position.y = this.collisionStatus.with.position.y + this.collisionStatus.with.height;
        },

        right: () => {
          // this.speed.x = 0;
          // this.position.x = this.collisionStatus.with.position.x - this.width - 1;
          this.reverse();
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
          // this.speed.x = 0;
          // this.position.x = this.collisionStatus.with.position.x + this.collisionStatus.with.width + 1;
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
          if(this.aggression){
            this.reverse();
          };
        },

        bottom: () => {
          // ...
        },

        left: () => {
          if(this.aggression){
            this.reverse();
          };
        }
      },

      player: {
        top: () => {
          this.die();
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
    };    
    
  };

};

export default OldWoman;