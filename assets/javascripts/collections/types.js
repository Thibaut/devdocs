app.collections.Types = class Types extends (
  app.Collection
) {
  groups() {
    const result = [];
    for (let type of this.models) {
      var name = Types._groupFor(type);
      if (result[name]) {
        result[name].push(type);
      } else {
        result[name] = [type];
      }
    }
    return result.filter((e) => e.length > 0);
  }

  static _groupFor(type) {
    const GUIDES_RGX = /(^|\()(guides?|tutorials?|reference|book|getting\ started|manual|examples)($|[\):])/i;
    const APPENDIX_RGX = /appendix/i;
    if (GUIDES_RGX.test(type.name)) {
      return 0;
    } else if (APPENDIX_RGX.test(type.name)) {
      return 2;
    } else {
      return 1;
    }
  }
};

app.collections.Types.model = "Type";
