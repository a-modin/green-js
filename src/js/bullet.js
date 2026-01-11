import Vector from './vector.js';
import settings from './settings.js';

class Bullet {
  constructor(position, width, height, speed, shooter, APP) {
    this.position = position;
    this.speed = speed;
    this.APP = APP;
    this.width = width;
    this.height = height;
    this.loss = 1;
    this.APP.scene.addBullet(this);
    this.shooter = shooter;
  };

  update(){
    const delta = this.APP.engine.deltaTime;
    this.position.plus({
      x: this.speed.x * delta,
      y: this.speed.y * delta
    }).fixed(0);
  };

  draw(ctx){
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  };

  delete(){
    this.APP.scene.removeBullet(this);
  };

};

export default Bullet;