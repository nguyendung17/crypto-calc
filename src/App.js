import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";

export default function App(props) {
  const [priceIn, setPriceIn] = useState(35.9);
  const [rateFrom, setRateFrom] = useState(15.9);

  const [color, setColor] = useState("black");
  const [rateTo, setRateTo] = useState(0);
  const [earnPersent, setEarnPersent] = useState(0);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('BTC'); 
  useEffect(() => {
    if (priceIn && rateFrom && rateTo) {
      setEarnPersent(100 * rateTo / rateFrom);
      setPrice(priceIn*(rateTo-rateFrom)+priceIn);
      console.log("Price", earnPersent, rateTo, price);

      setColor(priceIn > price ? "green" : "red");
    } else {
      setPrice(0);
    }
  }, [priceIn, rateFrom, rateTo, earnPersent]);

 
  function getCoin() {
    var config = {
      method: "get",
      url: "https://rest.coinapi.io/v1/assets/" + currency,
      headers: {
        "X-CoinAPI-Key": "00048985-6CB7-4DBF-AA7A-E4DF4A4CBD67"
      }
    };

    axios(config)
      .then(function ({ data }) {
        console.log(data);
        setRateTo(data[0].price_usd / 1000);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function formatNumber(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  return (
    <div className="App" style={{ float: "left", textAlign: "left" }}>
      <span>Currency</span>
      <input
        placeholder="BTC"
        n onChange={(e) => {
          setCurrency(e.target.value);
        }}
        value={currency}
      />
      <button onClick={getCoin}>Change</button>
      <br />
      <span>Push</span>
      <input
        placeholder="Price IN"
        onChange={(e) => {
          setPriceIn(e.target.value);
        }}
        value={priceIn}
      />
      <br />
      <span> Price from:</span>
      <input
        placeholder="Rate From"
        onChange={(e) => {
          setRateFrom(e.target.value);
        }}
        value={rateFrom}
      />
      <br />
      <span> Price To:</span>
      <input
        onChange={(e) => {
          setRateTo(e.target.value);
        }}
        placeholder="Rate To"
        value={rateTo}
      />
      <br />
      <span>Earn %:</span> <b style={{ color: color }}>{formatNumber(earnPersent)} %</b>
      <br />
      <span>You earn: </span>
      <b style={{ color: color }}>{formatNumber(price)} $</b>
      <br />
      <span>Total: </span>
      <b style={{ color: color }}>{formatNumber(price + parseInt(priceIn))} $</b>
    </div>
  );
}
