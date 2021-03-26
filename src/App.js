import React from "react";
//search
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./App.css";
import ReactMapGL, {
  NavigationControl,
  Marker,
  Source,
  Layer,
} from "react-map-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
import { geojson } from "./data/channel-bus";
import Geocoder from "react-map-gl-geocoder";
// import myImage from "./assets/marker.svg";
import { Editor, DrawPointMode, DrawLineStringMode } from "react-map-gl-draw";

function App() {
  const [data, setData] = React.useState([]);

  // update data dynamic
  React.useEffect(() => {
    // setInterval(() => {
    //   setData(geojson());
    // }, 10000);
    setData(geojson());
  }, []);

  // navigations
  const navControlStyle = {
    right: 10,
    top: 10,
  };

  let [viewport, setViewport] = React.useState({
    longitude: 106.660172,
    latitude: 10.762622,
    zoom: 10,
  });

  const mapRef = React.useRef();
  const handleViewportChange = React.useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // geocoder
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = React.useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [] // eslint-disable-line
  );

  const layerStyle = {
    id: "my-layer",
    type: "circle",
    source: "points",
    paint: {
      "circle-color": "#f00",
      "circle-radius": 5,
    },
  };

  // const layerStyle = {
  //   id: "marker",
  //   type: "symbol",
  //   // source: 'points',
  //   layout: {
  //     "icon-image": "car-15",
  //     "icon-anchor": "bottom",
  //     "icon-offset": [0, 5],
  //     "icon-allow-overlap": true,
  //     "icon-size": 1.5,
  //   },
  // };

  // map gl draw
  const getFeatureStyle = () => {
    return {
      fill: "none",
      stroke: "#0099FF"
    }
  };

  return (
    <ReactMapGL
      ref={mapRef}
      width="100vw"
      height="100vh"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={handleViewportChange}
    >

      <NavigationControl style={navControlStyle} />

      <Geocoder
        mapRef={mapRef}
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        position="top-left"
        language="vi"
        limit={10}
      />
      <Editor
        ref={mapRef}
        clickRadius={12}
        featureStyle={getFeatureStyle}
        features={data}
        mode={new DrawPointMode()}
      />
      <Source id="my-data" type="geojson" data={data}>
        <Layer {...layerStyle} />
      </Source>
      {/* {data.taxi.properties.map(item => (
       <Marker key={item.TAXI_ID} longitude={item.LONGTITUDE} latitude={item.LATITUDE}>
         <button style={{border: "none", background: "transparent"}}>
           <img src="./marker.svg" alt="marker"/>
         </button>
       </Marker>
     ))} */}
    </ReactMapGL>
  );
}

export default App;
