import { randomBytes } from 'crypto';

import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { createTransport } from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import User from '../models/user.js'; //eslint-disable-line

const transporter = createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  }),
);

export async function signup(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email } = req.body;
    const { password } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id }); //eslint-disable-line
    transporter.sendMail({
      to: email,
      from: 'issa.halabi.99@gmail.com',
      subject: 'Signup succeeded!',
      html: '<h1>You successfully signed up!</h1>',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email } = req.body;
    const { password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(), //eslint-disable-line
      },
      'somesupersecretsecret',
      { expiresIn: '1h' },
    );
    res.status(200).json({ token, userId: user._id.toString() }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export function postReset(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    randomBytes(32, async (err, buffer) => {
      if (err) {
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
      }
      const token = buffer.toString('hex');
      const user = await User.findOne({ email: req.body.email });
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      const result = await user.save();
      res.status(201).json({ message: 'User Exist!', userId: result._id }); //eslint-disable-line
      transporter.sendMail({
        to: req.body.email,
        from: 'issa.halabi.99@gmail.com',
        subject: 'Password reset',
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
}

export async function postNewpassword(req, res, next) {
  const newPassword = req.body.password;
  const { userId } = req.body;
  const { passwordToken } = req.body;
  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    if (!user) {
      const error = new Error('2 Errors passible user not compatible with token or token expire');
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    const result = await user.save();
    res.status(201).json({ message: 'Password updated!', userId: result._id }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
