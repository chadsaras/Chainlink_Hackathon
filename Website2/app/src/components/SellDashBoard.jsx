import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import id0 from "./assets/Bacchi.png";
import id1 from "./assets/woman.png";
import id2 from "./assets/Woman-cloth.png";
import id3 from "./assets/Woman-skirt.png";
import skinOwnershipABI from "./abis/skinOwnership.json";
import axios from 'axios';

// Map skinId to corresponding image import
const skinImages = {
  0: id0,
  1: id1,
  2: id2,
  3: id3,
};

function CardComponent({ skinId, username, sell }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={skinImages[skinId]} />
      <Card.Body>
        <Card.Title>{`Skin ID: ${skinId}`}</Card.Title>
        <Button variant="primary" onClick={sell}>SELL</Button>
      </Card.Body>
    </Card>
  );
}

function SellDash() {
  const { userName } = useParams();
  const [userSkins, setUserSkins] = useState([]);
  const navigate = useNavigate();
  const skinOwnershipAddress = "0x87931844BaCC9A19A7f43d0Bf02f616c2d73fA9A"; // Address from .env file
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545"); // Ganache

  useEffect(() => {
    fetchUserSkins();
  }, [1]);

  async function fetchUserSkins() {
    const skinOwnership = new web3.eth.Contract(skinOwnershipABI, skinOwnershipAddress);
    try {
      const skins = await skinOwnership.methods.getUserSkins(userName).call();
      setUserSkins(skins);
    } catch (error) {
      console.error("Error fetching user skins:", error);
    }

    // //when api done
    // const url = `http://localhost:5001/${userName}`;
    // const res = await axios.get(url);
    // const data = res.data;
    // console.log(data);
    // setUserSkins(data);    

  }

  function sellSkin(skinId) {
    navigate(`/${userName}/Sell/${skinId}`);
  }

  return (
    <div>
      <h2>{`${userName}'s Skins`}</h2>
      <div className="skin-container">
        {userSkins.map((skinId, index) => (
          <CardComponent
            key={index}
            skinId={skinId}
            username={userName}
            sell={() => sellSkin(skinId)}
          />
        ))}
      </div>
    </div>
  );
}

export default SellDash;
