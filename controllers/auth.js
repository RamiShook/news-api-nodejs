const crypto = require("crypto");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
    });
    let result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
    transporter.sendMail({
      to: email,
      from: "issa.halabi.99@gmail.com",
      subject: "Signup succeeded!",
      html: "<h1>You successfully signed up!</h1>",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    let isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postReset = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
      }
      const token = buffer.toString("hex");
      let user = await User.findOne({ email: req.body.email });
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      let result = await user.save();
      res.status(201).json({ message: "User Exist!", userId: result._id });
      transporter.sendMail({
        to: req.body.email,
        from: "issa.halabi.99@gmail.com",
        subject: "Password reset",
        html: `
          <p> You requested a password reset </p>
          <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>
        `,
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postNewpassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  try {
    let user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
    let hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    let result = await user.save();
    res.status(201).json({ message: "Password updated!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
