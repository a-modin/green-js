
import Bullet from '../bullet.js'
import Vector from '../vector.js';

class Crutch extends Bullet {

  constructor(position, width, height, speed, shooter, APP) {
    super(position, width, height, speed, shooter, APP);
    this.image = new Image();
    this.image.src = './images/crutch.png';
    this.acceleration = new Vector(0, 0.05);
    this.collisions = true;
    this.type = 'crutch';
  };

  update(){
    this.speed.plus(this.acceleration);
    this.position.plus(this.speed).fixed(0);
    this.checkCollisions();
  };

  draw(ctx){
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  };

  checkCollisions () {
      if (this.collisionStatus) {
        this.whenCollision(this.collisionStatus.with.type, this.collisionStatus.type);
      };
    };

    whenCollision(obj, side){
      let reactions = {

        tile: {
          top: () => {
            this.delete();
          },

          right: () => {
            this.delete();
          },

          bottom: () => {
            this.delete();
          },

          left: () => {
            this.delete();
          }
        },

        cactus: {
          top: () => {
            // ...
          },

          right: () => {
            
          },

          bottom: () => {
            
          },

          left: () => {
            
          }
        },

        oldWoman: {
          top: () => {
            // ...
          },

          right: () => {
            
          },

          bottom: () => {
            
          },

          left: () => {
            
          }
        },

        crutch: {
          top: () => {

          },

          right: () => {

          },

          bottom: () => {

          },

          left: () => {

          }
        },

        player: {
          top: () => {
            this.delete();
          },

          right: () => {
            this.delete();
          },

          bottom: () => {
            this.delete();
          },

          left: () => {
            this.delete();
          }
        }

      };

      if (reactions[obj]) {
        reactions[obj][side]();
      }
    };
  

};

export default Crutch;