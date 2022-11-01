const express = require("express");
const app = express();

//membaca req json
app.use(express.json());

//model cart
const Cart = require("../model/cart");

//get all cart
app.get("/", (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("2000-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);

  Cart.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
});

//get cart by id
app.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const startDate = req.query.startdate || new Date("2000-1-1");
  const endDate = req.query.enddate || new Date();

  Cart.find({
    userId,
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => {
      res.json(err), console.log(err);
    });
});

//

//post cart
app.post("/", (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let cart = new Cart({
      id: req.body.id,
      userId: req.body.userId,
      products: req.body.products,
    });
    cart.save().then((cart) => {
      res.json({
        cart,
        message: "berhasil menambah barang ke cart!",
      });
    });
  }
});

//update cart
app.put("/:id", async (req, res) => {
  try {
    const cartUpdate = await Cart.updateOne(
      { id: req.params.id },
      {
        id: req.body.id,
        userId: req.body.userId,
        products: req.body.products,
      }
    );
    res.json({ cartUpdate, message: "Cart berhasil di update!" });
  } catch (err) {
    res.json({ message: err });
  }
});

//delete product
app.delete("/:id", async (req, res) => {
  try {
    const cartDelete = await Cart.deleteOne({ id: req.params.id });
    res.json({ cartDelete, message: "Cart berhasil dihapus!" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = app;
