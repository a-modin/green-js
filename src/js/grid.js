import Vector from './vector.js';

class Grid {
  constructor(position, width, height, speed, shooter, APP) {
    this.visible = true;
    this.step = 10;
    this.APP = APP;
  };

  draw(ctx){
    ctx.fillRect(0, 0, 100, 100)
  };

};

export default Grid;