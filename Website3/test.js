// // test.js

// const { Web3 } = require("web3");
// const Network = require("@maticnetwork/meta/network");
// let privateKey = `c5ca4a4e2db534220b24328d258ff0c155c8f99837f93426b6d6a056b2d67c6f`;
// const network = new Network("testnet", "Amoy");

// const main = new Web3(network.Main.RPC);
// const matic = new Web3(network.Matic.RPC);

// matic.eth.accounts.wallet.add(privateKey);
// main.eth.accounts.wallet.add(privateKey);

// let receiverAddress = `0x6eE784F5f90321E1E31d5048992Ee4792934547e`;
// let senderAddress = `0xd07c92b5cB7511C371B7E2aC166Ed520A878Cb26`;

// let receiverABI = [
//   {
//     inputs: [],
//     name: "lastChildData",
//     outputs: [
//       {
//         internalType: "bytes",
//         name: "",
//         type: "bytes",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "lastStateId",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "stateId",
//         type: "uint256",
//       },
//       {
//         internalType: "bytes",
//         name: "data",
//         type: "bytes",
//       },
//     ],
//     name: "onStateReceive",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

// let senderABI = [
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "sender",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "receiver",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "bytes",
//         name: "data",
//         type: "bytes",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "states",
//         type: "uint256",
//       },
//     ],
//     name: "StateSent",
//     type: "event",
//   },
//   {
//     inputs: [],
//     name: "receiver",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "bytes",
//         name: "data",
//         type: "bytes",
//       },
//     ],
//     name: "sendState",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "stateSenderContract",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "states",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// let sender = new main.eth.Contract(senderABI, senderAddress);
// let receiver = new matic.eth.Contract(receiverABI, receiverAddress);

// // data to sync
// function getData(string) {
//   let data = matic.utils.asciiToHex(string);
//   return data;
// }

// function getString(data) {
//   let string = matic.utils.hexToAscii(data);
//   return string;
// }

// // console.log(getData('Sending a state sync! :) '))

// async function sendData(data) {
//   let r = await sender.methods.sendState(getData(data)).send({
//     from: main.eth.accounts.wallet[0].address,
//     gas: 8000000,
//   });
//   console.log("Sent data from root, transaction hash:", r.transactionHash);
// }

// async function checkSender() {
//   let r = await sender.methods.states().call();
//   console.log("Number of states sent from sender:", r);
// }

// async function checkReceiver() {
//   let r = await receiver.methods.lastStateId().call();
//   let s = await receiver.methods.lastChildData().call();
//   console.log("Last state id:", r, "and last data:", s);
//   console.log("Interpreted data:", getString(s));
// }

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function test() {
//   await sendData("Hello World !");
//   await checkSender();
//   // Add a timeout here to allow time gap for the state to sync
//   await sleep(60000); // Wait for 60 seconds
//   await checkReceiver();
// }

// test();

// test.js

const { Web3 } = require("web3");
const Network = require("@maticnetwork/meta/network");

const network = new Network("testnet", "amoy");

const main = new Web3(network.Main.RPC);
const matic = new Web3(network.Matic.RPC);

let privateKey = `0xc5ca4a4e2db534220b24328d258ff0c155c8f99837f93426b6d6a056b2d67c6f`;
matic.eth.accounts.wallet.add(privateKey);
main.eth.accounts.wallet.add(privateKey);

let receiverAddress = `0x6eE784F5f90321E1E31d5048992Ee4792934547e`;
let receiverABI = `[
	{
		"inputs": [],
		"name": "lastChildData",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastStateId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "stateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "onStateReceive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`;
let senderAddress = `0xd07c92b5cB7511C371B7E2aC166Ed520A878Cb26`;
let senderABI = `[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "states",
				"type": "uint256"
			}
		],
		"name": "StateSent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "receiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "sendState",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stateSenderContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "states",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`;

let sender = new main.eth.Contract(JSON.parse(senderABI), senderAddress);
let receiver = new matic.eth.Contract(JSON.parse(receiverABI), receiverAddress);

// data to sync
function getData(string) {
  let data = matic.utils.asciiToHex(string);
  return data;
}

function getString(data) {
  let string = matic.utils.hexToAscii(data);
  return string;
}

// console.log(getData('Sending a state sync! :) '))

async function sendData(data) {
  let r = await sender.methods.sendState(getData(data)).send({
    from: main.eth.accounts.wallet[0].address,
    gas: 8000000,
  });
  console.log("sent data from root, ", r.transactionHash);
}

async function checkSender() {
  let r = await sender.methods.states().call();
  console.log("number of states sent from sender: ", r);
}

async function checkReceiver() {
  let r = await receiver.methods.lastStateId().call();
  let s = await receiver.methods.lastChildData().call();
  console.log("last state id: ", r, "and last data: ", s);
  console.log("interpreted data: ", getString(s));
}

async function test() {
  await sendData("Hello World !");
  await checkSender();
  await sleep(60000); // add a timeout here to allow time gap for the state to sync
  await checkReceiver();
}

test();
