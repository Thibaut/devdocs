app.Collection = class Collection {
  constructor(objects = []) {
    this.reset(objects);
  }

  model() {
    return app.models[this.constructor.model];
  }

  reset(objects = []) {
    this.models = [];
    for (let object of objects) {
      this.add(object);
    }
  }

  add(object) {
    if (object instanceof app.Model) {
      this.models.push(object);
    } else if (object instanceof Array) {
      for (let obj of object) {
        this.add(obj);
      }
    } else if (object instanceof app.Collection) {
      this.models.push(...object.all());
    } else {
      this.models.push(new (this.model())(object));
    }
  }

  remove(model) {
    this.models.splice(this.models.indexOf(model), 1);
  }

  size() {
    return this.models.length;
  }

  isEmpty() {
    return this.models.length === 0;
  }

  each(fn) {
    for (let model of this.models) {
      fn(model);
    }
  }

  all() {
    return this.models;
  }

  contains(model) {
    return this.models.includes(model);
  }

  findBy(attr, value) {
    return this.models.find((model) => model[attr] === value);
  }

  findAllBy(attr, value) {
    return this.models.filter((model) => model[attr] === value);
  }

  countAllBy(attr, value) {
    return this.findAllBy(attr, value).length;
  }
};
