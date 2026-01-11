import Tile from './tile.js';
import Vector from './vector.js';
import GameMap from './map.js';


class Scene {

  constructor(canvasId, width, height, APP) {
    this.APP = APP;
    this.canvasId = canvasId;

    this.width = this.APP.settings.display.width;
    this.height = this.APP.settings.display.height;

    this.layers = [];

    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.visible = {};

    this.tiles = [];
    this.visible.tiles = [];

    this.characters = [];
    this.visible.characters = [];

    this.elements = [];

    this.transport = [];

    this.bullets = [];

    this.image = new Image();
    this.image.src = 'images/tiles.png';

    this.resize();
  };

  resize () {
    if (this.APP.settings.display.fullscreen === true) {
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';

    } else{
      // this.canvas.style.width = this.APP.settings.display.width + 'px';
      // this.canvas.style.height = this.APP.settings.display.height + 'px';
    };
    
  };

  addCamera (camera) {
    this.camera = camera;
    this.camera.scene = this;
  };

  addLayer(layer) {
    this.layers.push(layer);

    this.layers.sort(function(a, b){
      return a.zIndex - b.zIndex;
    });

    if (layer.type === 'tiles') {
      this.tilesLayer = layer;
    };

    if (layer.type === 'transport') {
      this.transport = this.transport.concat(layer.items);
    };
  };

  drawLayers(){
    for(let layer of this.layers){
      // this.checkVisibleItems(layer);
      layer.draw(this.ctx);
    };
  };

  add(obj) {
    if (Array.isArray(obj) === true) {
      for(var i = 0; i < obj.length; i++){
        this.objects.push(obj[i])
      }
    } else {
      this.objects.push(obj)
    }
  };

  addBullet(bullet){
    this.bullets.push(bullet);
  };

  removeBullet(bullet){
    let index = this.bullets.indexOf(this);
    this.bullets.splice(index, 1);
  };

  bulletsUpdate(){
    for(let bullet of this.bullets){
      bullet.update();
      bullet.draw(this.ctx);
    };    
  };

  clear() {
    // this.ctx.clearRect(this.camera.position.x , this.camera.position.y , this.width + 3000, this.height + 3000);
    this.ctx.clearRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.width, this.camera.scope.height);
    // this.ctx.clearRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.x2, this.camera.scope.y2);

  };

  draw() {
    this.camera.update();
    this.clear();

    this.checkVisibleCharacters();

    // console.log(this.APP.timers.length);
    // this.checkVisibleTiles();

    this.drawLayers()

    // this.drawTiles();
  
    // this.drawElements();
    // this.drawCharacters();
    
    if (this.APP.settings.showCollisionsMap) {
      for(let i = 0; i < this.APP.tilesMap.collisionsMap.length; i++){
        let item =  this.APP.tilesMap.collisionsMap[i];
        this.ctx.strokeRect(item.x, item.y, item.width, item.height);
      }
    };

    if (this.APP.settings.camera.showDeadZone === true) {
      this.ctx.strokeStyle="green";
      this.ctx.strokeRect(this.camera.deadZone.position.x, this.camera.deadZone.position.y, this.camera.deadZone.width, this.camera.deadZone.height);
    };
    
    // this.ctx.strokeRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.x2, this.camera.scope.y2)
    // this.ctx.strokeRect(this.camera.scope.x1, this.camera.scope.y1, this.camera.scope.width, this.camera.scope.height)
  };

  charactersUpdate () {
    for(let character of this.characters){
      // this.visible.characters[character].update();
      character.update();
    };    
  };

  transportUpdate(){
    for(let transport of this.transport){
      // this.visible.characters[character].update();
      transport.update();
    }; 
  };

  addCharacter(character) {
    
    if (character.type === 'player') {
      this.player = character;
    };

    this.characters.push(character);
  };

  drawCharacters() {
    for(let character in this.visible.characters){
      this.drawCharacter(this.visible.characters[character]);
    };
  };

  drawCharacter(character){
    if (this.APP.settings.showPlayerBox === true && character.type === 'player') {
      this.ctx.strokeRect(character.position.x, character.position.y, character.width, character.height);
    };

    character.sprite.update();

    this.ctx.drawImage(character.sprite.image, 
      Math.round(character.sprite.x), 
      Math.round(character.sprite.y), 
      character.sprite.frameWidth, 
      character.sprite.frameHeight, 
      Math.round(character.position.x - (character.sprite.frameWidth - character.width) / 2), 
      Math.round(character.position.y), 
      character.sprite.frameWidth, 
      character.sprite.frameHeight);

    if (character.pupils) {
      this.ctx.fillStyle="black";
      this.ctx.strokeStyle="red";

      // this.ctx.strokeRect(this.player.center.x, this.player.center.y, 2, 2);

      // this.ctx.strokeRect(character.eyes[0].position.x, character.eyes[0].position.y, character.eyes[0].width, character.eyes[0].height);
      // this.ctx.strokeRect(character.eyes[1].position.x, character.eyes[1].position.y, character.eyes[1].width, character.eyes[1].height);

      this.ctx.beginPath();
      this.ctx.arc(character.pupils[0].position.x, character.pupils[0].position.y, character.pupils[0].width, 0, 2*Math.PI, false);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(character.pupils[1].position.x, character.pupils[1].position.y, character.pupils[1].width, 0, 2*Math.PI, false);
      this.ctx.fill();
    }
  };

  // drawTiles() {
  //   for(let tile in this.visible.tiles){
  //     this.drawTile(this.visible.tiles[tile]);
  //   };
  // };

  // drawTile(tile) {
  //   // if (tile.item === 1) {
  //     // this.ctx.fillStyle="blue";
  //     // this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
  //     // this.ctx.drawImage(this.image, tile.x, tile.y, 16, 16);

  //     let _tile = new Tile(tile.item, new Vector(tile.x, tile.y), this.APP);
  //     _tile.draw(this.ctx);
  //   // }
  // };

  // checkVisibleTiles() {
  //   this.visible.tiles = [];
    
  //   for(let tile in this.tiles){
  //     if (this.tiles[tile].x + 100 > this.camera.scope.x1 && 
  //         this.tiles[tile].x - 100 < this.camera.scope.x2 &&
  //         this.tiles[tile].y + 100 > this.camera.scope.y1 &&
  //         this.tiles[tile].y - 100 < this.camera.scope.y2) {        

  //       this.visible.tiles.push(this.tiles[tile]);
  //     };
  //   }
  // };

  checkVisibleCharacters() {

    this.visible.characters = [];
    
    for(let character in this.characters){

      if (this.characters[character].position.x + 100 > this.camera.scope.x1 && 
          this.characters[character].position.x - 100 < this.camera.scope.x2 &&
          this.characters[character].position.y + 100 > this.camera.scope.y1 &&
          this.characters[character].position.y - 100 < this.camera.scope.y2) {        

        this.visible.characters.push(this.characters[character]);
      };
    }
  };

  addElement(element){
    this.elements.push(element);
  };

  drawElements(){
    for(let element in this.elements){
      this.elements[element].draw(this.ctx);
    }

  };

  addMap(map) {
    this.map = map;
    // this.tiles = this.map.getTiles();

    let data = map.getTiles(500);
    this.tilesSectors = data.sectors;
    this.tiles = data.tiles;
  
  };

}

export default Scene;
