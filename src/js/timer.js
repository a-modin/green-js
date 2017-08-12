class Timer {

  constructor(func, delay, isInterval, APP) {
    this.APP = APP;
    this.delay = delay;
    this.func = func;
    this.isInterval = isInterval || null

    this.started = null;
    this.status = null;
    this.passed = null;
    this.timing = null;
  };

  delete () {
    let index = this.APP.timers.indexOf(this);
    
    if (index !== -1) {
      this.APP.timers.splice(index, 1);
    };
  };

  check () {
    if (this.started === null) {
      this.status = 'started';
      this.started = new Date();
    };
    
    if (this.status === 'finished') {
      this.delete();
      return;
    };

    this.passed = new Date() - this.started;
    
    if (this.passed >= this.delay) {
      if (this.isInterval === true) {
        this.status = 'started';
        this.started = new Date();

      } else{
        this.status = 'finished';
      };

      if (this.func) {
        this.func();
      };
    };
  };

};

export default Timer;