const express = require("express");

const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then((createdUser) => {
      res.status(201).json({ message: "User Created", email: req.body.email });
    })
    .catch(() => {
      return res.status(401).json({ message: "Email is already in use" });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUserID;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Cannot find the user!" });
      }
      fetchedUserID = user._id;
      return bcrypt
        .compare(req.body.password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) {
            return res
              .status(401)
              .json({ message: "Invalid Password or Email" });
          }
          const token = jwt.sign(
            { email: req.body.email, userID: fetchedUserID },
            "secret_this_should_be_longer:)",
            { expiresIn: "1h" }
          );

          res.status(200).json({ token, expiresIn: 3600 });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ message: "Unexpected error occured" });
    });
});

module.exports = router;
