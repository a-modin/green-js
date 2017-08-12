import Vector from './vector.js';
import Element from './element.js';
import Layer from './layer.js';
import Cloud from './cloud.js';

class CloudsSystem {

  constructor(scene, APP) {
    this.scene = scene;
    this.APP = APP;
    this.cloudsLayer = new Layer('clouds', 'elements', 0, 'clouds', 0.8, this.APP);
    this.scene.addLayer(this.cloudsLayer);
    this.maxAmount = 700;
  };

  createCloud(position, speed, type) {
    let cloud = new Cloud(position, speed, type, this.cloudsLayer, this.APP);
    this.cloudsLayer.add(cloud);
  };

  cloudGenerate(options){

    let amount = options ? options.amount : this.maxAmount;
    for(let i = 0; i < amount; i++){

      let randX, randY, randPosition, randType, randSpeedX;

      if (!options) {
        randX = this.APP.rand_2(-2000, this.APP.world.width * 8);
        randY = this.APP.rand_2(-2000, this.APP.world.height * 8);
        randPosition = new Vector(randX, randY);

      } else {
        randX = this.APP.rand_2(options.minX, options.maxX);
        randY = this.APP.rand_2(options.minY, options.maxY);
        randPosition = new Vector(randX, randY);
      };

      randSpeedX = this.APP.rand_1(-0.8, -0.2);
      randType = this.APP.rand_2(0, 5);

      this.createCloud(randPosition, new Vector(randSpeedX, 0), randType, this.APP)

    };    
  };

  update(){
    for(let cloud of this.cloudsLayer.items){
      cloud.update();

      if (this.cloudsLayer.items.length < this.maxAmount) {
        this.cloudGenerate({
          amount: this.maxAmount - this.cloudsLayer.items.length,
          minX: this.APP.world.width * 8,
          minY: -1000,
          maxX: this.APP.world.width * 8 + 1000,
          maxY: this.APP.world.height * 8
        });
      };
    }
  };


};

export default CloudsSystem;
