// import React, { useState ,useEffect,useRef} from 'react';
// import axios from 'axios'; // Make sure to import axios for making HTTP requests
// import Web3 from "web3";
// import { useParams } from 'react-router-dom';

// //let web3 = new Web3(window.ethereum); //Sepolia

// let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")); //Ganache
// function SellSkin(props) {

//   const { userName, skinId } = useParams();
//   const avgPriceRef = useRef(0); 


//   const [price, setPrice] = useState(0);
//   let connectedAccount;


//   useEffect(() => {
//     async function fetchSkins() {
//       try {
//         const url = `http://localhost:5001/${skinId}`;
//         const res = await axios.get(url);
//         const data = res.data;
//         if (Array.isArray(data)) {
//           console.log(data);
//           let sumPrice = 0; // Declare sumPrice inside useEffect
//           for (let i = 0; i < data.length; i++) {
//             sumPrice += data[i].price;
//           }
//           console.log("sumPrice -- ", sumPrice);
//           //print Avg
//           console.log("Avg price -- ", sumPrice / data.length);
          
//           // Assign sumPrice to sumPriceRef.current to persist its value across renders
//           avgPriceRef.current = sumPrice / data.length;
          
//         } else {
          
//           console.log('Expected an array but got:', typeof data);
//         }
//       } catch (e) {
//         console.log("Error fetching skins: ", e);
//       }
//     }
//     fetchSkins();
//   }, [skinId]);//Taaki ek hi baar call ho

//   async function connectWallet() {
//     return web3.eth.getAccounts().then((accounts) => {


//       return accounts[0];
//     });
//   }




//   async function sellSkin(event) {
//     event.preventDefault(); // Prevent form submission
//     connectedAccount=await connectWallet();
//     console.log("connectedAccount -- ",connectedAccount);

//     //show the current avg price 

//     try {
//         const url = `http://localhost:5001/${userName}/Sell/${skinId}`;
//         const response = await axios.post(url, {
//           price: price, // Sending only the price in the request body
//           WalletAddress:connectedAccount
//         });

//         console.log(response.data); // Log response data

//         //delete skin from user;
//         const url1 = `http://localhost:5001/${userName}/Skin/${skinId}`;
//         const response1 = await axios.put(url1);
//         console.log(response1.data); // Log response data

//       } catch (error) {
//         console.error("Error", error.message);
//       }

//   }

//   return (
//     <>
//     <div className="container">
//       <h1>Sell Skin</h1>
//       <p>Avg price: {avgPriceRef.current}</p>
//       <p>Enter price to sell</p>

//       <input
//         type='number'
//         value={price}
//         onChange={(e) => setPrice(e.target.value)} // Update price state when input changes
//         placeholder="Enter price"
//       />
//       <br />
//       <button onClick={sellSkin}>Sell Skin</button>
//     </div>
//     </>
//   );
// }

// export default SellSkin;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Web3 from "web3";
import { useParams } from 'react-router-dom';
import skinImg from "./assets/Woman-skirt.png";

function SellSkin(props) {
  const { userName, skinId } = useParams();
  const avgPriceRef = useRef(0);
  const [price, setPrice] = useState(0);
  
  useEffect(() => {
    async function fetchSkins() {
      try {
        const url = `http://localhost:5001/${skinId}`;
        const res = await axios.get(url);
        const data = res.data;
        
        if (Array.isArray(data)) {
          let sumPrice = data.reduce((acc, curr) => acc + curr.price, 0);
          avgPriceRef.current = sumPrice / data.length;
        } else {
          console.log('Expected an array but got:', typeof data);
        }
      } catch (e) {
        console.log("Error fetching skins: ", e);
      }
    }
    
    fetchSkins();
  }, [skinId]);
  
  async function connectWallet() {
    const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
    const accounts = await web3.eth.getAccounts();
    return accounts[4];//yeh 0 hoga........................
  }

  async function sellSkin(event) {
    event.preventDefault();
    const connectedAccount = await connectWallet();
    console.log("Wallet Address -- ", connectedAccount,"Price - ",price,"UserNAme  : ",userName);
    try {
      //1st database update karke usme seller details daalra------Isme GameCompany daalana hai .................
      const url = `http://localhost:5001/${userName}/Sell/${skinId}`;
      const response = await axios.post(url, {
        price: price,
        WalletAddress: connectedAccount
      });

      console.log(response.data);

      //Yeh 2nd Database Update karra hai jise wo skin delete hojaye user se.........issey buy confirm honey ke baad bhi daal saktey hai
      const url1 = `http://localhost:5001/${userName}/Skin/${skinId}`;
      const response1 = await axios.put(url1);
      console.log(response1.data);

    } catch (error) {
      console.error("Error", error.message);
    }
  }

  return (
    <div className="container">
      <h1>Sell Skin</h1>
      <img src={skinImg} alt="skin" />
      <p>Avg price: {avgPriceRef.current}</p>
      <p>Enter price to sell</p>

      <input
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
      />
      <br />
      <button onClick={sellSkin}>Sell Skin</button>
    </div>
  );
}

export default SellSkin;
