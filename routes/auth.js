const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().not().isEmpty().withMessage("Please don't send a empty data."),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("password").trim().isLength({ min: 5 }),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
  ],
  authController.login
);

router.post(
  "/reset",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("A user with this email could not be found.");
          }
        });
      })
      .normalizeEmail(),
  ],
  authController.postReset
);

router.post(
  "/new-password",
  [
    body("password").trim().isLength({ min: 5 }),
    body("userId").isEmpty().not().isEmpty().withMessage("Please don't send a empty data."),
    body("passwordToken").isEmpty().not().isEmpty().withMessage("Please don't send a empty data."),
  ],
  authController.postNewpassword
);

module.exports = router;
