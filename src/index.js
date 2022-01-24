'use strict';

const image = {
  url: 'src/map.png',
  height: 600,
  width: 800,
};

const bounds = L.latLngBounds([0, 0], [image.height, image.width]);

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 0,
  zoomControl: false,
});

L.imageOverlay(image.url, bounds).addTo(map);
map.fitBounds(bounds);
map.setMaxBounds(bounds);

function onEachFeature(feature, layer) {
  const date = feature.properties.date;
  const newCases = feature.properties.newCases;
  const prefecture = feature.properties.prefecture;
  let popupContent = '';
  if (feature.properties) {
    popupContent = `${date}<br>${prefecture}<br>${newCases} 人`;
  }
  layer.bindPopup(popupContent);

  let labelContent = '';
  if (prefecture === '全国') {
    labelContent = `<div><div class="all">${date}の感染者数</div><div class="number">${newCases}</div></div>`;
  } else {
    labelContent = `<div><div>${prefecture}</div><div class="number">${newCases}</div></div>`;
  }
  const labelIcon = L.divIcon({
    html: labelContent,
    className: 'label',
    iconSize: null,
  });
  layer.setIcon(labelIcon);
}

L.geoJSON(newCases, {
  onEachFeature: onEachFeature,
}).addTo(map);

