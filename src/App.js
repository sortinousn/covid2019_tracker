import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { addressPoints } from "./realworld.10000.js";
import { isCompositeComponent } from "react-dom/test-utils";

function App() {
  const style = {
    width: "100%",
    height: "600px"
  };

  const [data, setData] = useState([]);
  const [infected, setInfected] = useState("");

  useEffect(() => {
    axios
      .get("https://coronavirus-tracker-api.herokuapp.com/confirmed")
      .then(res => {
        const rawdata = res.data.locations;
        const totalInfected = res.data.latest;
        setInfected(totalInfected);
        var result = [];
        console.log(totalInfected);
        const map1 = rawdata.map(data => data.coordinates);
        for (var i in map1) result.push([map1[i].lat, map1[i].long]);
        setData(result);
      });
  }, []);

  return (
    <div>
      <div className="mapdiv">
        <Map style={style} center={[49.4, 24.7]} zoom={3}>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={data}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])}
            radius={10}
          />
          <TileLayer
            url="http://tile.stamen.com/toner/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>{" "}
      </div>
      <div class="flex-container">
        <div>
          <h3>Total Infected</h3>
          {infected}
        </div>
      </div>
    </div>
  );
}

export default App;
