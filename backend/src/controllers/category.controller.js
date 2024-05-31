import { Category } from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addCategory = asyncHandler(async (req, res, next) => {
  const existingCat = await Category.findOne({ name: req.body.name });
  if (existingCat) return next(new apiError(400, 'category already exists'));

  const newCategory = await Category.create(req.body);
  if (!newCategory)
    return next(
      new apiError(500, 'something went wrong while adding new category. try later again')
    );

  res.status(201).json(new apiResponse(201, newCategory, 'category added successfully'));
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new apiError(404, 'no category found for that ID'));

  const result = await Category.findByIdAndDelete(req.params.id);
  if (!result)
    return next(new apiError(500, 'category not deleted yet. try again later'));

  res.status(200).json(new apiResponse(200, {}, 'category deleted successfully'));
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new apiError(404, 'no category found for that ID'));

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res
    .status(200)
    .json(new apiResponse(200, updatedCategory, 'category updated successfully'));
});

const getAllCategories = asyncHandler(async (req, res, next) => {
  const cats = await Category.find();

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { results: cats.length, cats },
        'all categories is being fetched'
      )
    );
});

const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if(!category)
    return next(new apiError(404, 'category not found for that ID'))


  res
    .status(200)
    .json(
      new apiResponse(
        200,
        category,
        'category fetched successfully'
      )
    );
});
export { addCategory, deleteCategory, getAllCategories, updateCategory, getCategory};
