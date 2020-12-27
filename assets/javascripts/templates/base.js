app.templates.render = function (name, value, ...args) {
  const template = app.templates[name];

  if (Array.isArray(value)) {
    return value.map((val) => template(val, ...args)).join("");
  } else if (typeof template === "function") {
    return template(value, ...args);
  } else {
    return template;
  }
};
