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

//____________________________________________-______________________-______________________-______________________-______________________-______________________-

//Server and smart contract  will go hand in hand
//contract me there is one mapping userName--> {userName, skinIds[]}
//contract se data laney ki jaruat nhi as jab bhi buy sell karey hai apney app api call horey hai

// Route to get all skins owned by a specific username
app.get("/:username", async (req, res) => {
  //function to get user skins
  const { username } = req.params;

  try {
    // Find all the skins owned by the specified username
    const ownedSkins = await OwnedSkin.find({ userName: username });
    // Return the owned skins as JSON response

    res.json(ownedSkins[0].skinId);
  } catch (error) {
    // If an error occurs, return an error response
    res.status(500).json({ message: error.message });
  }
});

//remove specific skin
app.put("/:username/SkinRemove/:id", async (req, res) => {
  //delete karney ke liye hai
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

// Route to add a new skin owned by a specific username (using PUT request)
app.put("/:username/SkinAdd", async (req, res) => {
  //jo bi array ayega wo bass add hoga remove khcuch  bi nhai hoga
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

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
