import { validationResult } from 'express-validator';
import News from '../models/news.js'; //eslint-disable-line

export async function addNews(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { userId } = req;
    const { title } = req.body;
    const { desc } = req.body;
    const { content } = req.body;
    const { categoryId } = req.body;

    const news = new News({
      title,
      desc,
      content,
      creator: userId,
      type: categoryId,
    });

    const result = await news.save();
    res.status(201).json({ message: 'news created!', userId: result._id }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getNews(req, res, next) {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId)
      .populate('creator', '-password')
      .populate('type', '-creator -createdAt -updatedAt');
    if (!news) {
      const error = new Error('Could not find news.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'news fetched.', news });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function goToNews(req, res, next) {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const news = await News.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ message: 'news fetched.', news });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getNewsByCategory(req, res, next) {
  const { categoryId } = req.params;
  const news = await News.find({ type: categoryId }).populate(
    'type',
    '-creator -createdAt -updatedAt',
  );
  try {
    if (!news) {
      const error = new Error('Could not find news.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'news fetched.', news });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function updateNews(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { newsId } = req.params;
    const { title } = req.body;
    const { desc } = req.body;
    const { content } = req.body;
    const { categoryId } = req.body;

    const news = await News.findById(newsId).populate('creator');
    if (!news) {
      const error = new Error('Could not find news.');
      error.statusCode = 404;
      throw error;
    }
    if (news.creator._id.toString() !== req.userId) { //eslint-disable-line
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    news.title = title;
    news.desc = desc;
    news.content = content;
    news.type = categoryId;
    const result = await news.save();
    res.status(201).json({ message: 'News updated!', userId: result._id }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
