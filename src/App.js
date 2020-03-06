import "./App.css";
import React, { useState, useEffect } from "react";
import Marquee from "react-text-marquee";

import axios from "axios";
import L from "leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { addressPoints } from "./realworld.10000.js";
import { isCompositeComponent } from "react-dom/test-utils";
import { Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "./Biohazard.png";
import Ticker, { FinancialTicker, NewsTicker } from "nice-react-ticker";

var numeral = require("numeral");

function App() {
  const style = {
    width: "100%",
    height: "400px"
  };

  const [data, setData] = useState([]);
  const [infected, setInfected] = useState("");
  const [deaths, setDeaths] = useState("");
  const [recovered, setRecovered] = useState("");

  useEffect(() => {
    const urlQuery = ["confirmed", "deaths", "recovered"];

    urlQuery.map((qstring, index) =>
      axios
        .get(`https://coronavirus-tracker-api.herokuapp.com/${qstring}`)
        .then(res => {
          if (qstring == "confirmed") {
            const rawdata = res.data.locations;
            setInfected(res.data.latest);
            var result = [];
            //console.log(totalInfected);
            const map1 = rawdata.map(data => data.coordinates);
            for (var i in map1) result.push([map1[i].lat, map1[i].long]);
            setData(result);
          } else if (qstring == "deaths") {
            setDeaths(res.data.latest);
          } else if (qstring == "recovered") {
            setRecovered(res.data.latest);
          }
        })
    );
  }, []);

  return (
    <div className="containerbox">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <img
            alt=""
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          {"     "}
          Coronavirus Daily Tracker 2020
        </Navbar.Brand>
      </Navbar>
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
        </Map>
      </div>
      <div class="flex-container">
        <div>
          <h4>Total Infected</h4>
          {numeral(infected).format("0,0")}
        </div>
        <div>
          <h4>Total Deaths</h4>
          {numeral(deaths).format("0,0")}
        </div>
        <div>
          <h4>Total Recovered</h4>
          {numeral(recovered).format("0,0")}
        </div>
      </div>
    </div>
  );
}

export default App;
