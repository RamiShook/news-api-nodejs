import express from 'express';
import { body } from 'express-validator';
import User from '../models/user.js'; //eslint-disable-line
import * as authController from '../controllers/auth.js'; //eslint-disable-line

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => User.findOne({ email: value }).then((userDoc) => { //eslint-disable-line
        if (userDoc) {
          return Promise.reject('E-Mail address already exists!'); //eslint-disable-line
        }
      }))
      .normalizeEmail(),
    body('password').trim().not().isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  authController.signup,
);

router.post(
  '/login',
  [
    body('password').trim().isLength({ min: 5 }),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
  ],
  authController.login,
);

router.post(
  '/reset',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => User.findOne({ email: value }).then((userDoc) => { //eslint-disable-line
        if (!userDoc) {
          return Promise.reject('A user with this email could not be found.'); //eslint-disable-line
        }
      }))
      .normalizeEmail(),
  ],
  authController.postReset,
);

router.post(
  '/new-password',
  [
    body('password').trim().isLength({ min: 5 }),
    body('userId').not().isEmpty()
      .withMessage("Please don't send a empty data."),
    body('passwordToken').not().isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  authController.postNewpassword,
);

export default router;
