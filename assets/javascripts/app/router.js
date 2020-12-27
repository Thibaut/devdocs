app.Router = class Router {
  constructor() {
    for (let [path, method] of [
      ["*", "before"],
      ["/", "root"],
      ["/settings", "settings"],
      ["/offline", "offline"],
      ["/about", "about"],
      ["/news", "news"],
      ["/help", "help"],
      ["/:doc-:type/", "type"],
      ["/:doc/", "doc"],
      ["/:doc/:path(*)", "entry"],
      ["*", "notFound"],
    ]) {
      page(path, this[method].bind(this));
    }
    this.setInitialPath();
  }

  start() {
    page.start();
  }

  show(path) {
    page.show(path);
  }

  triggerRoute(name) {
    this.trigger(name, this.context);
    this.trigger("after", name, this.context);
  }

  before(context, next) {
    const previousContext = this.context;
    this.context = context;
    this.trigger("before", context);

    const res = next();
    if (res) {
      this.context = previousContext;
      return res;
    } else {
      return;
    }
  }

  doc(context, next) {
    const doc =
      app.docs.findBySlug(context.params.doc) ||
      app.disabledDocs.findBySlug(context.params.doc);
    if (doc) {
      context.doc = doc;
      context.entry = doc.toEntry();
      this.triggerRoute("entry");
      return;
    } else {
      return next();
    }
  }

  type(context, next) {
    const doc = app.docs.findBySlug(context.params.doc);
    const type = doc?.types.findBy("slug", context.params.type);
    if (type) {
      context.doc = doc;
      context.type = type;
      this.triggerRoute("type");
      return;
    } else {
      return next();
    }
  }

  entry(context, next) {
    const doc = app.docs.findBySlug(context.params.doc);
    if (!doc) {
      return next();
    }
    let { path } = context.params;
    const { hash } = context;

    let entry;
    if ((entry = doc.findEntryByPathAndHash(path, hash))) {
      context.doc = doc;
      context.entry = entry;
      this.triggerRoute("entry");
      return;
    } else if (path.slice(-6) === "/index") {
      path = path.substr(0, path.length - 6);
      if ((entry = doc.findEntryByPathAndHash(path, hash))) {
        return entry.fullPath();
      }
    } else {
      path = `${path}/index`;
      if ((entry = doc.findEntryByPathAndHash(path, hash))) {
        return entry.fullPath();
      }
    }

    return next();
  }

  root() {
    if (app.isSingleDoc()) {
      return "/";
    }
    this.triggerRoute("root");
  }

  settings(context) {
    if (app.isSingleDoc()) {
      return `/#/${context.path}`;
    }
    this.triggerRoute("settings");
  }

  offline(context) {
    if (app.isSingleDoc()) {
      return `/#/${context.path}`;
    }
    this.triggerRoute("offline");
  }

  about(context) {
    if (app.isSingleDoc()) {
      return `/#/${context.path}`;
    }
    context.page = "about";
    this.triggerRoute("page");
  }

  news(context) {
    if (app.isSingleDoc()) {
      return `/#/${context.path}`;
    }
    context.page = "news";
    this.triggerRoute("page");
  }

  help(context) {
    if (app.isSingleDoc()) {
      return `/#/${context.path}`;
    }
    context.page = "help";
    this.triggerRoute("page");
  }

  notFound() {
    this.triggerRoute("notFound");
  }

  isIndex() {
    return (
      this.context?.path === "/" ||
      (app.isSingleDoc() && this.context?.entry?.isIndex())
    );
  }

  isSettings() {
    return this.context?.path === "/settings";
  }

  setInitialPath() {
    // Remove superfluous forward slashes at the beginning of the path
    let path = location.pathname.replace(/^\/{2,}/g, "/");
    if (path !== location.pathname) {
      page.replace(path + location.search + location.hash, null, true);
    }

    if (location.pathname === "/") {
      if ((path = this.getInitialPathFromHash())) {
        page.replace(path + location.search, null, true);
      } else if ((path = this.getInitialPathFromCookie())) {
        page.replace(path + location.search + location.hash, null, true);
      }
    }
  }

  getInitialPathFromHash() {
    try {
      return new RegExp("#/(.+)").exec(decodeURIComponent(location.hash))?.[1];
    } catch (error) {
      //ignore
    }
  }

  getInitialPathFromCookie() {
    const path = Cookies.get("initial_path");
    if (path) {
      Cookies.expire("initial_path");
      return path;
    }
  }

  replaceHash(hash) {
    page.replace(
      location.pathname + location.search + (hash || ""),
      null,
      true
    );
  }
};

$.extend(app.Router.prototype, Events);
