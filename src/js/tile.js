import tiles from './tiles.json';

class Tile {
  
  constructor(index, position, APP) {
    this.APP = APP;

    this.image = this.APP.images.tiles;
    this.width = this.APP.settings.map.tileSize;
    this.height = this.APP.settings.map.tileSize;
    this.position = position;
    this.index = index;
    this.collision = null;
    this.type = null;

    this.sprite = {
      width: tiles.tiles.width,
      height: tiles.tiles.height
    };

    this.readIndex()

  };

  readIndex () {
    let indexArray = this.index.split('|');
    let type = indexArray[0];

    this.collisions = Number(indexArray[0]);
    this.sprite.x = tiles.tiles.types[type].x * tiles.tiles.width;
    this.sprite.y = tiles.tiles.types[type].y * tiles.tiles.height;
  };

  draw(ctx) {
    if (!this.collisions) {
      return
    };
    
    ctx.drawImage(this.image, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.position.x, this.position.y, this.width, this.height) 
  };

};

export default Tile;
