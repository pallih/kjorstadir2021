function geoFilter(feat, filterFn) {
  feat.features = feat.features.filter(filterFn);
  return feat;
}

function getCenter(topo) {
  const [x0, y0, x1, y1] = topojson.bbox(topo);
  return [-(x1 + ((x0 - x1) / 2)), -(y1 + ((y0 - y1) / 2)), 0];
}

let _canvas = null;
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = _canvas || (_canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getKeys(propName, data) {
  return Array.from(
    new Set(data.map(d => d[propName]))
  ).sort((a, b) => a.localeCompare(b));
}

function getBreadcrumbs(area, county, place, arrow = '→') {
  const nav = [
    { value: 'Ísland', level: 0 },
    area && { value: arrow },
    area && { value: area, level: 1 },
    county && { value: arrow },
    county && { value: county, level: 2 },
    place && { value: arrow },
    place && { value: place, level: 3 }
  ].filter(Boolean);
  nav.reduce((a, d) => {
    d.x = a;
    return d.x + getTextWidth(d.value, '20px sans-serif') + 10;
  }, 0);
  return nav;
}
