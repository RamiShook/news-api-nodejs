const { validationResult } = require("express-validator");
const Category = require("../models/category");

exports.addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const type = req.body.type;
    const category = new Category({
      type: type,
      creator: req.userId,
    });
    let result = await category.save();
    res.status(201).json({ message: "Category created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const categoryId = req.params.categoryId;
    const type = req.body.type;
    let category = await Category.findById(categoryId).populate("creator");
    if (!category) {
      const error = new Error("Could not find category.");
      error.statusCode = 404;
      throw error;
    }
    if (category.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    category.type = type;
    let result = await category.save();
    res.status(201).json({ message: "Category updated!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
