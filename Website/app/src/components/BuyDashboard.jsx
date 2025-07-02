import React ,{useState}from 'react';
import contractABI from "../abi1.json";
import Web3 from "web3";
import bacchiImg from "./assets/Bacchi.png";
import { Link } from 'react-router-dom';


//Default dashboard rahega

//let web3 = new Web3(window.ethereum); //Sepolia

let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")); //Ganache
//window.ethereum

function BuyDash() {
    const contractAddress =
    "0x5070ee85A360899882E907c213cb7147c14466D4";// ganache address
    //"0xb346d01c452a91f19895F5f26Ef845C1DE87b398"; //Sepolia address
  const [connectedAccount, setConnectedAccount] = useState("");
  const [seller, setSeller] = useState("");
  const [gameCompany, setGameCompany] = useState("");

  async function connectWallet() {
    web3.eth.getAccounts().then((accounts) => {
      setConnectedAccount(accounts[0]);
      setSeller(accounts[3]);
      setGameCompany(accounts[1]);
      console.log("Connected account:", accounts[0]);
      console.log("seller -- ", seller);
      console.log("gameCompany -- ", gameCompany);
    });
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

  function shortAddress(address, startLength = 6, endLength = 4) {
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }
  async function Buy() {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const amountInWei = web3.utils.toWei("1", "ether"); // Amount to send in wei
    const gasPrice = await web3.eth.getGasPrice(); // Get current gas price
    console.log("Connected Account: ", connectedAccount);

    try {
      const gasLimit = await contract.methods
        .Buy(seller, gameCompany)
        .estimateGas({
          from: connectedAccount,
          value: amountInWei,
        });

      await contract.methods
        .Buy(seller, gameCompany)
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
    } catch (e) {
      console.error(e);
    }
  }

  async function getContractAddresses() {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      const owner = await contract.methods.owner().call();

      console.log("Owner:", owner);
      console.log("Seller:", seller);
      console.log("Game Company:", gameCompany);
    } catch (error) {
      console.error("Error:", error);
    }
  }




  return (<>
  
      <div className="App">
        <button onClick={connectWallet}>Connect Wallet</button>
        {connectedAccount && (
          <div>
            <p>Connected: {shortAddress(connectedAccount)}</p>
            {/* Add more UI elements or actions here */}
          </div>
        )}
      </div>
      <br></br>
      <button onClick={getContractAddresses}>Get Details</button>

      <br></br>
      <button onClick={Buy}>Buy</button>
      <br></br>
     
      <br></br>
        <img src={bacchiImg} alt="bacchi" />
        <br></br>
        <Link to={{
      pathname: '/Ajitesh/Buy/1',
      state:{WalletAddress:1}
    }}>
      <button>BUY SKIN</button>
    </Link>


  </>
  );
}

export default BuyDash;