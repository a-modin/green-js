class Watcher {

  constructor (obj, key, callback) {
    this.obj = obj;
    this.key = key;
    this.val = obj[key];
    this.callback = callback;
  };

  check () {
    if (this.val != this.obj[this.key]) {
      this.callback(this.obj[this.key], this.val);
      this.val = this.obj[this.key];
    }
  };

};

export default Watcher;