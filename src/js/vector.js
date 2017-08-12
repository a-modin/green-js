class Vector {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  };

  plus(vec = new Vector()) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  };

  minus(vec = new Vector()) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  };

  multiply(val = 0) {
    if (typeof val === 'object') {
      this.x *= val.x;
      this.y *= val.y;

    } else {
      this.x *= val;
      this.y *= val;
    }
    return this;
  };

  fixed(amount = 0){
    this.x = Number(this.x.toFixed(amount));
    this.y = Number(this.y.toFixed(amount));
    return this;
  };
}

export default Vector;