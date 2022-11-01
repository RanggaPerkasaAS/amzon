const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

// call routers
const users = require("./routers/users");
const { login } = require("./routers/auth");
const product = require("./routers/product");
const cart = require("./routers/cart");

//routing
app.use("/users", users);
app.use("/login", login);
app.use("/product", product);
app.use("/cart", cart);

//connection DB
mongoose.connect(process.env.DB_URL);
let db = mongoose.connection;

db.on("error", console.error.bind(console, "Database Error"));
db.once("open", () => {
  console.log("Database Connect");
});

app.listen(process.env.PORT, () => {
  console.log(`Server run in PORT ${process.env.PORT}`);
});
