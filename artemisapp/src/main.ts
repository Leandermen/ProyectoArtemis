import './style.css';
import ArcGISMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
//Only if you are using an API key
//import esriConfig from '@arcgis/core/config.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Color from "@arcgis/core/Color.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";


const app = document.querySelector<HTMLDivElement>('#app')!

const countryGraphicsLayer = new GraphicsLayer({
  effect: "bloom(1.1, 0.2px, 0.2)",
});

//Only if you are using an API key
//esriConfig.apiKey = 'MyAPIKey'

let zz = new SimpleFillSymbol({
  color: [227, 139, 79, 0.8],
  outline: {
      "color": [110, 110, 110],
      "width": 1
  }
})

const simpleFillSymbol = new SimpleFillSymbol({
  color: new Color([68,162,113,1]),
  outline: new SimpleLineSymbol({
    cap: "square",
    color: new Color([255,255,255,1]),
    join: "round",
    miterLimit: 1,
    style: "solid",
    width: 1
  }),
  style: "solid"
});

const datarend = new SimpleRenderer({
  symbol: simpleFillSymbol
})

// Create a map and add a feature layer
const layer = new FeatureLayer({
  url: 'https://services1.arcgis.com/LsoiDXzijohT7g97/arcgis/rest/services/WorldData/FeatureServer',
  renderer: datarend
})


const map = new ArcGISMap({
  layers: [layer,countryGraphicsLayer],
})


// Create a map view
const view = new MapView({
  map,
  container: app,
  scale : 80000000,
  center: [12, 12],
  constraints:{
    rotationEnabled: false,
    minScale: 90000000,
    maxScale: 10000000,    
  }
})
let oid: number;
view.on('click', function(event){
  countryGraphicsLayer.graphics.removeAll();
  console.log(event.mapPoint)
  const opts = {
    include: layer
  }
  view.hitTest(event, opts).then((response) => {
    if (response.results.length) {
      let pi = response.results[0]
      if (pi.type==="graphic"){
        let grafo = pi.graphic
        if (countryGraphicsLayer.graphics.length==0){
          grafo.symbol=zz
          countryGraphicsLayer.graphics.add(grafo)
          oid = pi.graphic.attributes["OBJECTID"]
          console.log(oid)
        } else if (grafo.attributes["OBJECTID"]!=oid){
          countryGraphicsLayer.graphics.removeAll();
          grafo.symbol=zz
          oid = grafo.attributes["OBJECTID"]
          console.log(oid)
          countryGraphicsLayer.graphics.add(grafo);
        }        
      } 
    } else {
      countryGraphicsLayer.graphics.removeAll();
    }
  });
});