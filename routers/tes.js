const express = require("express");
const md5 = require("md5");

const app = express();

//membaca req tipe json
app.use(express.json());

//memanggil model user
const Tes = require("../model/tes");

app.post("/", (req, res) => {
  let tes = new Tes({
    nama: req.body.nama,
  });
  tes.save().then((tes) =>
    res.json({
      tes,
      message: `Berhasil registrasi!`,
    })
  );
});
