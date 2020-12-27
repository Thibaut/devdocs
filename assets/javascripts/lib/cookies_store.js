class CookiesStore {
  // Intentionally called CookiesStore instead of CookieStore
  // Calling it CookieStore causes issues when the Experimental Web Platform features flag is enabled in Chrome
  // Related issue: https://github.com/freeCodeCamp/devdocs/issues/932

  static onBlocked() {}

  get(key) {
    let value = Cookies.get(key);
    if (value != null && /^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }
    return value;
  }

  set(key, value) {
    if (value === false) {
      this.del(key);
      return;
    }

    if (value === true) {
      value = 1;
    }
    if (value && /^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }
    Cookies.set(key, "" + value, { path: "/", expires: 1e8 });
    if (this.get(key) !== value) {
      this.constructor.onBlocked(key, value, this.get(key));
    }
  }

  del(key) {
    Cookies.expire(key);
  }

  reset() {
    try {
      for (let cookie of document.cookie.split(/;\s?/)) {
        Cookies.expire(cookie.split("=")[0]);
      }
      return;
    } catch (error) {
      //ignore
    }
  }

  dump() {
    const result = {};
    for (let cookie of document.cookie.split(/;\s?/)) {
      if (cookie[0] !== "_") {
        cookie = cookie.split("=");
        result[cookie[0]] = cookie[1];
      }
    }
    return result;
  }
}
