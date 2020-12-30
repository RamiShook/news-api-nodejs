import { validationResult } from 'express-validator';
import Category from '../models/category.js'; //eslint-disable-line

export async function addCategory(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { type } = req.body;
    const category = new Category({
      type,
      creator: req.userId,
    });
    const result = await category.save();
    res.status(201).json({ message: 'Category created!', userId: result._id }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { categoryId } = req.params;
    const { type } = req.body;
    const category = await Category.findById(categoryId).populate('creator');
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    if (category.creator._id.toString() !== req.userId) { //eslint-disable-line
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    category.type = type;
    const result = await category.save();
    res.status(201).json({ message: 'Category updated!', userId: result._id }); //eslint-disable-line
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
