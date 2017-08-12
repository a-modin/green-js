import Vector from './vector.js';

class Transport {
  constructor(position, width, height, APP) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.speed = new Vector();
    this.acceleration = new Vector();
    this.APP = APP;
    this.oldPosition = {};
    this.isOnPlatform = null;
    this.collisions = true;
  };

  draw(ctx){
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  };

};

export default Transport;