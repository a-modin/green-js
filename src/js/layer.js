class Layer {

  constructor(name, type, zIndex, zType, parallax, APP) {
    this.name = name;
    this.type = type;
    this.zIndex = zIndex;
    this.items = [];
    this.visibleItems = [];
    this.visible = true;
    this.sectors = [];
    this.APP = APP;
    this.zType = zType;
    this.parallax = parallax;
  };

  add(item){
    this.items.push(item);
    this.sectorize(500);
  };

  delete(item){
    let index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1)
    };
    this.sectorize(500);
  };

  draw(ctx){
    if (!this.visible) { return };

    if (this.type !== 'tiles'){
      
      for(let item of this.items){
        
        if (!item.driver) {
          item.layer = this;
          item.draw(ctx);
        };
        
      };

    } else {

      for(let item of this.visibleItems){
        if (item.item !== '00|01') {
          ctx.strokeStyle="#e9e9e9";
          ctx.strokeRect(item.position.x, item.position.y, item.width, item.height);
        }
      };

      for(let item of this.visibleItems){
        if (item.item === '00|01') {
          ctx.strokeStyle='rgba(255, 0, 0, 0.6)';
          ctx.strokeRect(item.position.x, item.position.y, item.width, item.height);

          ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
          ctx.fillRect(item.position.x, item.position.y, item.width, item.height);
        }
      }
    }

    if (this.type ==='characters') {

    }


  };

  sectorize(sectorSize){

    this.sectors = {}
    
    for (let item of this.items){
      let floor = function(val, k){
        return Math.floor(val / k) * k;
      };

      let keyX = floor(item.position.x, sectorSize);
      let keyY = floor(item.position.y, sectorSize);

      let key = keyX + 'x' + keyY;

      item.sector = {};

      item.sector.x = keyX;
      item.sector.y = keyY;

      if (this.sectors[key]) {
        this.sectors[key].push(item);

      } else {
        this.sectors[key] = [];
        this.sectors[key].push(item)
      };
    };

    let sectors = [];

    for(let p in this.sectors){
      let sector = {};
      sector.position = {};
      
      sector.items = this.sectors[p];
      sector.position.x = this.sectors[p][0].sector.x;
      sector.position.y = this.sectors[p][0].sector.y;
      sector.size = sectorSize;

      sectors.push(sector);
    };

    this.sectors = sectors;
  }


};

export default Layer;
