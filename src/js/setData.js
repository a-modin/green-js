import elements from './elements.json';
import Layer from './layer.js';
import Vector from './vector.js';
import Element from './element.js';
import GameMap from './map.js';

let arrayToObject = function(array, key) {
  let obj = {};

  for(let item of array){
    let _key = item[key];
    obj[_key] = item;
  }

  return obj;
};


let setData = function(data, APP) {

  let elementsInfo = arrayToObject(elements, 'name');

  APP.scene.layers = [];

  for(let layer of data.layers){
    if (layer.type === 'elements') {
      let _layer = new Layer(layer.name, layer.type, layer.zIndex, layer.zType, layer.parallax, APP);

      for(let element of layer.items){
        let info = elementsInfo[element.name];
        let _element = new Element(info.image, element.name, info.width, info.height, new Vector(element.position.x, element.position.y), new Vector(info.coords.x, info.coords.y), APP);

        _layer.add(_element);
      };

      _layer.sectorize(500);

      APP.scene.addLayer(_layer);
    };


    if (layer.type === 'tiles') {
      let _layer = new Layer(layer.name, layer.type, layer.zIndex, layer.zType, layer.parallax, APP);
      APP.tilesMap = new GameMap(layer.items, APP);
      let data = APP.tilesMap.getTiles(500);
      let tilesSectors = data.sectors;

      let maxX = 0;
      let maxY = 0;

      for(let tile of data.tiles){
        if (tile.position.x > maxX) {
          maxX = tile.position.x + tile.width;
        };

        if (tile.position.y > maxY) {
          maxY = tile.position.y + tile.height;
        };
      };

      APP.world.width = maxX;
      APP.world.height = maxY;



//       APP.world.width = tilesSectors[tilesSectors.length - 1].position.x + 500
//       APP.world.height = tilesSectors[tilesSectors.length - 1].position.y + 500
// console.log(APP.world);
      let tiles = data.tiles;
      _layer.sectors = tilesSectors;
      _layer.items = tiles;

      APP.scene.addLayer(_layer);
    };

    APP.currentLayer = APP.scene.layers[0];
  }

  APP.scene.camera.position.x = 0;   
  APP.scene.camera.position.y = 0;   
};

export default setData;