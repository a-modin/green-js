class Animation {

  constructor (target, props, duration, APP) {
    this.APP = APP;
    this.target = target;
    this.props = props;
    this.duration = duration;
    this.created = new Date();
    this.passed = null;
    this.timing = null;
    this.status = 'waiting';
  };

  init () {
    this.initialProps = {};
    this.differences = {};
    this.created = new Date();

    for(let prop in this.props){
      this.initialProps[prop] = this.target[prop];
      this.differences[prop] = this.props[prop] - this.target[prop];
    };

    this.status = 'isInitialized';
  };

  check(){
    this.passed = new Date() - this.created;
    this.timing = this.passed / this.duration;

    if (this.passed > this.duration) {
      this.timing = 1;
      this.status = 'finished';
    };

    this.step();
  };

  delete(){
    let index = this.chain.animations.indexOf(this);
    this.chain.animations.splice(index, 1);
  };

  step(){
    for(let prop in this.props){
      let differences = this.differences[prop] * this.timing;
      this.target[prop] = this.initialProps[prop] + this.differences[prop] * this.timing;
    };
  };

};

export default Animation;
