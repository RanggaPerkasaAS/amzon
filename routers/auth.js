const express = require("express");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secretKey = "fake-taxi";
const EXPIRES_IN = "2m";
const refreshTokenLife = "2h";
const tokenList = {};

const login = express();

//membaca req tipe json
login.use(express.json());

//memanggil model user
const User = require("../model/user");

login.post("/", (req, res) => {
  if (typeof req.body == undefined || req.body == null) {
    res.status(401);
    res.send("username or password null");
  } else {
    username = req.body.username;
    password = md5(req.body.password);

    if (username && password) {
      User.findOne({
        username: username,
        password: password,
      })
        .then((user) => {
          if (user) {
            let token = jwt.sign({ user: username }, secretKey, {
              expiresIn: EXPIRES_IN,
            });
            let refreshToken = jwt.sign({ user: username }, secretKey, {
              expiresIn: refreshTokenLife,
            });
            tokenList[refreshToken] = res;
            return res.json({
              logged: true,
              token: token,
              id: user.id,
              refreshToken: refreshToken,
            });
          } else {
            res.status(401);
            res.send("username or password is incorrect");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

login.post("/token", (req, res) => {
  // refresh the token
  const postData = req.body;
  // cek refresh token di tokenlist
  if (postData.refreshToken && postData.refreshToken in tokenList) {
    const user = {
      username: postData.username,
      password: md5(postData.password),
    };
    const token = jwt.sign(user, secretKey, { expiresIn: refreshTokenLife });
    const response = {
      token: token,
    };
    // update the token in the list
    tokenList[postData.refreshToken].token = token;
    res.status(200).json(response);
  } else {
    res.status(404).send("Invalid request");
  }
});

//fungsi auth digunakan uuntuk verifikasi token yang dikirirmkan
const auth = (request, response, next) => {
  //dapatkan data authorization
  let header = request.headers.authorization;

  //data tokennya
  let token = header && header.split(" ")[1];
  //split digunakan untuk memecah sebuah string menjadi array berdasarkan spasi

  if (token == null) {
    return response.status(401).json({
      message: `Unauthorized`,
    });
  } else {
    let jwtHeader = {
      algorithm: "HS256",
    };

    //verivikasi token yang diberikan
    jwt.verify(token, secretKey, jwtHeader, (error) => {
      if (error) {
        return response.status(401).json({
          message: `Invalid token`,
        });
      } else {
        next();
      }
    });
  }
};
module.exports = { login, auth };
