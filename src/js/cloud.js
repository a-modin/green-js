import Vector from './vector.js';
import settings from './settings.js';
import Element from './element.js';

class Cloud extends Element {
  constructor(position, speed, type, layer, APP) {
    super('./images/clouds.png', 'cloud', 600, 250, position, new Vector(0, 0), APP);
    this.speed = speed;
    this.layer = layer;
    this.localPosition.y = type * 250;
  };

  update(){
    const delta = this.APP.engine.deltaTime;
    this.position.plus({
      x: this.speed.x * delta,
      y: this.speed.y * delta
    }).fixed(1);
    if (this.position.x < -2000) {
      this.delete();
    };
  };

  delete(){
    let index = this.layer.items.indexOf(this);
    if (index !== -1) {
      this.layer.items.splice(index, 1);
    };
  };

  // draw(ctx){
  //   ctx.drawImage(this.image, 0, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height)
  // };
};

export default Cloud;