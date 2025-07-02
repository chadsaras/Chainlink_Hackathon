
  // import React ,{useState, useEffect }from 'react';
// import contractABI from "../abi1.json";
// import Web3 from "web3";
// import axios from 'axios'; // Make sure to import axios for making HTTP requests
// import skinImg from "./assets/Woman-skirt.png";
// import { useParams } from 'react-router-dom';

// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';

// function CardComponent({ username, price, buy }) {
//   return (
//     <Card style={{ width: '18rem' }}>
//       <Card.Img variant="top" src="holder.js/100px180" />
//       <Card.Body>
//         <Card.Title>{username}</Card.Title>
//         <Card.Text>Price: {price}</Card.Text>
//         <Button variant="primary" onClick={buy}>BUY</Button>
//       </Card.Body>
//     </Card>
//   );
// }


// //Ek skin buy karney wala dashbord


// //let web3 = new Web3(window.ethereum); //Sepolia

// let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")); //Ganache
// //window.ethereum

// async function BuySkinPage(props) {

//     //console.log("wallet Address - ",props.WalletAddress);
//     const contractAddress =
//     "0x5070ee85A360899882E907c213cb7147c14466D4";// ganache address
//    // "0xb346d01c452a91f19895F5f26Ef845C1DE87b398"; //Sepolia address
//   let [connectedAccount, setConnectedAccount] = useState(props.WalletAddress);
//   let [gameCompany, setGameCompany] = useState("");
//   let seller;
//   const [skins, setSkins] = useState([]);
//   const { userName, skinId } = useParams();

//   console.log("Buy Skin with skinId - ",skinId);
//   connectWallet();
//   try{
//     const url=`http://localhost:5001/${skinId}`;
//     const res= await axios.get(url);
//     console.log("get data-",res.data);
//     const data = res.data;
//     if (Array.isArray(data)) {
//       setSkins(data);
//     } else {
//       console.log('Expected an array but got:', typeof data);
//     }


//   }catch(e){
//     console.log("Error ");
//   }



//   async function connectWallet() {
//     web3.eth.getAccounts().then((accounts) => {
//       setConnectedAccount(accounts[0]);
//       connectedAccount=accounts[0];

//       setGameCompany(accounts[8]);
//       gameCompany=accounts[8];

//       console.log("Connected account:", accounts[0]);
//       console.log("gameCompany -- ", gameCompany);
//     });

//   }

//   function shortAddress(address, startLength = 6, endLength = 4) {
//     return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
//   }
//   async function BuyConfirmed(skinId){

    
//       console.log("Buy Confirmed");
    
//       try {
//         // Delete the skin from the skinSeller collection
//         await axios.delete(`http://localhost:5001/Suvojit/Buy/${skinId}`);
    
//         // Update the OwnedSkin collection with the purchased skin skinId
//         await axios.put(`http://localhost:5001/Ajitesh/Skin`, {
//           skinIds: [skinId] // Wrap skinId in an array if it's not already an array
//         });
    
//         console.log("Skin deleted and OwnedSkin updated successfully.");
//       } catch (error) {
//         console.error("Error:", error.message);
//       }

//   }
 
//   async function BuySkin(event) { 

//     event.preventDefault(); // Prevent form submission
//     // try {
//     //   // Get the skin skinId from the form input
      
//     //   const url = `http://localhost:5001/Suvojit/Buy/${skinId}`;
//     //   const response = await axios.get(url);
//     //   console.log(response.data);
//     //   const contract = new web3.eth.Contract(contractABI, contractAddress);
//     //   const amountInWei = web3.utils.toWei(response.data.price.toString(), "ether");// Amount to send in wei
//     //   const gasPrice = await web3.eth.getGasPrice(); // Get current gas price
//     //   console.log("Connected Account: ", connectedAccount);
//     //   console.log("Amount in Wei: ", amountInWei);
//     //   console.log("Seller - ", response.data.WalletAddress);
//     //   console.log("Game Company - ", gameCompany);
//     //   console.log("Contract Start- ");
//     //   try {
//     //     const gasLimit = await contract.methods
//     //       .Buy(response.data.WalletAddress, gameCompany)
//     //       .estimateGas({
//     //         from: connectedAccount,
//     //         value: amountInWei,
//     //       });

//     //     await contract.methods
//     //       .Buy(response.data.WalletAddress, gameCompany)
//     //       .send({
//     //         from: connectedAccount,
//     //         value: amountInWei,
//     //         gas: gasLimit,
//     //         gasPrice: gasPrice,
//     //       })
//     //       .on("receipt", (receipt) => {
//     //         console.log("Transaction receipt:", receipt);
//     //         console.log("Transaction hash:", receipt.transactionHash);
//     //       })
//     //       .on("error", (error) => {
//     //         console.error("Transaction error:", error);
//     //       });
//     //   } catch (e) {
//     //     console.error("blockchain error- ", e);
//     //   }
//     // } catch (error) {
//     //   console.error("Buy Error", error.message);
//     // } 
//    // BuyConfirmed(skinId);
//   }

  
//   // useEffect(() => {
//   //   BuySkin(); // Fetch skins when the component mounts
//   // }, []);
 
//   return (<>
  
//       <div className="App">
//         <button onClick={connectWallet}>Connect Wallet</button>
//         {connectedAccount && (
//           <div>
//             <p>Connected: {shortAddress(connectedAccount)}</p>
//             {/* Add more UI elements or actions here */}
//           </div>
//         )}
//         </div>

//         <img src={skinImg} alt="Skin" />
    

//       <br></br>
//       <button onClick={(event) => BuySkin(event)}>Buy Skin</button>
//       <button onClick={BuyConfirmed}>Buy Confirmed</button>
//       <br></br>


//       <div>
//       {skins.map((skin, index) => (
//         <CardComponent 
//           key={index} 
//           username={skin.userName} 
//           price={skin.price} 
//           buy={() => console.log(`Buying skin ${skin.skinId}`)} 
//         />
//       ))}
//     </div>

//   </>
//   );
// }

// export default BuySkinPage;



import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import skinImg from "./assets/Woman-skirt.png";
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import contractABI from "../abi1.json";

function CardComponent({ username, price, buy }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={skinImg} />
      <Card.Body>
        <Card.Title>{username}</Card.Title>
        <Card.Text>Price: {price} ETH</Card.Text>
        <Button variant="primary" onClick={buy}>BUY</Button>
      </Card.Body>
    </Card>
  );
}

function BuySkinPage(props) {
  let [connectedAccount, setConnectedAccount] = useState(null);
  let   [gameCompany, setGameCompany] = useState("");
  const [skins, setSkins] = useState([]);
  const { userName,skinId } = useParams();
      const contractAddress =
    "0x5070ee85A360899882E907c213cb7147c14466D4";// ganache address
   // "0xb346d01c452a91f19895F5f26Ef845C1DE87b398"; //Sepolia address

  let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Ganache
 //let web3 = new Web3(window.ethereum); //Sepolia
  useEffect(() => {
    async function fetchSkins() {
      try {
        const url = `http://localhost:5001/${skinId}`;
        const res = await axios.get(url);
        const data = res.data;
        if (Array.isArray(data)) {
          setSkins(data);
        } else {
          console.log('Expected an array but got:', typeof data);
        }
      } catch (e) {
        console.log("Error fetching skins: ", e);
      }
    }

    fetchSkins();
  }, [skinId]);//Taaki ek hi baar call ho
  

  async function connectWallet() {
    const accounts = await web3.eth.getAccounts();
    setConnectedAccount(accounts[0]);
    connectedAccount=accounts[0];
    console.log("Connected account:", accounts[0]);
      setGameCompany(accounts[8]);
      gameCompany=accounts[8];
        // if (window.ethereum) {
    //   try {
    //     // Request access to MetaMask accounts
    //     const accounts = await window.ethereum.request({
    //       method: "eth_requestAccounts",
    //     });
    //     if (accounts.length > 0) {
    //       setConnectedAccount(accounts[0]);
    //       console.log("Connected account:", accounts[0]);
    //       setSeller(accounts[2]);
    //       setGameCompany(accounts[1]);
    //       console.log("seller -- ", seller);
    //       console.log("gameCompany -- ", gameCompany);
    //       // Initialize Web3 and contract here if needed
    //     }
    //   } catch (error) {
    //     if (error.code === 4001) {
    //       console.log("User rejected account access");
    //     } else {
    //       console.error("Error:", error);
    //     }
    //   }
    // } else {
    //   console.error("MetaMask not found");
    // }  
  }

  async function BuySkin(skin) {

    console.log("Buying skin: ", skin);
    
    try {
      await connectWallet();
 
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const amountInWei = web3.utils.toWei(skin.price.toString(), "ether");
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await contract.methods
        .Buy(skin.WalletAddress, gameCompany)
        .estimateGas({
          from: connectedAccount,
          value: amountInWei,
        });
      console.log("Amount in wei : ",amountInWei,"\nConnect Account :",connectedAccount,"\nGameCompany :",gameCompany,"\nseller :",skin.WalletAddress);  


      // Display a confirmation dialog
      const confirmed = window.confirm(`Are you sure you want to buy the skin from ${skin.userName} for ${skin.price} ETH?`);
      
      if (!confirmed) {
        return; // Exit the function if not confirmed
      }

      try {
      await contract.methods
        .Buy(skin.WalletAddress, gameCompany)
        .send({
          from: connectedAccount,
          value: amountInWei,
          gas: gasLimit,
          gasPrice: gasPrice,
        })
        .on("receipt", (receipt) => {
          console.log("Transaction receipt:", receipt);
          console.log("Transaction hash:", receipt.transactionHash);
        })
        .on("error", (error) => {
          console.error("Transaction error:", error);
        });


      // Update the server
      await axios.delete(`http://localhost:5001/${skin.userName}/Buy/${skin.skinId}`);
      await axios.put(`http://localhost:5001/${userName}/Skin`, {
        skinIds: [skin.skinId]
      });
      } catch (error) {

        console.error("Error in buying skin:", error);
      }


      console.log("Skin bought and database updated successfully.");
    } catch (error) {
      console.error("Error in buying skin:", error);
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
        {skins.map((skin, index) => (
          <CardComponent 
            key={index} 
            username={skin.userName} 
            price={skin.price} 
            buy={() => BuySkin(skin)} 
          />
        ))}
      </div>
    </>
  );
}

export default BuySkinPage;
