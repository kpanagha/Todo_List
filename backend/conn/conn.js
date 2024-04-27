const mongoose = require("mongoose");

const conn = async(req, res) => {
  await mongoose
  .connect(process.env.MONGODBURL)
  .then( () => {
    console.log("Connected");
  })
};
 

conn();