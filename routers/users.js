const express = require("express");
const md5 = require("md5");

const app = express();

//membaca req tipe json
app.use(express.json());

//memanggil model user
const User = require("../model/user");

//get all users
app.get("/", (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
});

//get user by id
app.get("/:id", (req, res) => {
  const id = req.params.id;

  User.findOne({
    id,
  })
    .select(["-_id"])
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

//Register
app.post("/register", (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is Undifined",
    });
  } else {
    let user = new User({
      id: req.body.id,
      email: req.body.email,
      username: req.body.username,
      password: md5(req.body.password),
      name: {
        firstname: req.body.name.firstname,
        lastname: req.body.name.lastname,
      },
    });
    user.save().then((user) =>
      res.json({
        user,
        message: `Berhasil registrasi!`,
      })
    );
  }
});

//Api complate data
app.put("/complete-data/:id", async (req, res) => {
  try {
    const tesUpadate = await User.updateOne(
      { id: req.params.id },
      {
        address: {
          city: req.body.address.city,
          street: req.body.address.street,
          number: req.body.address.number,
          zipcode: req.body.address.zipcode,
          geolocation: {
            lat: req.body.address.geolocation.lat,
            long: req.body.address.geolocation.long,
          },
        },
        phone: req.body.phone,
        photo: req.body.photo,
      }
    );
    res.json({ tesUpadate, message: "Data telah terlengkapi!" });
  } catch (err) {
    res.json({ message: err });
  }
});

//Api Delete data
app.delete("/:id", async (req, res) => {
  try {
    const userDelete = await User.deleteOne({ id: req.params.id });
    res.json({ userDelete, message: "Data telah Dihapus!" });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = app;
