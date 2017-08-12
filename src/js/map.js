import settings from './settings.js';
import Vector from './vector.js';

class GameMap {
  
  constructor(data, APP) {
    this.APP = APP;
    this.data = data;
    this.tileSize = settings.map.tileSize;

    this.collisionsData = this.combine();
    this.collisionsMap = this.generateCollisionsMap();

    this.sectors = {};
    this.sectorsArr = [];
    
  };

  combine() {
    let collisionsData = [];

    for (let item in this.data){
      collisionsData[item] = [...this.data[item]];

      for(var i = 0; i < collisionsData[item].length; i++){
        if (Number(collisionsData[item][i].split('|')[1]) !== 0) {
          collisionsData[item][i] = 1;

        } else if (Number(collisionsData[item][i].split('|')[1]) === 0){
          collisionsData[item][i] = 0;
        };
      };
    };

    let prevItem = null;

    for(let rowIndex in collisionsData){
      prevItem = null;

      let row = collisionsData[rowIndex];
      
      for(var i = 0; i < row.length; i++){
        let item = row[i];
        

        if(item === 1 && prevItem !== 1){
          prevItem = 1;

        } else if (item === 1 && prevItem === 1) {
          row[i - 1] += 1;
          row.splice(i, 1);
          i--;

        } else if(item !== 1){
          prevItem = 0;
        }
      };
    };

    return collisionsData;
  };

  drawTile(ctx, type, adress) {
    if (settings.schematicalView) {
      ctx.strokeRect(adress.x, adress.y, this.tileSize, this.tileSize);
    } else{
      ctx.fillRect(adress.x, adress.y, this.tileSize, this.tileSize);
    }
  };

  getTiles(sectorSize) {
    let that = this;
    let adress = {};

    let tiles = [];

    adress.x = -that.tileSize;
    adress.y = -that.tileSize;

    this.data.forEach(function(item){
      adress.x = -that.tileSize;
      adress.y += that.tileSize;

     
      item.forEach(function (item, i, arr) {
        adress.x += that.tileSize;

        let tile = {};
        tile.x = adress.x;
        tile.y = adress.y;

        tile.position = new Vector(adress.x, adress.y);

        tile.type = 'tile';

        tile.width = that.tileSize;
        tile.height = that.tileSize;
        tile.item = item;

        tiles.push(tile);

        that.sectorize(tile, sectorSize);

      })

    });

    let sectors = [];

    for(let p in this.sectors){
      let sector = {};
      sector.position = {};
      
      sector.items = this.sectors[p];
      sector.position.x = this.sectors[p][0].sector.x;
      sector.position.y = this.sectors[p][0].sector.y;
      sector.size = sectorSize;

      sectors.push(sector);
    };

    let data = {
      sectors: sectors,
      tiles: tiles 
    };

    return data;
  };

  sectorize(tile, sectorSize){
    let floor = function(val, k){
      return Math.floor(val/k)*k;
    };

    let keyX = floor(tile.position.x, sectorSize);
    let keyY = floor(tile.position.y, sectorSize);

    let key = keyX + 'x' + keyY;

    tile.sector = {};
    tile.sector.x = keyX;
    tile.sector.y = keyY;

    if (this.sectors[key]) {
      this.sectors[key].push(tile);

    } else {
      this.sectors[key] = [];
      this.sectors[key].push(tile)
    };

  };

  drawMap(ctx, scene) {
    var that = this;
    scene.visibleTiles = [];

    var adress = {};
    adress.x = 0;
    adress.y = 0;

    this.data.forEach(function(item){
      adress.x = 0;
      adress.y += that.tileSize;
      
      item.forEach(function (item, i, arr) {
        adress.x += that.tileSize;

        let tile = {};
        tile.x = adress.x;
        tile.y = adress.y;
        tile.width = that.tileSize;
        tile.height = that.tileSize;

        tile.visible = that.checkVisibleTiles(tile, scene.camera);

        if (tile.visible === true) {

          if (item === 1) {
            scene.visibleTiles.push(tile);
            that.drawTile(ctx, 10, adress);
          }

        };

      })

    });
  };

  // generateCollisionsMap() {
  //   let that = this;
  //   let tilesCollision = [];
  //   let prevItem = null;
  //   let adress = {};

  //   adress.x = 0;
  //   adress.y = 0;
    
  //   this.collisionsData.forEach(function(item){

  //     prevItem = null;
      
  //     adress.x = 0;
  //     adress.y += that.tileSize;
      
  //     item.forEach(function (item, i, arr) {

  //       if (prevItem) {
  //         adress.x += that.tileSize * prevItem;

  //       } else {
  //         adress.x += that.tileSize;
  //       }

  //       var tile = {};
  //       tile.x = adress.x;
  //       tile.y = adress.y;

  //       tile.type = 'tile';

  //       tile.position = new Vector(adress.x, adress.y);

  //       if (item === 0) {
  //         tile.width = that.tileSize;

  //       } else{
  //         tile.width = that.tileSize * item;
  //       }

  //       tile.height = that.tileSize;

  //       if (item !== 0) {
  //         tilesCollision.push(tile);
  //       }
        
  //       prevItem = item;
  //     })
  //   })

  //   return tilesCollision;
  // };

  generateCollisionsMap() {
    let that = this;
    let tilesCollision = [];
    let prevItem = null;
    let adress = {};

    adress.x = -that.tileSize;
    adress.y = -that.tileSize;
    
    this.collisionsData.forEach(function(item){

      prevItem = null;
      
      adress.x = -that.tileSize;
      adress.y += that.tileSize;
      
      item.forEach(function (item, i, arr) {

        if (prevItem) {
          adress.x += that.tileSize * prevItem;

        } else {
          adress.x += that.tileSize;
        }

        var tile = {};
        tile.x = adress.x;
        tile.y = adress.y;

        tile.type = 'tile';

        tile.position = new Vector(adress.x, adress.y);

        if (item === 0) {
          tile.width = that.tileSize;

        } else{
          tile.width = that.tileSize * item;
        }

        tile.height = that.tileSize;

        if (item !== 0) {
          tilesCollision.push(tile);
        }
        
        prevItem = item;
      })

    })

    return tilesCollision;
  };

  checkVisibleTiles(tile, camera) {
    if (tile.x + 100 > camera.getScope().x1 && 
      tile.x - 100 < camera.getScope().x2 &&
      tile.y + 100 > camera.getScope().y1 &&
      tile.y - 100 < camera.getScope().y2) {
      return true;

    } else{
      return false;
    }

  };

};

export default GameMap;