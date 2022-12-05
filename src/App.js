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
  useEffect(() => {
    if (priceIn && rateFrom && rateTo) {
      setEarnPersent(100 - (100 * rateFrom) / rateTo);
      setPrice(earnPersent * 0.01 * priceIn);
      console.log("Price", earnPersent, rateTo, price);

      setColor(earnPersent > 0 ? "green" : "red");
    } else {
      setPrice(0);
    }
  }, [priceIn, rateFrom, rateTo, earnPersent]);

  function getBTC() {
    if (rateTo) return;
    var config = {
      method: "get",
      url: "https://rest.coinapi.io/v1/assets/BTC",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      getBTC();
    }, 1000);

    return () => clearTimeout(timer);
  }, [rateTo]);
  return (
    <div className="App" style={{ float: "left", textAlign: "left" }}>
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
      <span>Earn %:</span> <b style={{ color: color }}>{earnPersent} %</b>
      <br />
      <span>You earn: </span>
      <b style={{ color: color }}>{price} $</b>
      <br />
      <span>Total: </span>
      <b style={{ color: color }}>{price + parseInt(priceIn)} $</b>
    </div>
  );
}
