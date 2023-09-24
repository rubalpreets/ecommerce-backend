const express = require("express");

const { fetchUserByID, updateUser, createUser } = require("../controller/User");

const router = express.Router();

router.get("/own", fetchUserByID).patch("/:id", updateUser);

exports.router = router;
