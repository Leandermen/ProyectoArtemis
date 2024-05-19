import './style.css';
import ArcGISMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import { watch } from '@arcgis/core/core/reactiveUtils.js';
//Only if you are using an API key
//import esriConfig from '@arcgis/core/config.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';

const app = document.querySelector<HTMLDivElement>('#app')!

//Only if you are using an API key
//esriConfig.apiKey = 'MyAPIKey'

// Create a map and add a feature layer
const layer = new FeatureLayer({
  url: 'https://services1.arcgis.com/LsoiDXzijohT7g97/arcgis/rest/services/Chile_ZonasNaturales/FeatureServer',
})
const map = new ArcGISMap({
  basemap: 'streets-vector',
  layers: [layer],
})

// Set the initial rotation of the map view
let rotation: number;
if (window.innerWidth <= 480) {
  rotation = 0;
} else {
  rotation = -90;
}

// Create a map view
const view = new MapView({
  map,
  container: app,
  zoom: 4,
  center: [-73.5, -40.5],
  rotation: rotation,
  constraints:{rotationEnabled: false,}
})

//view.when(() => console.log('Map and View are ready'));
// Create a button
const button = document.createElement('button');
button.textContent = 'Take Snapshot';
app.appendChild(button);

// Add an event listener to the button
button.addEventListener('click', () => {
  // Take a screenshot of the view
  view.takeScreenshot({ format: 'jpg' }).then((screenshot) => {
    // Convert the data URL to a blob
    const blob = dataURLToBlob(screenshot.dataUrl);

    // Create a link and use it to download the blob as a JPEG file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'map-snapshot.jpg';
    link.click();
  });
});

// Function to convert a data URL to a blob
function dataURLToBlob(dataUrl: any) {
  const binary = atob(dataUrl.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}
// Watch the width breakpoint of the view and update the view accordingly
watch(
  () => view.widthBreakpoint,
  (breakpoint) => {
    console.log('Width breakpoint:', breakpoint);
    switch (breakpoint) {
      case 'xsmall':
        view.ui.remove('zoom');
        view.rotation = 0;
        break;
      default:
        view.rotation = -90;
  }
  },
);
