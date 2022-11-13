const express = require("express");

const userCtr = require("../controllers/user");

const router = express.Router();

const { adminAuth } = require("../middleware/auth");

const {
  login,
  deleteUser,
  update,
  getUsers,
  getUserById,
} = require("../controllers/user");

//Route to register
router.post("/signup", userCtr.createUser);

// Route to update
router.route("/updateUser").put(update, adminAuth);

// Route to log in
router.route("/login").post(login);

// Route to fetch all accounts
router.route("/getAllUsers").get(getUsers, adminAuth);

// Route to fetch one account
router.route("/getUserById").get(getUserById);

// Route to delete one account
router.route("/deleteUser").delete(deleteUser, adminAuth);

module.exports = router;
