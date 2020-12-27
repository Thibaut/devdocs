//= require app/searcher

app.models.Entry = class Entry extends (
  app.Model
) {
  // Attributes: name, type, path

  constructor(attributes) {
    super(attributes);
    this.text = Entry.applyAliases(app.Searcher.normalizeString(this.name));
  }

  addAlias(name) {
    const text = Entry.applyAliases(app.Searcher.normalizeString(name));
    if (!Array.isArray(this.text)) {
      this.text = [this.text];
    }
    this.text.push(Array.isArray(text) ? text[1] : text);
  }

  fullPath() {
    return this.doc.fullPath(this.isIndex() ? "" : this.path);
  }

  dbPath() {
    return this.path.replace(/#.*/, "");
  }

  filePath() {
    return this.doc.fullPath(this._filePath());
  }

  fileUrl() {
    return this.doc.fileUrl(this._filePath());
  }

  _filePath() {
    let result = this.path.replace(/#.*/, "");
    if (result.slice(-5) !== ".html") {
      result += ".html";
    }
    return result;
  }

  isIndex() {
    return this.path === "index";
  }

  getType() {
    return this.doc.types.findBy("name", this.type);
  }

  loadFile(onSuccess, onError) {
    return app.db.load(this, onSuccess, onError);
  }

  static applyAliases(string) {
    if (Entry.ALIASES.hasOwnProperty(string)) {
      return [string, Entry.ALIASES[string]];
    }
    const words = string.split(".");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (Entry.ALIASES.hasOwnProperty(word)) {
        words[i] = Entry.ALIASES[word];
        return [string, words.join(".")];
      }
    }
    return string;
  }
};

app.models.Entry.ALIASES = {
  angular: "ng",
  "angular.js": "ng",
  "backbone.js": "bb",
  "c++": "cpp",
  coffeescript: "cs",
  crystal: "cr",
  elixir: "ex",
  javascript: "js",
  julia: "jl",
  jquery: "$",
  "knockout.js": "ko",
  less: "ls",
  lodash: "_",
  löve: "love",
  marionette: "mn",
  markdown: "md",
  modernizr: "mdr",
  "moment.js": "mt",
  openjdk: "java",
  nginx: "ngx",
  numpy: "np",
  pandas: "pd",
  postgresql: "pg",
  python: "py",
  "ruby.on.rails": "ror",
  ruby: "rb",
  rust: "rs",
  sass: "scss",
  tensorflow: "tf",
  typescript: "ts",
  "underscore.js": "_",
};
