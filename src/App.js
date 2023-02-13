import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";

export default function App(props) {
  const [priceIn, setPriceIn] = useState(10);
  const [rateFrom, setRateFrom] = useState(5);

  const [color, setColor] = useState("black");
  const [rateTo, setRateTo] = useState(10);
  const [earnPersent, setEarnPersent] = useState(0);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('BTC');

  let savedPNL = localStorage.getItem('PNL');
  savedPNL = savedPNL ? JSON.parse(savedPNL) : [];
  savedPNL.map((item,index)=>{
    calc(item)
  })

  const [pnlList, setPnlList] = useState(savedPNL);
  useEffect(() => {
    if (priceIn && rateFrom && rateTo) {
      setEarnPersent(((rateTo - rateFrom) * 100) / rateFrom);
      setPrice(priceIn * earnPersent / 100);
      console.log("Price", earnPersent, rateTo, price);

      setColor(earnPersent > 0 ? "green" : "red");
    } else {
      setPrice(0);
    }
  }, [priceIn, rateFrom, rateTo, earnPersent]);

  useEffect(() => {
    console.log("FIRST");
    if (!pnlList || !pnlList.length) {
      addMore();
    }
  })
  function savePNL(){
    localStorage.setItem('PNL', JSON.stringify(pnlList))
  }
  function addMore(item) {
    item = item ?? {
      currency:'BTC',
      priceIn: 10, rateTo: 5, rateFrom: 2, price: 10, earnPersent: 100
    };
    console.log("Add", item);
    let a = [...pnlList, item];
   
    setPnlList(a);
    savePNL()
  }
  function calc(item) {
    item.earnPersent = ((item.rateTo - item.rateFrom) * 100) / item.rateFrom;
    item.price = item.priceIn * item.earnPersent / 100;
  }


  function getCoin(assets) {
    var config = {
      method: "get",
      url: "https://rest.coinapi.io/v1/assets/filter_asset_id=" + assets.join(','),
      headers: {
        "X-CoinAPI-Key": "00048985-6CB7-4DBF-AA7A-E4DF4A4CBD67"
      }
    };

    axios(config)
      .then(function ({ data }) {
        console.log(data);
        
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function formatNumber(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  function updatePNL(key, index, value) {
    const newPNL = pnlList.map((c, i) => {
      if (i === index) {
        // c[key] = value
        // if(['currency'].indexOf(key)==-1)
        c[key] = value

        console.log(c);
        savePNL()
        calc(c);
      }
      return c;
    });
    console.log(newPNL);
    setPnlList(newPNL);
  }
  return (
    <div className="App" style={{ float: "left", textAlign: "left" }}>

      {pnlList.map((item, key) => {
        return (<form key={key}>
          <span>Currency</span>
          <input
            placeholder="BTC"
            onChange={(e) => {
              updatePNL('currency', key, e.target.value)
            }}
            value={item.currency} />
          <br />
          {/* <span>Currency</span>
  <input
    placeholder="BTC"
    n onChange={(e) => {
      setCurrency(e.target.value);
    }}
    value={currency}
  />
  <button onClick={getCoin}>Change</button>
  <br /> */}
          <span>Push</span>
          <input
            placeholder="Price IN"
            onChange={(e) => {
              updatePNL('priceIn', key, e.target.value)
            }}
            value={item.priceIn}
          />
          <br />
          <span> Price from:</span>
          <input
            placeholder="Rate From"
            onChange={(e) => {
              updatePNL('rateFrom', key, e.target.value)
            }}
            value={item.rateFrom}
          />
          <br />
          <span> Price To:</span>
          <input
            onChange={(e) => {
              updatePNL('rateTo', key, e.target.value)
            }}
            type="number"
            placeholder="Rate To"
            value={item.rateTo}
          />
          <br />
          <span>Earn %:</span> <b style={{ color: color }}>{formatNumber(item.earnPersent)} %</b>
          <br />
          <span>You earn: </span>
          <b style={{ color: color }}>{formatNumber(item.price)} $</b>
          <br />
          <span>Total: </span>
          <b style={{ color: color }}>{formatNumber(item.price + parseInt(item.priceIn))} $</b>
          <hr></hr>
        </form>)
      })}
      <button onClick={() => {
        addMore();
      }}>Add</button>

    </div>
  );
}
