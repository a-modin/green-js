class Sprite {
  
  constructor(obj, APP) {
    this.APP = APP;
    this.speed = 24;

    this.animations = obj.animations;

    this.framesAmount = obj.framesAmount;   // Количество кадров
    this.frameWidth = obj.frameWidth;       // Ширина одного кадра
    this.frameHeight = obj.frameHeight;     // Высота одного кадра

    this.image = new Image();
    this.image.src = obj.image;             // Путь к файлу спрайтов

    this.parent = null;

    this.x = 0;
    this.y = 64;
    this.width = this.framesAmount * this.frameWidth;

    this.currentAnimations = [];
    this.currentAnimationNumber = 0;
    this.currentFrame = 0;

    this.date = new Date();
    this.play = 'right';

  };

  init () {
    let that = this;

    this.APP.watch(this.parent.status, 'animation', function(status){
      
      that.x = 0;
      that.currentAnimations = [];
      that.currentAnimation = {};
      that.currentAnimationNumber = 0;
      that.date = new Date();
      that.currentFrame = 0; 

      if (status === 'jumpRight') {
        that.animate(['beforeJumpRight', 'beforeJumpRight_2', 'jumpRight']);

      } else if(status === 'jumpLeft') {
        that.animate(['beforeJumpLeft', 'beforeJumpLeft_2', 'jumpLeft']);

      } else if (status === 'damageRight') {
        that.animate(['damageRight', 'damageRight_2']);

      } else if (status === 'damageLeft') {
        that.animate(['damageLeft', 'damageLeft_2']);

      } else if (status === 'dieLeft') {
        that.animate(['dieLeft', 'lieLeft']);

      } else if (status === 'dieRight') {
        that.animate(['dieRight', 'lieRight']);

      } else if (status === 'shootLeft') {
        that.animate(['shootLeft', 'agressiveLeft']);

      } else if (status === 'shootRight') {
        that.animate(['shootRight', 'agressiveRight']);

        

      } else {
        that.animate(status);
      }
    });
  };

  update () {
    if (this.currentAnimation) {
      this.speed = this.currentAnimation.speed;
    };

    let duration = new Date - this.date;
    
    if (duration > 1000 / this.speed) {

      this.date = new Date;

      if (this.currentAnimation && this.currentFrame < this.currentAnimation.framesAmount - 1) {
        this.x += this.frameWidth;
        this.currentFrame++;

      } else {

        if (this.currentAnimations.length === 0 || this.currentAnimations.length === this.currentAnimationNumber + 1) {
          this.x = 0;
          this.currentFrame = 0;      

        } else {
          this.currentAnimationNumber++;
          this.currentAnimation = this.animations[this.currentAnimations[this.currentAnimationNumber]];
          this.currentFrame = 0;
          this.x = 0;
          this.y = this.frameHeight * this.currentAnimation.index;
        }

      }
    };
  };

  animate (animations, repeat = true) {
    this.x = 0;
    this.currentAnimations = [];
    this.currentAnimation = {};
    this.currentAnimationNumber = 0;

    if (typeof animations === 'string') {
      this.currentAnimation = this.animations[animations];
      this.y = this.frameHeight * this.currentAnimation.index;
    
    } else {
      this.currentAnimations = animations;
      this.currentAnimation = this.animations[animations[this.currentAnimationNumber]];

      this.y = this.frameHeight * this.currentAnimation.index;
    }
  };
};

export default Sprite;
