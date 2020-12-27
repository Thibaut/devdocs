const pathArrow = '<svg class="_path-arrow"><use xlink:href="#icon-dir"/></svg>';

app.templates.path = function (doc, type, entry) {
  let html = `<a href="${doc.fullPath()}" class="_path-item _icon-${
    doc.icon
  }">${doc.fullName}</a>`;
  if (type) {
    html += `${pathArrow}<a href="${type.fullPath()}" class="_path-item">${
      type.name
    }</a>`;
  }
  if (entry) {
    html += `${pathArrow}<span class="_path-item">${$.escape(entry.name)}</span>`;
  }
  return html;
};
