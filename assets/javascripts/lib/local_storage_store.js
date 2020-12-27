class LocalStorageStore {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      //ignore
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      //ignore
    }
  }

  del(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      //ignore
    }
  }

  reset() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      //ignore
    }
  }
}
