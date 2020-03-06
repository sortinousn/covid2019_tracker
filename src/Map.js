import React, { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import HeatmapLayer from "HeatmapLayer";

function Map() {
  const style = {
    width: "100%",
    height: "600px"
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    // create map

    L.map("map", {
      center: [49.8419, 24.0315],
      zoom: 2,
      layers: [
        L.tileLayer("http://tile.stamen.com/toner/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });
    axios
      .get("https://coronavirus-tracker-api.herokuapp.com/confirmed")
      .then(res => {
        setData(res.data);
        console.log(res.data);
      });
  }, []);

  return <div id="map" style={style}></div>;
}

export default Map;
