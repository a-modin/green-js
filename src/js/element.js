import Vector from './vector.js';


class Element {
  
  constructor(file, name, width, height, globalPosition, localPosition, APP) {
    this.APP = APP;

    this.file = file;
    this.width = width;
    this.height = height;
    this.globalPosition = globalPosition;
    this.position = globalPosition;
    this.localPosition = localPosition;
    this.image = new Image();
    this.image.src = this.file;

    this.parallaxOffset = {
      x: 0,
      y: 0
    };
    
    this.new = true;

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    this.name = name;

    let that = this;

    this.loaded = false;

    if (this.name !== 'cloud') {
      this.image.onload = function(){
        that.data = that.APP.prerender.getData(that.image, that.localPosition.x, that.localPosition.y, that.width, that.height, 0, 0, that.width, that.height);
        that.backData = that.APP.prerender.filter(that.data, 'fog', 0.5);
        that.backData2 = that.APP.prerender.filter(that.data, 'fog', 0.8);
        that.frontData2 = that.APP.prerender.filter(that.data, 'brightness', -0.3);
        that.loaded = true;
      };
    } else{
      this.loaded = true;
    };
  };


  draw(ctx) {
    if(!this.loaded){
      return;
    }

    let k = this.layer.parallax;

    if (k > 0.9) {
      k = 0.9;

    } else if (k < 0) {
      k = 0;
    };

    let cameraCenterX = this.APP.camera.position.x + this.APP.scene.width / 2;
    let cameraCenterY = this.APP.camera.position.y + this.APP.scene.height / 2;

    this.parallaxOffset.x = (cameraCenterX - this.center.x) * k
    this.parallaxOffset.y = (cameraCenterY - this.center.y) * k

    if (this.new) {
      // this.position.x -= this.parallaxOffset.x;
      // this.position.y -= this.parallaxOffset.y;
    };

    this.positionWithOffset = {
      x: this.position.x + this.parallaxOffset.x,
      y: this.position.y + this.parallaxOffset.y
    };

    if (this.layer.zType === 'back-2') {
      this.APP.prerender.draw(this.backData2, this.positionWithOffset);
    };

    if (this.layer.zType === 'back') {
      this.APP.prerender.draw(this.backData, this.positionWithOffset);
    };

    if (this.layer.zType === 'middle') {
      ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
    };

    if (this.layer.zType === 'front') {
      ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
    };

    if (this.layer.zType === 'front-2') {
      this.APP.prerender.draw(this.frontData2, this.positionWithOffset);
    };

    if (this.layer.zType === 'clouds') {
      ctx.drawImage(this.image, this.localPosition.x, this.localPosition.y, this.width, this.height, this.positionWithOffset.x, this.positionWithOffset.y, this.width, this.height);
    };

    this.new = false;
    
  };


};

export default Element;
