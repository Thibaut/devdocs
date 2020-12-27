this.Events = {
  on(event, callback) {
    if (event.indexOf(" ") >= 0) {
      for (let name of event.split(" ")) {
        this.on(name, callback);
      }
      return this;
    }
    if (this._callbacks == null) {
      this._callbacks = {};
    }
    if (this._callbacks[event] == null) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(callback);
    return this;
  },

  off(event, callback) {
    if (event.indexOf(" ") >= 0) {
      for (let name of event.split(" ")) {
        this.off(name, callback);
      }
      return this;
    }
    const callbacks = this._callbacks?.[event];
    const index = callbacks.indexOf(callback);
    if (callbacks && index >= 0) {
      callbacks.splice(index, 1);
      if (!callbacks.length) {
        delete this._callbacks[event];
      }
    }
    return this;
  },

  trigger(event, ...args) {
    this.eventInProgress = { name: event, args };
    const callbacks = this._callbacks?.[event];
    if (callbacks) {
      for (let callback of callbacks.slice(0)) {
        callback(...args);
      }
    }
    this.eventInProgress = null;
    if (event !== "all") {
      this.trigger("all", event, ...args);
    }
    return this;
  },

  removeEvent(event) {
    if (this._callbacks != null) {
      for (let name of event.split(" ")) {
        delete this._callbacks[name];
      }
    }
    return this;
  },
};
