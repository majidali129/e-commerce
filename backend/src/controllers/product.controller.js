import { Product } from '../models/product.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'
import { Category } from '../models/category.model.js'

const addProduct = asyncHandler(async (req, res, next) => {
    const {name, category} = req.body;

    const existingCategory = await Category.findOne({name:category});
    console.log(existingCategory)
    if(!existingCategory) return next(new apiError(404, 'category not exist. Please create new category at /categories/newCategory'));

    const existingProduct = await Product.findOne({name});
    if(existingProduct) return next(new apiError(400, 'product already exist.'))
    const product = await Product.create({...req.body, category: existingCategory._id});
    if(!product) return next(new apiError(500, 'something went wrong while adding new product'));

    res.status(201).json(new apiResponse(201, product, 'product added successfully'))
})

const updateProduct = asyncHandler(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!updatedProduct)
        return next(new apiError(500, 'product not updated. try again later'));

    res.status(200).json(new apiResponse(200, updatedProduct, 'product updated successfully'))
})

const getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json(new apiResponse(200, {results: products.length, products}, 'products fetched successfully'))
})

const getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product)
        return next(new apiError(404, 'product not found for that ID'));

    res.status(200).json(new apiResponse(200, product, 'product fetched successfully'))
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const results = await Product.findByIdAndDelete(req.params.id);
    if(!results)
        return next(new apiError(500, 'facing issue to delete product. try again later'))

    res.status(200).json(new apiResponse(200, {}, 'product deleted successfully'))
})

const deleteProducts = asyncHandler(async (req, res, next) => {
    await Product.deleteMany();

    res.status(200).json(new apiResponse(200, {}, 'all products hase been removed'))
})



export {addProduct, updateProduct, getProducts, getProduct, deleteProduct, deleteProducts}