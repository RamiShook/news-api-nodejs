const { validationResult } = require("express-validator");
const News = require("../models/news");

exports.addNews = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;
    const title = req.body.title;
    const desc = req.body.desc;
    const content = req.body.content;
    const categoryId = req.body.categoryId;

    const news = new News({
      title: title,
      desc: desc,
      content: content,
      creator: userId,
      type: categoryId,
    });

    let result = await news.save();
    res.status(201).json({ message: "news created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNews = async (req, res, next) => {
  const newsId = req.params.newsId;
  const news = await News.findById(newsId)
    .populate("creator", "-password")
    .populate("type", "-creator -createdAt -updatedAt");
  try {
    if (!news) {
      const error = new Error("Could not find news.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "news fetched.", news: news });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNewsByCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const news = await News.find({ type: categoryId }).populate(
    "type",
    "-creator -createdAt -updatedAt"
  );
  try {
    if (!news) {
      const error = new Error("Could not find news.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "news fetched.", news: news });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateNews = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const newsId = req.params.newsId;
    const title = req.body.title;
    const desc = req.body.desc;
    const content = req.body.content;
    const categoryId = req.body.categoryId;

    let news = await News.findById(newsId).populate("creator");
    if (!news) {
      const error = new Error("Could not find news.");
      error.statusCode = 404;
      throw error;
    }
    if (news.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    news.title = title;
    news.desc = desc;
    news.content = content;
    news.type = categoryId;
    let result = await news.save();
    res.status(201).json({ message: "News updated!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
