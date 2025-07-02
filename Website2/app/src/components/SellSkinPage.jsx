import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import id0 from "./assets/Bacchi.png";
import id1 from "./assets/woman.png";
import id2 from "./assets/Woman-cloth.png";
import id3 from "./assets/Woman-skirt.png";
import skinMarketABI from './abis/skinMarket.json';

// Map skinId to corresponding image import
const skinImages = {
  0: id0,
  1: id1,
  2: id2,
  3: id3,
};

function SellSkinPage() {
  const { userName, skinId } = useParams();
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [averagePrice, setAveragePrice] = useState(0);
  const [price, setPrice] = useState('');
  const navigate = useNavigate();
  const skinMarketAddress = "0x0DedDe527e2B24a6c2B3bF5F3E7488517E37F3AD"; // Address from .env file
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545"); // Ganache

  useEffect(() => {
    connectWallet();
    fetchAveragePrice();
  }, []);

  async function connectWallet() {
    try {
      const accounts = await web3.eth.getAccounts();
      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  async function fetchAveragePrice() {
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAddress);
    try {
      const sellers = await skinMarket.methods.getSellers(skinId).call();
      if (sellers.length > 0) {
        const totalPrices = sellers.reduce((total, seller) => total + parseFloat(web3.utils.fromWei(seller.price.toString(), 'ether')), 0);
        const average = totalPrices / sellers.length;
        setAveragePrice(average);
      }
    } catch (error) {
      console.error("Error fetching average price:", error);
    }
  }

  async function sellSkin() {
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAddress);
    try {
      const amountInWei = web3.utils.toWei(price, 'ether');
      console.log("userName:", userName, "\nconnectedAccount:", connectedAccount, "\nPrice:", amountInWei);

      // Estimate gas limit
      const gasLimit = await skinMarket.methods.sellSkin(
        skinId,
        userName,
        connectedAccount,
        amountInWei
      ).estimateGas({ from: connectedAccount });

      console.log("userName:", userName);
      console.log("connectedAccount:", connectedAccount);
      console.log("gasLimit:", gasLimit);
      console.log("price:", amountInWei);
      console.log("gas price:", await web3.eth.getGasPrice());

      // Send the transaction
      await skinMarket.methods.sellSkin(
        skinId,
        userName,
        connectedAccount,
        amountInWei
      ).send({
        from: connectedAccount,
        gas: gasLimit,
        gasPrice: await web3.eth.getGasPrice()
      });

      // Navigate to the user dashboard
      navigate(`/${userName}/Sell`);
    } catch (error) {
      console.error("Error selling skin:", error);
    }
  }
  

  return (
    <div>
      <h2>{`Sell Skin ${skinId}`}</h2>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={skinImages[skinId]} />
        <Card.Body>
          <Card.Title>{`Skin ID: ${skinId}`}</Card.Title>
          <Card.Text>{`Current Average Price: ${averagePrice} ETH`}</Card.Text>
          <Form>
            <Form.Group controlId="formPrice">
              <Form.Label>Price (ETH)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </Form.Group>
            <Button variant="primary" onClick={sellSkin}>SELL</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SellSkinPage;
