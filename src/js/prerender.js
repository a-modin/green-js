class Prerender {

  constructor(APP) {
    this.APP = APP;
    this.canvas = document.createElement('canvas');
    this.prerenderCtx = this.canvas.getContext('2d');
    this.renderCtx = this.APP.scene.ctx;
  };

  getData(image, sx, sy, swidth, sheight, x, y, width, height){
    this.canvas.width = width;
    this.canvas.height = height;
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);

    let data = this.prerenderCtx.getImageData(0, 0, width, height);

    return data;
  };

  draw(data, position){
    this.canvas.width = data.width;
    this.canvas.height = data.height;
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.putImageData(data, 0, 0);
    this.renderCtx.drawImage(this.canvas, position.x, position.y);
  };

  filter(data, filter, value){
    this.prerenderCtx.clearRect(0, 0, 9999, 9999);
    this.prerenderCtx.putImageData(data, 0, 0);

    let _data = this.prerenderCtx.getImageData(0, 0, data.width, data.height);
    let filteredData = this[filter](_data, value);
    return filteredData;
  };

  brightness(data, val){
    for(let i = 0; i < data.data.length; i += 4){

      let pixel = data.data;
      let k = val + 1

      let r = i;
      let g = i + 1;
      let b = i + 2;
      let a = i + 3;

      pixel[r] *= k;
      pixel[g] *= k;
      pixel[b] *= k;
      // pixel[a] += 15;
    }

    return data
  };

  fog(data, val){

    for(let i = 0; i < data.data.length; i += 4){

      let pixel = data.data;
      let k = val + 1

      let r = i;
      let g = i + 1;
      let b = i + 2;
      let a = i + 3;

      pixel[r] = pixel[r] * 0.5 + 185 * val;
      pixel[g] = pixel[g] * 0.5 + 227 * val;
      pixel[b] = pixel[b] * 0.5 + 255 * val;
    }

    return data
  };



}
 
export default Prerender;