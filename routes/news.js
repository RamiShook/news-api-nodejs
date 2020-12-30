const express = require("express");
const { body } = require("express-validator");

const Category = require("../models/category");
const newsController = require("../controllers/news");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/add-news",
  isAuth,
  [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("content")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  newsController.addNews
);

router.get('/get-news/:newsId', isAuth, newsController.getNews);

router.put(
  "/update-news/:newsId",
  isAuth,
  [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("desc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body("content")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  newsController.updateNews
);

module.exports = router;
