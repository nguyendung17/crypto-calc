import React, { useEffect,useRef, useState } from "react";
import "./styles.css";
import axios from "axios";

// import GoogleLogin from 'react-google-login';
function parseURLParams(key) {
  let url =window.location.toString();
  var queryStart = url.indexOf("?") + 1,
      queryEnd   = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      parms = {}, i, n, v, nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);

      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
  }
  return parms[key];
}
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
let firstLoad = false;
export default function App(props) {
  const [priceIn, setPriceIn] = useState(10);
  const [rateFrom, setRateFrom] = useState(5);

  const [color, setColor] = useState("black");
  const [rateTo, setRateTo] = useState(10);
  const [earnPersent, setEarnPersent] = useState(0);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('BTC');


  let savedPNLUrl = parseURLParams('data');
 
  savedPNLUrl = savedPNLUrl?JSON.parse(savedPNLUrl[0]):[]

  let savedPNL = localStorage.getItem('PNL');
 
  savedPNL = savedPNL ? JSON.parse(savedPNL) : [];
  let timer =false;
  if(savedPNLUrl && savedPNLUrl.length){
    savedPNL = savedPNLUrl
    clearTimeout(timer)
    timer = setTimeout(()=>{
      savePNLfnc()
    })
  }
  savedPNL.map((item, index) => {
    calc(item)
  })
    
  let pnlSavedId = localStorage.getItem('pnlSavedId');
  console.log(pnlSavedId);
  if(pnlSavedId==null){
    pnlSavedId = makeid(12)+new Date().getTime()
    localStorage.setItem('pnlSavedId',pnlSavedId)
  }
  console.log(pnlSavedId);
  useEffect(() => {

    if (!firstLoad) {
      firstLoad = true;
      console.log("FIRST");
      if (!pnlList || !pnlList.length) {
        addMore();
      }
      // let assets = savedPNL.map((item) => {
      //   return item.currency
      // })
      // getCoins(assets);
    }
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

  function savePNLfnc() {
    console.log(pnlList,'xxx');
    if(pnlList && pnlList.length)
        window.history.replaceState('', '','?data='+encodeURIComponent(JSON.stringify(pnlList)));

    localStorage.setItem('PNL', JSON.stringify(pnlList))
  }
  function addMore(item) {
    item = item ?? {
      currency: 'BTC',
      priceIn: 10, rateTo: 5, rateFrom: 2, price: 10, earnPersent: 100
    };
    console.log("Add", item);
    let a = [...pnlList, item];

    setPnlList(a);
    savePNLfnc()
  }
  function calc(item) {
    item.earnPersent = ((item.rateTo - item.rateFrom) * 100) / item.rateFrom;
    item.price = item.priceIn * item.earnPersent / 100;
  }


  async function getCoins(assets) {


    return await axios({
      method: "get",
      url: "https://rest.coinapi.io/v1/assets/filter_asset_id=" + assets.join(','),
      headers: {
        "X-CoinAPI-Key": "4105B119-0525-4D8E-8959-44DD38BD6EA8"
      }
    })
      .then(function ({ data }) {
        console.log(data);
        return data;

      })
      .catch(function (error) {
        console.log(error);
        return false
      });
  }


  async function removePNLItem(key) {
    let items = pnlList.map((x) => x);
    items.splice(key, 1); 
    setPnlList(items);
  }
  
    async function getAssetInfo(key) {
    let item = pnlList[key];
    let data = await getCoins([item.currency])
    console.log(data);
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
        savePNLfnc()
        calc(c);
      }
      return c;
    });
    console.log(newPNL);
    setPnlList(newPNL);
  }
  const responseGoogle = (response) => {
    console.log(response);
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
           {/* <button type="button" onClick={() => {
            getAssetInfo(key)
          }}>Now</button> */}
          <br />
          <span>Earn %:</span> <b style={{ color: color }}>{formatNumber(item.earnPersent)} %</b>
          <br />
          <span>You earn: </span>
          <b style={{ color: color }}>{formatNumber(item.price)} $</b>
          <br />
          <span>Total: </span>
          <b style={{ color: color }}>{formatNumber(item.price + parseInt(item.priceIn))} $</b> <button onClick={()=>{removePNLItem(key)}}>Delete</button>
          <hr></hr>
        </form>)
      })}

      <button onClick={() => {
        addMore();
      }}>Add</button>
      <br>
      </br>

      {/* <GoogleLogin
    clientId="159303834502-a6e2sd3pt83mueul7es6tito6ebunbal.apps.googleusercontent.com"
    buttonText="Login"
    redirectUri='https://pnltoken.onrender.com/callback'
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  /> */}
    </div>
  );
}
