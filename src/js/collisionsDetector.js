let detector = function(obj_1, obj_2, callback){
  
  let type = {};
  let t1;
  let t2;
  let it;

  // get the vectors to check against
  let vX = (obj_2.position.x + (obj_2.width / 2)) - (obj_1.position.x + (obj_1.width / 2)),
      vY = (obj_2.position.y + (obj_2.height / 2)) - (obj_1.position.y + (obj_1.height / 2)),
      // add the half widths and half heights of the objects
      hWidths = (obj_2.width / 2) + (obj_1.width / 2),
      hHeights = (obj_2.height / 2) + (obj_1.height / 2),
      colDir = null
      // type = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
          oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
          if (vY > 0) {
              colDir = "top";
              type.y = 'top';
              t1 = 'top';
              t2 = 'bottom';
              // obj_2.position.y += oY;
          } else {
              colDir = "bottom";
              type.y = 'bottom';
              t1 = 'bottom';
              t2 = 'top';
              // obj_2.position.y -= oY;
          }
      } else {
          if (vX > 0) {
              colDir = "left";
              type.x = 'left';
              t1 = 'left';
              t2 = 'right';
              // obj_2.position.x += oX;
          } else {
        
              colDir = "right";
              type.x = 'right';
              t1 = 'right';
              t2 = 'left';
              // obj_2.position.x -= oX;
          };
      };
  } else {
    t1 = false;
    t2 = false;
  };

  callback(obj_1, obj_2, t1, t2);
}


let collisionsDetector = {

  detection: (dynamicObjects, staticObjects, callback) => {

    dynamicObjects.forEach(function(dynamicObj, i, arr){
      staticObjects.forEach(function(staticObj, i, arr){
        detector(staticObj, dynamicObj, callback);
      });

      dynamicObjects.forEach(function(dynamicObj_2, i, arr){
        if (dynamicObj === dynamicObj_2) {
          return;
        };

        if (!dynamicObj.collisions || !dynamicObj_2.collisions) {
          return;
        };

        detector(dynamicObj_2, dynamicObj, callback);
      });      
    });

         
  }

};

export default collisionsDetector;



