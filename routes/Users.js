const express = require("express");

const { fetchUserByID, updateUser, createUser } = require("../controller/User");

const router = express.Router();

router.get("/:id", fetchUserByID).patch("/:id", updateUser);

exports.router = router;
