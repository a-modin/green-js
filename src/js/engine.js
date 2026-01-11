import collisionsDetector from './collisionsDetector.js';


class Engine {

  constructor(APP) {
    this.status = 'inactive';
    this.APP = APP;
    this.targetFrameTime = 1000 / 60; // 60 FPS as baseline
    this.lastFrameTime = 0;
    this.deltaTime = 1;
  };

  tick(currentTime = 0) {
    const elapsed = currentTime - this.lastFrameTime;
    this.deltaTime = elapsed / this.targetFrameTime;
    
    // Clamp delta to avoid huge jumps (e.g. after tab switch)
    if (this.deltaTime > 3) this.deltaTime = 3;
    if (this.deltaTime < 0.1) this.deltaTime = 0.1;
    
    this.lastFrameTime = currentTime;
    this.APP.checkTimers();
    this.APP.checkAnimationsChains();
    this.APP.checkWatchers();
    this.APP.cloudsSystem.update();

    this.APP.scene.draw();

    let that = this;

    // for(let index in this.APP.scene.characters){
    //   this.APP.scene.characters[index].collisionStatus = null
    // };

    let dynamicObjects = [];
    dynamicObjects = dynamicObjects.concat(this.APP.scene.characters);
    dynamicObjects = dynamicObjects.concat(this.APP.scene.bullets);
    dynamicObjects = dynamicObjects.concat(this.APP.scene.transport);

    for(let dynamicObject of dynamicObjects){
      dynamicObject.collisionStatus = null
      dynamicObject.currentCollisions = [];
    };

    // collisionsDetector.detection(this.APP.scene.characters, this.APP.tilesMap.collisionsMap, function(obj_1, obj_2, type_2, type_1){

    collisionsDetector.detection(dynamicObjects, this.APP.tilesMap.collisionsMap, function(obj_1, obj_2, type_2, type_1){
      if (type_1 === false && type_2 === false) {

      } else{
        if (obj_1.currentCollisions) {

          let unique_1 = true;

          for(let collision of obj_1.currentCollisions){
            if (collision.with === obj_2) {
              unique_1 = false;
              break;
            };
          };

          if (unique_1) {
            obj_1.currentCollisions.push({
              with: obj_2,
              type: type_1,
            });
          };
         
        };



        if (obj_2.currentCollisions) {

          let unique_2 = true;

          for(let collision of obj_2.currentCollisions){
            if (collision.with === obj_1) {
              unique_2 = false;
              break;
            };
          };

          if (unique_2) {
            obj_2.currentCollisions.push({
              with: obj_1,
              type: type_2,
            });
          };

        };


        obj_1.collisionStatus = {
          with: obj_2,
          type: type_1,
        };

        obj_2.collisionStatus = {
          with: obj_1,
          type: type_2,
        };
        
        // if (obj_2.type === 'player') {
        //   console.log(obj_2.currentCollisions);
        // };

      }
    });



    this.APP.scene.bulletsUpdate();
    this.APP.scene.charactersUpdate();
    this.APP.scene.transportUpdate();

    if (this.status === 'active') {
      requestAnimationFrame(this.tick.bind(this));
    };
  };

  start() {
    this.stop();
    this.status = 'active';
    this.tick();
    // this.tick.bind(this)
  };

  stop() {
    this.status = 'inactive';
  };
};

export default Engine;