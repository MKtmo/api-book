const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const pwRules = require("../security/password");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");

const jwtSecret =
  "e183ee2144d9ad3af725be2da03d2ccb614b475943e442cdd3a7480e3794b2ebd2f6c1";
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  // Prepare the input data validation
  const validInput = new Validator(req.body, {
    email: "required|email|length:100",
    password: "required",
    lastname: "required|string|length:100",
    firstname: "required|string|length:100",
  });

  // Check the input data from the frontend
  validInput
    .check()
    .then((matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(validInput.errors);
      } else {
        // If the input is safe, check the password strengh
        if (pwRules.validate(req.body.password)) {
          // Hash the password
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              // Format the user data for storage
              const newId = new mongoose.Types.ObjectId();
              const user = new User({
                userId: newId,
                email: req.body.email,
                password: hash,
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                isAdmin: false,
              });

              // Store the user data in the database
              user
                .save()
                .then(() =>
                  res.status(201).json({ message: "User account created !" })
                )
                .catch(() =>
                  res.status(500).json({ error: "Internal servor error" })
                );
            })
            .catch(() =>
              res.status(500).json({ error: "Internal servor error" })
            );
        } else {
          throw "Invalid password";
        }
      }
    })
    .catch(() => res.status(400).send(validInput.errors));
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if username and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { userId: user.userId, isAdmin: user.isAdmin },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            id: user._id,
            userId: user.userId,
            isAdmin: user.isAdmin,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.email = user.email;
        container.isAdmin = user.isAdmin;
        container.userId = user.userId;

        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};

exports.getUserById = (req, res, next) => {
  User.findOne({ userId: req.body.userId }, function (err, user) {
    if (!err) {
      res.status(200).json(user);
    } else {
      res.status(400).message(err);
    }
  });
};

exports.update = async (req, res, next) => {
  const { isAdmin, userId } = req.body;
  // Verifying if role and id is presnt
  if (isAdmin && userId) {
    // Verifying if the value of role is admin
    if (isAdmin === true) {
      // Finds the user with the id
      await User.findById(userId)
        .then((user) => {
          // Verifies the user is not an admin
          if (user.isAdmin !== true) {
            user.isAdmin = isAdmin;
            user.save((err) => {
              //Monogodb error checker
              if (err) {
                return res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
              }
              res.status("201").json({ message: "Update successful", user });
            });
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    } else {
      res.status(400).json({
        message: "Role is not admin",
      });
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req.body;
  await User.findById(userId)
    .then((user) => user.remove())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
};
