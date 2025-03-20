const mongoose = require("mongoose");
const env = require("dotenv");

env.config();
const dbconnection = async () => {
  mongoose
    .connect(process.env.DB_HOST)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error(err));
};
module.exports = dbconnection;
