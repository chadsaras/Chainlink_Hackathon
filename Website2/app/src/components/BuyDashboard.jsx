import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import id0 from "./assets/Bacchi.png";
import id1 from "./assets/woman.png";
import id2 from "./assets/Woman-cloth.png";
import id3 from "./assets/Woman-skirt.png";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import skinMarketABI from './abis/skinMarket.json';
import { useNavigate } from 'react-router-dom';
require("dotenv").config();

// Map skinId to corresponding image import
const skinImages = {
  0: id0,
  1: id1,
  2: id2,
  3: id3,
};

function CardComponent({ skinId, username, price, buy }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={skinImages[skinId]} />
      <Card.Body>
        <Card.Title>{username}</Card.Title>
        <Card.Text>Price: {price} ETH</Card.Text>
        <Button variant="primary" onClick={buy}>BUY</Button>
      </Card.Body>
    </Card>
  );
}

function BuyDash() {
  const [skins, setSkins] = useState([]);
  let [connectedAccount, setConnectedAccount] = useState(null);
  let seller;
  const skinMarketAdd = process.env.SKIN_MARKET_ADD; // Address from .env file
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545"); // Ganache
  const {userName}=useParams();
  const navigate = useNavigate();;

  useEffect(() => {
    connectWallet();
    ShowAllSkins();
  }, []);

  async function connectWallet() {
    try {
      const accounts = await web3.eth.getAccounts();
      connectedAccount=accounts[0];
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  async function ShowAllSkins() {
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
    try {
      const skinIds = await skinMarket.methods.getAllSkins().call();
      const allSellers = await Promise.all(skinIds.map(async (skinId) => {
        const sellers = await skinMarket.methods.getSellers(skinId).call();
        return sellers.map((seller, index) => ({
          skinId,
          seller,
        }));
      }));

      const gameSkins = await Promise.all(skinIds.map(async (skinId) => {
        const price = await skinMarket.methods.getSkinPriceFromGame(skinId).call();
        if (price > 0) {
          return {
            skinId,
            seller: {
              userName: 'Game',
              price: price.toString(),
            },
          };
        }
        return null;
      }));

      const filteredGameSkins = gameSkins.filter(skin => skin !== null);

      const sellerCards = allSellers.flat().map(({ skinId, seller }, index) => (
        <CardComponent 
          key={index} 
          skinId={skinId}
          username={seller.userName}
          price={web3.utils.fromWei(seller.price.toString(), 'ether')}
          buy={() => BuySkin(skinId, seller.id)}
        />
      ));

      const gameCards = filteredGameSkins.map(({ skinId, seller }, index) => (
        <CardComponent
          key={`game-${index}`}
          skinId={skinId}
          username={seller.userName}
          price={web3.utils.fromWei(seller.price, 'ether')}
          buy={() => BuySkinFromGame(skinId, seller.price)}
        />
      ));

      setSkins([...sellerCards, ...gameCards]);
    } catch (error) {
      console.error("Error fetching skins:", error);
    }
  }


  async function BuySkin(skinId) {
    navigate(`/${userName}/Buy/${skinId}`);
  }


  async function BuySkinFromGame(skinId, price) {
    console.log("from ; ",connectedAccount,"\nSkin id : ",skinId,"\nUsrname : ",userName)
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
    try {
      await skinMarket.methods.buyFromGame(skinId, userName).send({
        from: connectedAccount,
        value: price,
      });
      alert("Skin purchased successfully from game!");
      ShowAllSkins();
    } catch (error) {
      console.error("Error buying skin from game:", error);
      alert("Error buying skin from game: " + error.message);
    }
  }
  

  function shortAddress(address, startLength = 6, endLength = 4) {
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }

  return (
    <>
      <div className="App">
        <button onClick={connectWallet}>Connect Wallet</button>
        {connectedAccount && (
          <div>
            <p>Connected: {shortAddress(connectedAccount)}</p>
          </div>
        )}
      </div>
      <div>
        {skins}
      </div>
    </>
  );
}

export default BuyDash;
