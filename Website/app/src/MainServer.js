const express = require("express");
const mongoose = require("mongoose");
const skinSeller = require("./model/skinSeller.js");

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

//1st database - SkinId  - Seller
// Route to get all sellers with a specific skinId
app.get("/:id", async (req, res) => {
  try {
    const skinId = req.params.id;
    console.log("Get Request with skin id - ", skinId);
    // Find all skins with the given skinId
    const skins = await skinSeller.find({ skinId: skinId });

    if (skins.length === 0) {
      return res.status(404).json({ message: "Skins not found" });
    }

    // Return the array of skins
    res.json(skins);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//sell skin by a user
app.post("/:userName/Sell/:id", async (req, res) => {
  const skinId = req.params.id;
  const userName = req.params.userName;
  console.log("Post request with req.body - ", req.body);
  try {
    const newSkinSeller = await skinSeller.create({
      userName: userName,
      skinId: skinId,
      price: req.body.price,
      WalletAddress: req.body.WalletAddress,
      //req.body.price, // Corrected line
    });
    res.status(201).json(newSkinSeller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Skin buyed by someone so delete the data
// Assuming "skinSeller" is the model for the first database

app.delete("/:username/Buy/:id", async (req, res) => {
  const { username, id } = req.params;

  try {
    // Find and delete the skin with the given username and ID
    const deletedSkin = await skinSeller.findOneAndDelete({
      userName: username,
      skinId: id,
    });

    if (!deletedSkin) {
      // If skin is not found, return 404 Not Found
      return res.status(404).json({ message: "Skin not found" });
    }

    // Return the deleted skin as JSON response
    res.status(200).json(deletedSkin);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(500).json({ message: error.message });
  }
});

//***********************************************************************2nd database */
//***********************************************************************2nd database *///***********************************************************************2nd database */

const OwnedSkin = require("./model/OwnedSkins.js");

//2nd Database - Owned Skins
app.get("/:username/Skin", async (req, res) => {
  const { username } = req.params;

  try {
    // Find all the skins owned by the specified username
    const ownedSkins = await OwnedSkin.find({ userName: username });

    // Return the owned skins as JSON response
    res.json(ownedSkins);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new skin owned by a specific username
app.post("/:username/Skin", async (req, res) => {
  const { username } = req.params;
  const skinId = req.body;

  try {
    // Create a new OwnedSkin document with the provided username and skinId
    const newOwnedSkin = await OwnedSkin.create({
      userName: username,
      skinId: skinId,
    });

    // Save the newOwnedSkin document to the database
    const savedOwnedSkin = await newOwnedSkin.save();

    // Return the savedOwnedSkin as JSON response
    res.status(201).json(savedOwnedSkin);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(400).json({ message: error.message });
  }
});

// Route to add a new skin owned by a specific username (using PUT request)
app.put("/:username/Skin", async (req, res) => {
  const { username } = req.params;
  const { skinIds } = req.body;

  if (!Array.isArray(skinIds)) {
    return res
      .status(400)
      .json({ message: "skinIds should be an array of numbers" });
  }

  try {
    // Find the user by username
    let userSkin = await OwnedSkin.findOne({ userName: username });

    if (userSkin) {
      // If user exists, add new skin IDs to the array, avoiding duplicates
      userSkin.skinId = [...new Set([...userSkin.skinId, ...skinIds])];
    } else {
      // If user does not exist, create a new document
      userSkin = new OwnedSkin({
        userName: username,
        skinId: skinIds,
      });
    }

    // Save the document
    const savedUserSkin = await userSkin.save();

    // Return the updated document as JSON response
    res.status(200).json(savedUserSkin);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(500).json({ message: error.message });
  }
});

//remove specific skin
app.put("/:username/Skin/:id", async (req, res) => {
  const { username, id } = req.params;

  try {
    // Find the user by username
    const userSkin = await OwnedSkin.findOneAndUpdate(
      { userName: username },
      { $pull: { skinId: parseInt(id) } }, // Remove the specified ID from the array
      { new: true } // Return the updated document
    );

    if (!userSkin) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userSkin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
