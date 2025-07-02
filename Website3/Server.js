const express = require("express");
const mongoose = require("mongoose");
const OwnedSkin = require("./model.js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB Connection
mongoose
	.connect(
		"mongodb+srv://Ajitesh:Ajitesh9877@cluster0.yz6u5fv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => {
		console.log("MongoDB Connected");
	})
	.catch((err) => {
		console.error("MongoDB Connection Error:", err);
	});

//________________________________________________________________________________________________________________________________________________________________________

//Server and smart contract  will go hand in hand
//contract me there is one mapping userName--> {userName, skinIds[]}
//contract se data laney ki jaruat nhi as jab bhi buy sell karey hai apney app api call horey hai

// Route to get all skins owned by a specific username
const getSkins = async (input, res) => {
	//function to get user skins
	let output = {
		jobRubId: input.id,
		data: {},
		statusCode: 0,
	};
	try {
		// Find all the skins owned by the specified username
		const ownedSkins = await OwnedSkin.find({
			userName: input.data.username,
		});
		// Return the owned skins as JSON response
		output.data = {
			result: ownedSkins[0].skinId.toString(),
			haveSkins: input.data.haveSkins,
		};
		output.statusCode = 200;
		res.json(output);
	} catch (error) {
		// If an error occurs, return an error response
		console.log("error getting skins : ", error.message);
		output.error = error.message;
		output.statusCode = 402;

		res.json(output);
	}
};

//remove specific skin
const removeSkin = async (input, res) => {
	//delete karney ke liye hai
	const input = req.body;
	let output = {
		jobRubId: input.id,
		data: {},
		statusCode: 0,
	};

	const skinIds = input.data.skinIds; //for multiple skins add;
	// ["1", "2"];
	skinIds = skinIds.map((x) => parseInt(x));

	try {
		// Find the user by username
		const userSkin = await OwnedSkin.findOneAndUpdate(
			{ userName: input.data.username },
			{ $pull: { skinId: skinIds["0"] } }, // Remove the specified ID from the array
			{ new: true } // Return the updated document
		);
		if (!userSkin) {
			console.log("User Not Found");
			output.error = "User not found";
			output.statusCode = 404;

			return res.json(output);
		}
		console.log(
			"Success in removing skins from user : ",
			userSkin.userName,
			"\nskinId : ",
			userSkin.skinId
		);
		output.data = { result: "Success" };
		output.statusCode = 200;
		res.json(output);
	} catch (error) {
		output.error = error.message;
		output.statusCode = 402;

		res.json(output);
	}
};

// Route to add a new skin owned by a specific username (using PUT request)
const addSkin = async (input, res) => {
	//jo bi array ayega wo bass add hoga remove khcuch  bi nhai hoga
	let output = {
		jobRubId: input.id,
		data: {},
		statusCode: 0,
	};

	const username = input.data.username;
	const skinIds = input.data.skinIds; //for multiple skins add;
	// ["1", "2"];
	skinIds = skinIds.map((x) => parseInt(x));

	if (!Array.isArray(skinIds)) {
		console.log("skinIds should be an array of numbers");
		output.error = "skinIds should be an array of numbers";
		output.statusCode = 404;

		return res.json(output);
	}

	try {
		// Find the user by username
		let userSkin = await OwnedSkin.findOne({ userName: username });

		if (userSkin) {
			// If user exists, add new skin IDs to the array, avoiding duplicates
			userSkin.skinId = [...new Set([...userSkin.skinId, ...skinIds])];
			console.log();
		} else {
			// If user does not exist, create a new document
			userSkin = new OwnedSkin({
				userName: username,
				skinId: skinIds,
			});
		}

		// Save the document
		await userSkin.save();

		// Return the updated document as JSON response
		console.log(
			"Successfully added skins to username : ",
			userSkin.userName,
			"\nskinIds : ",
			userSkin.skinId
		);
		output.data = { result: "Success" };
		output.statusCode = 200;
		res.json(output);
	} catch (error) {
		// If an error occurs, return an error response
		console.log("Error adding skins to username : ", username);
		output.error = error.message;
		output.statusCode = 402;
		res.json(output);
	}
};

app.post("/", async (req, res) => {
	console.log("Post req recived with input : ", req.body);
	const input = req.body;
	switch (input.data.type) {
		case "BUY":
			return await addSkin(input, res);
		case "CHECK":
			return await getSkins(input, res);
		case "SELL":
			return await removeSkin(input, res);
	}
});

app.post("/addSkinToUser", async (req, res) => {
	const input = req.body;
	let output = {
		jobRubId: input.id,
		data: {},
		statusCode: 0,
	};

	try {
		// Create a new OwnedSkin document with the provided username and skinId
		const newOwnedSkin = await OwnedSkin.create({
			userName: input.data.username,
			skinId: input.data.skinId,
		});

		// Save the newOwnedSkin document to the database
		await newOwnedSkin.save();

		console.log(
			"Successfully added skins to username : ",
			newOwnedSkin.userName,
			"\nskinIds : ",
			newOwnedSkin.skinId
		);

		// Return the savedOwnedSkin as JSON response
		output.data = { result: "Success" };
		output.statusCode = 200;
		res.json(output);
	} catch (error) {
		// If an error occurs, return an error response
		output.error = error.message;
		output.statusCode = 402;

		res.json(output);
	}
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
