import Vector from './vector.js';

class Camera {

  constructor(position = new Vector(), APP) {
    this.APP = APP;
    this.position = position;
    this.oldPosition = new Vector(0, 0);
    this.objBind = false;
    this.offsetX = ((this.APP.settings.display.width - this.APP.settings.camera.deadZone.width) / 2) * -1,
    this.offsetY = -300;
    this.shakeOffset = {
      x: 0,
      y: 0,
    };

    this.oldZoom = null;
    this.zoom = 1;

    this.zoomOffset = {
      x: 0,
      y: 0
    };

    this.oldZoomOffset = {
      x: 0,
      y: 0
    };

    this.translate = {
      x: 0,
      y: 0
    };

    this.scope = {};

    this.deadZone = {
      width: this.APP.settings.camera.deadZone.width,
      height: this.APP.settings.camera.deadZone.height,
      position: new Vector(0, 0),
    };

  };

  setPosition(position) {
    this.position = position;
  };

  shake () {

    let randomShake = () => {
      return this.APP.rand_1(-15, 15)
    };

    let randomTime = () => {
      return this.APP.rand_1(20, 70)
    };

    this.APP.get(this.shakeOffset)
      .stop()
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: this.shakeOffset.x + randomShake(), y: this.shakeOffset.y + randomShake()}, randomTime())
      .animate({x: 0, y: 0}, 500)
  };

  getScope() {
    
    this.scope.x1 = this.position.x - 300;
    this.scope.y1 = this.position.y - 300;
     
    this.scope.x2 = this.position.x + this.APP.scene.width / this.zoom + 300;
    this.scope.y2 = this.position.y + this.APP.scene.height / this.zoom + 300;  

    this.scope.width = this.scope.x2 - this.scope.x1;
    this.scope.height = this.scope.y2 - this.scope.y1;

    return this.scope;
  }

  deadZoneUpdate() {
    if (this.deadZone.position.x + this.deadZone.width < this.objBind.position.x + this.objBind.width) {
      this.deadZone.position.x = this.objBind.position.x - (this.deadZone.width - this.objBind.width);
      this.offsetAnimation('horizontal', -100, 12);
    };

    if (this.deadZone.position.x > this.objBind.position.x) {
      this.deadZone.position.x = this.objBind.position.x;
      this.offsetAnimation('horizontal', -700, 12);
    };

    if (this.deadZone.position.y > this.objBind.position.y) {
      this.deadZone.position.y = this.objBind.position.y;
      this.offsetAnimation('vertical', -300, 6);
    };

    if (this.deadZone.position.y + this.deadZone.height < this.objBind.position.y + this.objBind.height) {
      this.deadZone.position.y = this.objBind.position.y - (this.deadZone.height - this.objBind.height);
      this.offsetAnimation('vertical', 0, 6);
    };
  };

  update() {
    this.getScope();
   
    if (this.objBind !== false) {
      this.deadZoneUpdate();      
    };

    this.position.x = this.deadZone.position.x + this.offsetX + this.shakeOffset.x;
    this.position.y = this.deadZone.position.y + this.offsetY + this.shakeOffset.y - 100;

    this.position.fixed();

    let translateX = (this.position.x - this.oldPosition.x)
    let translateY = (this.position.y - this.oldPosition.y)

    this.scene.ctx.translate(-translateX, -translateY);

    if (this.zoom !== this.oldZoom) {
      this.setZoom();
      this.oldZoom = this.zoom;
    };

    // this.translate.x += -translateX * this.zoom;
    // this.translate.y += -translateY * this.zoom;

    this.translate.x += translateX;
    this.translate.y += translateY;

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

  };

  setZoom(){
    this.scene.ctx.translate(this.translate.x, this.translate.y);
    this.scene.ctx.scale(this.zoom / this.oldZoom, this.zoom / this.oldZoom);
    this.scene.ctx.translate(-this.translate.x, -this.translate.y);
  };

  bindTo(obj) {
    this.unbind();

    this.APP.get(this.deadZone.position).stop().animate({
      x: obj.position.x,
      y: obj.position.y,
    }, 500);

    this.APP.get(this.deadZone).stop().animate({
      width: obj.deadZoneScale.width,
      height: obj.deadZoneScale.height,
    }, 500);

    this.APP.timeout(() => {
      this.objBind = obj;
    }, 500);

  };

  unbind(obj) {
    this.objBind = false;
  };

  offsetAnimation(type, num, speed) {
    if (type === 'horizontal') {
      if (this.offsetX < num) {
        this.offsetX += speed;
      };

      if (this.offsetX > num) {
        this.offsetX -= speed;
      };

    } else if(type === 'vertical'){
      // if (this.offsetY < num) {
      //   this.offsetY += speed;
      // };

      // if (this.offsetY > num) {
      //   this.offsetY -= speed;
      // };
    };    
  };
};

export default Camera;
