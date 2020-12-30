const express = require("express");
const { body } = require("express-validator");

const Category = require("../models/category");
const categoryController = require("../controllers/category");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  "/add-category",
  isAuth,
  [
    body("type")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  categoryController.addCategory
);
router.put(
  "/update-category/:categoryId",
  isAuth,
  [
    body("type")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  categoryController.updateCategory
);

module.exports = router;
