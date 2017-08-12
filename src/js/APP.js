import Watcher from './watcher.js';
import settings from './settings.js';
import Grid from './grid.js';
import keyboard from './keyboard.js';
import Vector from './vector.js';
import Scene from './scene.js';
import Camera from './camera.js';
import GameMap from './map.js';
import Character from './character.js';
import Player from './characters/player.js';
import Cactus from './characters/cactus.js';
import OldWoman from './characters/oldWoman.js';
import Hedgehog from './characters/hedgehog.js';
import Balloon from './transport/balloon.js';
import Sprite from './sprite.js';
import Prerender from './prerender.js';
import collisionsDetector from './collisionsDetector.js';
import Engine from './engine.js';
import GamePad from './gamepad.js';
import Timer from './timer.js';
import Animation from './animation.js';
import AnimationsChain from './animationsChain.js';
import Tile from './tile.js';
import Element from './element.js';
import Bullet from './bullet.js';
import Layer from './layer.js';
import Cloud from './cloud.js';
import CloudsSystem from './cloudsSystem.js';

import sprites from './sprites.json';
import tiles from './tiles.json';

import level from './level.json';
import arrayToObject from './arrayToObject.js';
import elements from './elements.json';
import defaultLayers from './defaultLayers.json';
import setData from './setData.js';

class App {

  constructor () {
    this.settings = settings;
    this.watchers = [];
    this.timers = [];
    this.animationsChains = [];
    this.world = {};

    this.underControl = null;

    this.screen = {};

    this.screen.width = window.screen.width;
    this.screen.height = window.screen.height;
    this.screen.k = Math.max(window.screen.width, window.screen.height) / Math.min(window.screen.width, window.screen.height);

    this.settings.display.k = Math.max(this.settings.display.width, this.settings.display.height) / Math.min(this.settings.display.width, this.settings.display.height);

    this.images = {};

  };

  imagesInit(){
    let image = new Image();
    image.src = tiles.tiles.image;
    this.images.tiles = image;
  };

  fullScreen(){
    let elem = document.getElementById("ctx");
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();

    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();

    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    };

    this.settings.display.fullscreen = true;
    this.scene.resize();
  };

  init() {
    let that = this;

    this.grid = new Grid(this);

    window.onresize = function () {
      if (that.settings.display.fullscreen === true) {
        that.scene.resize(window.innerWidth, window.innerHeight);
      };
    };

    this.imagesInit();

    this.engine = new Engine(this);

    this.camera = new Camera(new Vector(0, 0), this);
    this.scene = new Scene('ctx', this.settings.display.width, this.settings.display.height, this);
    this.prerender = new Prerender(this);
    
    this.player = new Player(new Vector(100, 1300), this);
    // this.player = new Player(new Vector(3250, 520), this);
    this.playerSprite = new Sprite(sprites.player, this);
    
    this.player.addSprite(this.playerSprite);
    this.scene.addCamera(this.camera);

    this.underControl = this.player;

    setData(level.data, this);

    let charactersLayer = new Layer('characters', 'characters', 7, null, 0, this);

    this.cactusSprite = new Sprite(sprites.cactus, this);
    this.cactus = new Cactus(new Vector(330, 1400), this)    
    this.cactus.addSprite(this.cactusSprite);
    this.scene.addCharacter(this.cactus);
    
    this.womanSprite = new Sprite(sprites.oldWoman, this);
    this.woman = new OldWoman(new Vector(1400, 1400), this);
    this.woman.addSprite(this.womanSprite);
    this.scene.addCharacter(this.woman);

    this.womanSprite2 = new Sprite(sprites.oldWoman, this);
    this.woman2 = new OldWoman(new Vector(2500, 1400), this);
    this.woman2.addSprite(this.womanSprite2);
    this.scene.addCharacter(this.woman2);

    this.womanSprite3 = new Sprite(sprites.oldWoman, this);
    this.woman3 = new OldWoman(new Vector(3200, 1300), this);
    this.woman3.addSprite(this.womanSprite3);
    this.scene.addCharacter(this.woman3);

    this.hedgehogSprite = new Sprite(sprites.hedgehog, this);
    this.hedgehog = new Hedgehog(new Vector(1500, 1400), this);
    this.hedgehog.addSprite(this.hedgehogSprite);
    this.scene.addCharacter(this.hedgehog);

    this.hedgehogSprite2 = new Sprite(sprites.hedgehog, this);
    this.hedgehog2 = new Hedgehog(new Vector(1900, 1400), this);
    this.hedgehog2.addSprite(this.hedgehogSprite2);
    this.scene.addCharacter(this.hedgehog2);

    charactersLayer.add(this.player);
    charactersLayer.add(this.cactus);
    charactersLayer.add(this.woman);
    charactersLayer.add(this.woman2);
    charactersLayer.add(this.woman3);
    charactersLayer.add(this.hedgehog);
    charactersLayer.add(this.hedgehog2);

    let transportLayer = new Layer('transport', 'transport', 6, null, 0, this);

    let balloon = new Balloon(new Vector(1300, 1350), this);
    transportLayer.add(balloon);
    this.scene.addLayer(transportLayer);

    this.cloudsSystem = new CloudsSystem(this.scene, this);
    this.cloudsSystem.cloudGenerate()

    this.scene.addLayer(charactersLayer);
    this.scene.addCharacter(this.player);
    this.scene.camera.bindTo(this.player);

    let elementsInfo = arrayToObject(elements, 'name')

    this.engine.start();
  };

  get (obj) {
    obj.animate = function(props, duration){

      let animation = new Animation(obj, props, duration, this);
      let chainsWithThisTarget = this.searchByProp(this.animationsChains, 'target', obj);

      if (chainsWithThisTarget[0] === undefined) {

        let animationsChain = new AnimationsChain(obj, this);
        animationsChain.add(animation);
        this.animationsChains.push(animationsChain);
      
      } else {
        chainsWithThisTarget[0].add(animation);
      };

      return obj;

    }.bind(this);

    obj.stop = function(){
      let chainsWithThisTarget = this.searchByProp(this.animationsChains, 'target', obj)[0];
      if (chainsWithThisTarget) {
        chainsWithThisTarget.delete();
      }
      return obj;

    }.bind(this);

    return obj;
  };

  checkAnimationsChains (){
    for(let chain in this.animationsChains){
      this.animationsChains[chain].check();
    };
  };

  checkWatchers (){
    for(let watcher in this.watchers){
      this.watchers[watcher].check();
    };
  };

  watch (obj, key, callback) {
    let watcher = new Watcher(obj, key, callback);
    this.watchers.push(watcher);
  };

  timeout (func, delay){
    let timer = new Timer(func, delay, false, this);
    this.timers.push(timer);
    return timer;
  };

  interval (func, delay){
    let timer = new Timer(func, delay, true, this);
    this.timers.push(timer);
    return timer;
  };

  checkTimers () {
    for(let timer of this.timers){
      timer.check();
    }
  };

  searchByProp (arr, key, val) {
    let result = [];

    for(let item in arr){
      if (arr[item][key] === val) {
        result.push(arr[item]);
      }
    };

    return result;
  };

  rand_1 (min, max){
    return Math.random() * (max - min) + min;
  };

  rand_2 (min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  unique(arr) {
    if (!arr) {
      return;
    };

    let uniqueArr = [];
    for(let element of arr){
      if (uniqueArr.indexOf(element) === -1) {
        uniqueArr.push(element);
      };
    };

    return uniqueArr;
  };

};

export default App;