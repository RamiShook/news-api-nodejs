import { Router } from 'express';
import { body } from 'express-validator';
import category from '../models/category.js'; //eslint-disable-line
import * as newsController from '../controllers/news.js'; //eslint-disable-line
import isAuth from '../middleware/is-auth.js'; //eslint-disable-line

const router = Router();

router.post(
  '/add-news',
  isAuth,
  [
    body('categoryId')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data.")
      .custom((value, { req }) => category.findById(value).then((userDoc) => { //eslint-disable-line
        if (!userDoc) {
          return Promise.reject('Category does not exists!'); //eslint-disable-line
        }
      })),
    body('title')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body('desc')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body('content')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  newsController.addNews,
);

router.get('/get-news-by-id/:categoryId', isAuth, newsController.getNewsByCategory);

router.get('/get-news/:newsId', isAuth, newsController.getNews);

router.get('/goto-news', isAuth, newsController.goToNews);

router.put(
  '/update-news/:newsId',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body('desc')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
    body('content')
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please don't send a empty data."),
  ],
  newsController.updateNews,
);

export default router;
