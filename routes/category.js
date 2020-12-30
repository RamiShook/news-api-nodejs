import { Router } from 'express';
import { body } from 'express-validator';
import * as categoryController from '../controllers/category.js'; //eslint-disable-line
import isAuth from '../middleware/is-auth.js'; //eslint-disable-line

const router = Router();

router.post(
  '/add-category',
  isAuth,
  [
    body('type')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  categoryController.addCategory,
);
router.put(
  '/update-category/:categoryId',
  isAuth,
  [
    body('type')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  categoryController.updateCategory,
);

export default router;
