import Vector from './vector.js';
import settings from './settings.js';

class Character {

  constructor(position, APP) {
    this.APP = APP;
    this.position = position;
    this.speed = new Vector();
    this.maxSpeed = 5;
    this.acceleration = new Vector();
    this.width = 16;
    this.height = 64;
    this.oldPosition = new Vector();
    this.timeoutBeforeJump = 100;
    this.center = new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.isOnPlatform = null;
    this.platform = null;
    this.nearbyHole = true;
    this.collisions = true;
    this.aggression = null;

    this.status = {
      damage: false,
      direction: 'right',
      jump: false,
      onPlatform: false,
      run: 'wait'
    };

    this.collisionStatus = null;

  };

  addSprite(sprite) {
    this.sprite = sprite;
    this.sprite.parent = this;
    this.sprite.init();
  };

  damage(direction){
    this.status.damage = true;
    this.status.onPlatform = false;

    let _direction;

    if (direction) {
      _direction = direction;

    } else{
      _direction = this.status.direction;      
    };
 
    if (_direction === 'left') {
      this.position.y -= 10;
      this.speed.y = -15;
      this.speed.x = 15;
    };

    if (_direction === 'right') {
      this.position.y -= 10;
      this.speed.y = -15;
      this.speed.x = -15;
    }

    this.APP.scene.camera.shake();
  };

  checkOnPlatform(){
    for(let platform of this.APP.tilesMap.collisionsMap){

      if (platform.position.x < this.position.x + this.width &&
          platform.position.x + platform.width > this.position.x &&
          platform.position.y === this.position.y + this.height) {
        
        if (!this.status.jump) {
          this.isOnPlatform = true;
          this.platform = platform;

        } else {
          this.isOnPlatform = false;
        }

        break;

      } else {
        this.isOnPlatform = false;
        this.platform = null;
      }
    }
  };

  checkNearbyHole(){
    this.nearbyHole = false;

    if (!this.platform) {
      return;
    };

    if (this.status.direction === 'left'){
      if (this.platform.position.x === this.position.x) {
        this.nearbyHole = 'left';
      };
    };

    if (this.status.direction === 'right'){
      if (this.platform.position.x + this.platform.width === this.position.x + this.width) {
        this.nearbyHole = 'right';
      };
    };
  };

  checkAggression(){
    if(this.type === 'player') {
      return;
    };

    let player = this.APP.scene.player;
    let distance;
    let side;

    if (this.platform === player.platform) {
      if (this.position.x > player.position.x) {
        side = 'left';
        distance = this.position.x - player.position.x;

      } else if (this.position.x < player.position.x) {
        side = 'right';
        distance = player.position.x - this.position.x;
      };

      if (distance < 300) {
        this.aggression = side;

      } else {
        this.aggression = false;
      }
    } else {
      this.aggression = false;
    }

  };

  update () {
    // this.checkCollisions();
    this.checkOnPlatform();
    this.checkNearbyHole();
    this.checkAggression();

    // Включить гравитацию, если игрок в воздухе
    // if (this.status.onPlatform === false
    if (!this.isOnPlatform && !this.isInTransport) {
      this.acceleration.y = settings.gravity;

    } else {
      this.acceleration.y = 0;
      this.speed.y = 0;
    };

    // Если ускорения нет, включить сопротивление воздуха
    if (this.acceleration.x === 0) {
      this.speed.multiply(
        {
          x: settings.windage, 
          y: 1
        }).fixed(2);
    };

    // Ускорение
    this.speed.plus(this.acceleration);

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

    this.setStatus();

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

    // Изменение позиции
    this.position.plus(this.speed).fixed(0);

    this.center.x = this.position.x + this.width / 2
    this.center.y = this.position.y + this.height / 2;
   
  };

  draw(ctx){

    if (this.APP.settings.showPlayerBox === true && this.type === 'player') {
      ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    };

    this.sprite.update();

    ctx.drawImage(this.sprite.image, 
      Math.round(this.sprite.x), 
      Math.round(this.sprite.y), 
      this.sprite.frameWidth, 
      this.sprite.frameHeight, 
      Math.round(this.position.x - (this.sprite.frameWidth - this.width) / 2), 
      Math.round(this.position.y), 
      this.sprite.frameWidth, 
      this.sprite.frameHeight);

    if (this.pupils) {
      ctx.fillStyle="black";
      ctx.strokeStyle="red";

      ctx.beginPath();
      ctx.arc(this.pupils[0].position.x, this.pupils[0].position.y, this.pupils[0].width, 0, 2*Math.PI, false);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.pupils[1].position.x, this.pupils[1].position.y, this.pupils[1].width, 0, 2*Math.PI, false);
      ctx.fill();
    };

    if (this.transport) {
      this.transport.draw(ctx)
    }

  }

  jump () {
    if (this.status.jump === false && this.isOnPlatform) {
      this.status.jump = true;
      this.status.beforeJump = true;
      
      let that = this;

      this.APP.timeout(function(){
        that.status.onPlatform = false;
        that.status.beforeJump = false;
        that.position.y -= 10
        that.speed.y = -15;
      }, that.timeoutBeforeJump);

    };
  };

  spring(val = 15){
    this.status.jump = true;
    this.status.onPlatform = false;
    this.status.beforeJump = false;
    this.position.y -= 10
    this.speed.y = -val;
  };

  setStatus (){};

};

export default Character;