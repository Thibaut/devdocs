app.Settings = class Settings {
  static initClass() {
    Settings.PREFERENCE_KEYS = [
      "hideDisabled",
      "hideIntro",
      "manualUpdate",
      "fastScroll",
      "arrowScroll",
      "analyticsConsent",
      "docs",
      "dark", // legacy
      "theme",
      "layout",
      "size",
      "tips",
      "autoInstall",
    ];

    Settings.INTERNAL_KEYS = ["count", "schema", "version", "news"];

    Settings.LAYOUTS = ["_max-width", "_sidebar-hidden", "_native-scrollbars"];

    this.defaults = {
      count: 0,
      hideDisabled: false,
      hideIntro: false,
      news: 0,
      manualUpdate: false,
      schema: 1,
      analyticsConsent: false,
      theme: "auto",
    };
  }

  constructor() {
    this.store = new CookiesStore();
    this.cache = {};
    this.autoSupported =
      window.matchMedia("(prefers-color-scheme)").media !== "not all";
    if (this.autoSupported) {
      this.darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.darkModeQuery.addListener(() => this.setTheme(this.get("theme")));
    }
  }

  get(key) {
    let left;
    if (this.cache.hasOwnProperty(key)) {
      return this.cache[key];
    }
    this.cache[key] =
      (left = this.store.get(key)) != null
        ? left
        : this.constructor.defaults[key];
    if (key === "theme" && this.cache[key] === "auto" && !this.darkModeQuery) {
      return (this.cache[key] = "default");
    } else {
      return this.cache[key];
    }
  }

  set(key, value) {
    this.store.set(key, value);
    delete this.cache[key];
    if (key === "theme") {
      this.setTheme(value);
    }
  }

  del(key) {
    this.store.del(key);
    delete this.cache[key];
  }

  hasDocs() {
    try {
      return !!this.store.get("docs");
    } catch (error) {
      //ignore
    }
  }

  getDocs() {
    return this.store.get("docs")?.split("/") || app.config.default_docs;
  }

  setDocs(docs) {
    this.set("docs", docs.join("/"));
  }

  getTips() {
    return this.store.get("tips")?.split("/") || [];
  }

  setTips(tips) {
    this.set("tips", tips.join("/"));
  }

  setLayout(name, enable) {
    this.toggleLayout(name, enable);

    const layout = (this.store.get("layout") || "").split(" ");
    $.arrayDelete(layout, "");

    if (enable) {
      if (layout.indexOf(name) === -1) {
        layout.push(name);
      }
    } else {
      $.arrayDelete(layout, name);
    }

    if (layout.length > 0) {
      this.set("layout", layout.join(" "));
    } else {
      this.del("layout");
    }
  }

  hasLayout(name) {
    const layout = (this.store.get("layout") || "").split(" ");
    return layout.indexOf(name) !== -1;
  }

  setSize(value) {
    this.set("size", value);
  }

  dump() {
    return this.store.dump();
  }

  export() {
    const data = this.dump();
    for (let key of Settings.INTERNAL_KEYS) {
      delete data[key];
    }
    return data;
  }

  import(data) {
    let key, value;
    const object = this.export();
    for (key in object) {
      value = object[key];
      if (!data.hasOwnProperty(key)) {
        this.del(key);
      }
    }
    for (key in data) {
      value = data[key];
      if (Settings.PREFERENCE_KEYS.indexOf(key) !== -1) {
        this.set(key, value);
      }
    }
  }

  reset() {
    this.store.reset();
    this.cache = {};
  }

  initLayout() {
    if (this.get("dark") === 1) {
      this.set("theme", "dark");
      this.del("dark");
    }
    this.setTheme(this.get("theme"));
    for (let layout of Settings.LAYOUTS) {
      this.toggleLayout(layout, this.hasLayout(layout));
    }
    this.initSidebarWidth();
  }

  setTheme(theme) {
    if (theme === "auto") {
      theme = this.darkModeQuery.matches ? "dark" : "default";
    }
    const { classList } = document.documentElement;
    classList.remove("_theme-default", "_theme-dark");
    classList.add("_theme-" + theme);
    this.updateColorMeta();
  }

  updateColorMeta() {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--headerBackground")
      .trim();
    $("meta[name=theme-color]").setAttribute("content", color);
  }

  toggleLayout(layout, enable) {
    const { classList } = document.body;
    if (!app.router?.isSettings) {
      classList.toggle(layout, enable);
    }
    classList.toggle("_overlay-scrollbars", $.overlayScrollbarsEnabled());
  }

  initSidebarWidth() {
    const size = this.get("size");
    if (size) {
      document.documentElement.style.setProperty("--sidebarWidth", size + "px");
    }
  }
};

app.Settings.initClass();
