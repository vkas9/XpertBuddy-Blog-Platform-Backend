const mongoose = require("mongoose");

require("dotenv").config();

exports.dbConnect = async () => {
  try {
    mongoose.connect(process.env.MONGODB).then(() => {
      console.log("Successfully Connected to DB");
    });
  } catch (error) {
    console.log("Unable to connect to the database. Please try again later.");
      console.log(error);
      process.exit(1);
  }
};
