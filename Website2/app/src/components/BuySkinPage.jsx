// import React, { useState ,useEffect} from 'react';
// import Web3 from 'web3';
// import skinImg from "./assets/Woman-skirt.png";
// import { useParams } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import skinMarketABI from './abis/skinMarket.json';



// function CardComponent({ username, price,buy}) {
//   return (
//     <Card style={{ width: '18rem' }}>
//       <Card.Img variant="top" src={skinImg} />
//       <Card.Body>
//         <Card.Title>{username}</Card.Title>
//         <Card.Text>Price: {price} ETH</Card.Text>
//         <Button variant="primary" onClick={buy}>BUY</Button>
//       </Card.Body>
//     </Card>
//   );
// }

// function BuySkinPage() {
//   let connectedAccount;
//   const [skins, setSkins] = useState([]);//yeh pura card component hoga .....maaney isme sarey react waale cards store hogey
//   let sellers; //sellers of particular skin ka array
//   let seller;//ek seller
//   const skinMarketAdd = "0x0DedDe527e2B24a6c2B3bF5F3E7488517E37F3AD"; // Ganache address
//   const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Ganache
//   const { userName,skinId } = useParams();

//   useEffect(() => {
//     ShowAllSkinOfId();
//   }, [1]); // Empty dependency array makes this effect run only once, on component mount


//   async function connectWallet() {//function jissey wallet connect hojayega
//     try {
//       const accounts = await web3.eth.getAccounts();
//       connectedAccount=accounts[0];
//       console.log("Connected account:", accounts[0]);
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     }
//   }

//   async function ShowAllSkinOfId() {
//     const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
//     try {
//       sellers = await skinMarket.methods.getSellers(skinId).call();
//       console.log(sellers);

//         //sellers will be kinda this type - 
//         //         [{…}]
//         // 0
//         // : 
//         // {0: 0n, 1: 'Devansh', 2: '0xeE3bbfDC858F71d0Ab57f17F3585db1b4DA68574', 3: 100000n, 4: '0x511d5A0649630213E26c071b861c5cB1A8609346', __length__: 5, id: 0n, userName: 'Devansh', walletAddress: '0xeE3bbfDC858F71d0Ab57f17F3585db1b4DA68574', price: 100000n, …}
//         // length
//         // : 
//         // 1
//         // [[Prototype]]
//         // : 
//         // Array(0)

//         //sellers is array

//       if (sellers.length === 0) {
//         console.log("No sellers available for this skin ID");
//       } else {
//         const sellerCards = sellers.map((seller, index) => (
//           <CardComponent 
//             key={index} 
//             username={seller.userName}  // Username is at index 1 in the seller array
//             price={web3.utils.fromWei(seller.price.toString(), 'ether')} // Price is at index 3 in the seller array
//             buy={() => BuySkin(index)} // Pass the seller object to BuySkin function
//           />
//         ));
//         setSkins(sellerCards);

//       }
//     } catch (error) {
//       console.error("Error fetching sellers:", error);
//     }
//   }

//   function setSeller(id){
//     seller=sellers[id];
//   }

//   async function BuySkin(id) {
//     // Buy the skin
//     // Use the skinMarket contract to buy the skin
//     // Use the skinOwner contract to transfer the skin to the buyer
//     console.log("Buy skin");
//     setSeller(id);
//     const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
//     await connectWallet(); 
//     const amountInWei = seller[3];
//     const gasPrice = await web3.eth.getGasPrice();
//     const gasLimit = await skinMarket.methods
//       .buySkin(seller[1],skinId,seller[0])
//       .estimateGas({
//         from: connectedAccount,
//         value: amountInWei,
//       });
//     console.log("your username: ",userName,"Amount in wei : ",amountInWei,"\nConnect Account :",connectedAccount,"\nGasPrice :",gasPrice,"\nseller:",seller[2]);  
//     // Display a confirmation dialog
//     const confirmed = window.confirm(`Are you sure you want to buy the skin from ${seller[1]}  for   ${seller[3]} wei?`);
      
//       if (!confirmed) {
//         return; // Exit the function if not confirmed
//       }

//     try {
//       console.log(seller[1],skinId,id);
//       await skinMarket.methods
//            .buySkin(seller[1],skinId,id)
//            .send({
//            from: connectedAccount,
//            value: amountInWei,
//            gas: gasLimit,
//            gasPrice: gasPrice,
//           })
//         .on("receipt", (receipt) => {
//           console.log("Transaction receipt:", receipt);
//           console.log("Transaction hash:", receipt.transactionHash);
//         })
//         .on("error", (error) => {
//           console.error("Transaction error:", error);
//         });
//       console.log("Buying skin from:", seller);
//     } catch (error) {
//       console.error("Error buying skin:", error);
//     }
//   }

//   function shortAddress(address, startLength = 6, endLength = 4) {
//     return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
//   }
//   async function BuySkinFromGame(skinId, price) {
//     console.log("from ; ",connectedAccount,"\nSkin id : ",skinId,"\nUsername : ",userName)
//     const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
//     try {
//       await skinMarket.methods.buyFromGame(skinId, userName).send({
//         from: connectedAccount,
//         value: price,
//       });
//       alert("Skin purchased successfully from game!");
//     } catch (error) {
//       console.error("Error buying skin from game:", error);
//       alert("Error buying skin from game: " + error.message);
//     }
//   }

//   return (
//     <>
//       <div className="App">
//         <button onClick={connectWallet}>Connect Wallet</button>
//         {connectedAccount && (
//           <div>
//             <p>Connected: {shortAddress(connectedAccount)}</p>
//           </div>
//         )}
//       </div>

//       <div>
//         {skins}
//       </div>
//     </>
//   );
// }

// export default BuySkinPage;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import skinMarketABI from './abis/skinMarket.json';
import id0 from "./assets/Bacchi.png";
import id1 from "./assets/woman.png";
import id2 from "./assets/Woman-cloth.png";
import id3 from "./assets/Woman-skirt.png"

// Map skinId to corresponding image import
const skinImages = {
  0: id0,
  1: id1,
  2: id2,
  3: id3,
};

function CardComponent({ username, price, buy }) {
  const {skinId}=useParams();
 
  const [skinImage] = useState(skinImages[skinId]);
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={skinImage} />
      <Card.Body>
        <Card.Title>{username}</Card.Title>
        <Card.Text>Price: {price} ETH</Card.Text>
        <Button variant="primary" onClick={buy}>BUY</Button>
      </Card.Body>
    </Card>
  );
}

function BuySkinPage() {
  const [skins, setSkins] = useState([]);
  let connectedAccount;
  let sellers ;
  let seller;
  const skinMarketAdd = "0x0DedDe527e2B24a6c2B3bF5F3E7488517E37F3AD"; // Ganache address
  const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Ganache
  const { userName, skinId } = useParams();

  useEffect(() => {
    connectWallet();
    ShowAllSkinOfId();
  }, []); // Empty dependency array makes this effect run only once, on component mount

  async function connectWallet() {
    try {
      const accounts = await web3.eth.getAccounts();
      connectedAccount=accounts[6];
      console.log("Connected account:", accounts[6]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  async function ShowAllSkinOfId() {
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
    try {
      sellers = await skinMarket.methods.getSellers(skinId).call();
      const gamePrice = await skinMarket.methods.getSkinPriceFromGame(skinId).call();

      const sellerCards = sellers.map((seller, index) => (
        <CardComponent 
          key={index} 
          username={seller.userName} // Username is at index 1 in the seller array
          price={web3.utils.fromWei(seller.price.toString(), 'ether')} // Price is at index 3 in the seller array
          buy={() => BuySkin(index)} // Pass the seller object to BuySkin function
        />
      ));

      if (gamePrice > 0) {
        const gameCard = (
          <CardComponent
            key="game-skin"
            username="Game"
            price={web3.utils.fromWei(gamePrice, 'ether')}
            buy={() => BuySkinFromGame()}
          />
        );
        setSkins([...sellerCards, gameCard]);
      } else {
        setSkins(sellerCards);
      }

    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  }

  async function BuySkinFromGame() {
    const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);

    try {
      const price =await skinMarket.methods.getSkinPriceFromGame(skinId).call();
      const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = await skinMarket.methods
          .buyFromGame(skinId, userName)
          .estimateGas({
            from: connectedAccount,
            value: price,
            
          });
      console.log("Skin Id :",skinId,
        "\nUserName :",userName,  
        "\nprice",price,
      "\ngasLimit: ",gasLimit);
      await skinMarket.methods.buyFromGame(skinId, userName).send({
        from: connectedAccount,
        value: price,
        gas: gasLimit,
        gasPrice: gasPrice,
      });
      alert("Skin purchased successfully from game!");
      ShowAllSkinOfId();
    } catch (error) {
      console.error("Error buying skin from game:", error);
      alert("Error buying skin from game: " + error.message);
    }
  }

  async function BuySkin(id) {
        // Buy the skin
        // Use the skinMarket contract to buy the skin
        // Use the skinOwner contract to transfer the skin to the buyer
        console.log("Buy skin");
        seller=sellers[id];
        const skinMarket = new web3.eth.Contract(skinMarketABI, skinMarketAdd);
        await connectWallet(); 
        const amountInWei = seller[3];
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = await skinMarket.methods
          .buySkin(userName,skinId,seller[0])
          .estimateGas({
            from: connectedAccount,
            value: amountInWei,
            
          });
        console.log("your username: ",userName,"Amount in wei : ",amountInWei,"\nConnect Account :",connectedAccount,"\nGasPrice :",gasPrice,"\nseller:",seller[2]);  
        // Display a confirmation dialog
        const confirmed = window.confirm(`Are you sure you want to buy the skin from ${seller[1]}  for   ${seller[3]} wei?`);
          
          if (!confirmed) {
            return; // Exit the function if not confirmed
          }
    
        try {
          console.log(userName,skinId,id);
          await skinMarket.methods
               .buySkin(userName,skinId,id)
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
          console.log("Buying skin from:", seller);
        } catch (error) {
          console.error("Error buying skin:", error);
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

export default BuySkinPage;
