class AnimationsChain {

  constructor (target, APP) {
    this.APP = APP;
    this.target = target;
    this.animations = [];
  };

  add (animation) {
    animation.chain = this;
    this.animations.push(animation);
  };

  check(){
    if (this.animations[0]) {
      
      if (this.animations[0].status === 'waiting') {
        this.animations[0].init();
        this.animations[0].check();
      
      } else if(this.animations[0].status === 'isInitialized'){
        this.animations[0].check();
      
      } else if(this.animations[0].status === 'finished') {
        this.animations[0].delete();
      }
    } else{

      this.delete();
    }
  };

  delete(){
    let index = this.APP.animationsChains.indexOf(this);
    this.APP.animationsChains.splice(index, 1);
  };

};

export default AnimationsChain;
