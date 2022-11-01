const express = require("express");
const app = express();

//membaca req json
app.use(express.json());

//panggil model product
const Product = require("../model/product");

//panggil fungsi auth -> validasi token
const { auth } = require("./auth");

//fungsi auth dijadikan middleware
app.use(auth);

//get all product
app.get("/", (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
});

//get all product random
app.get("/other-product", (req, res) => {
  Product.aggregate([{ $sample: { size: 50 } }])
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
});

//get product by id
app.get("/:id", (req, res) => {
  const id = req.params.id;

  Product.findOne({
    id,
  })
    .select(["-_id"])
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
});

//getCategories
app.get("/category", (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    .select(["-_id", "category"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
});

//getProduct in categories
app.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    category,
  })
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
});

//post product
app.post("/", (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is Undifined",
    });
  } else {
    let product = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: {
        rate: req.body.rating.rate,
        count: req.body.rating.count,
      },
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
    });
    product.save().then((product) => {
      res.json({
        product,
        message: "Produk berhasil ditambahkan!",
      });
    });
  }
});

//update product
app.put("/:id", async (req, res) => {
  try {
    const productUpdate = await Product.updateOne(
      { id: req.params.id },
      {
        id: req.body.id,
        title: req.body.title,
        price: req.body.price,
        rating: {
          rate: req.body.rating.rate,
          count: req.body.rating.count,
        },
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
      }
    );
    res.json({ productUpdate, message: "produk berhasil di update!" });
  } catch (err) {
    res.json({ message: err });
  }
});

//delete product
app.delete("/:id", async (req, res) => {
  try {
    const productDelete = await Product.deleteOne({ id: req.params.id });
    res.json({ productDelete, message: "Produk berhasil dihapus!" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = app;
