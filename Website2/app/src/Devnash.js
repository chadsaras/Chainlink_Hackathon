//mport the Web3 library

const { Web3 } = require("web3");
const web3 = new Web3(
  Web3.givenProvider ||
    "https://sepolia.infura.io/v3/3de1dfa83d77414f9e271ade5ca4f5d5"
);

// Replace with your contract's ABI
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "newMessage",
        type: "string",
      },
    ],
    name: "MessageSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newMessage",
        type: "string",
      },
    ],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMessage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Replace with your contract's address
const contractAddress = "0x89757E1f5216a0dF20D9E848286E6B60faBB6B8d";

// Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

async function setMessage() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const message = document.getElementById("messageInput").value;
  await contract.methods.setMessage(message).send({ from: accounts[0] });
  alert("Message set successfully");
}

async function getMessage() {
  const message = await contract.methods.getMessage().call();
  document.getElementById("messageDisplay").innerText = message;
}

// // Enable Ethereum provider
// window.addEventListener("load", function () {
//   if (typeof window.ethereum !== "undefined") {
//     console.log("MetaMask is installed!");
//   } else {
//     alert("Please install MetaMask to use this DApp.");
//   }
// });
