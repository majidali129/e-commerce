import { Cart } from '../models/cart.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Product } from '../models/product.model.js';
import mongoose,  {Mongoose, ObjectId} from 'mongoose';

const getCart = async (userId) => {
  const cartAggregation = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'products',
        foreignField: '_id',
        localField: 'items.productId',
        as: 'product',
      },
    },
    {
      $project: {
        product: { $first: '$product' },
        quantity: '$items.quantity',
      },
    },
    {
      $group: {
        _id: '$_id',
        items: {
          $push: '$$ROOT',
        },
        cartTotal: {
          $sum: {
            $multiply: ['$product.price', '$quantity'],
          },
        },
      },
    },
    {
      $addFields: {cartTotal: '$cartTotal'},
    },
  ]);

  return (
    cartAggregation[0] ?? {
      id: null,
      items: [],
      cartTotal: 0,
    }
  );
};

const addItemOrUpdateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;


  let cart = await Cart.findOne({ owner: req.user._id });
  if(!cart) cart = await Cart.create({owner: req.user._id, items: []})


  const product = await Product.findById(productId);
  if (!product) return next(new apiError(404, 'Product does not exist'));

  if (quantity > product.inStock) {
    return next(
      new apiError(
        400,
        product.inStock > 0
          ? 'Only ' +
            product.inStock +
            ' products are remaining. But you are adding ' +
            quantity
          : 'Product is out of stock'
      )
    );
  }
  const targetId = new mongoose.Types.ObjectId(productId) // to convert it into bson id

  const existingProduct = cart.items.find(
    (item) => {
      return item.productId.toString() === targetId.toString()
    }
  );

  if (existingProduct) {
    existingProduct.quantity = quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save({ validateBeforeSave: true });

  const updatedCart = await getCart(req.user._id);

  res.status(200).json(new apiResponse(200, updatedCart, 'item added successfully'));
});

const getUserCart = asyncHandler(async (req, res, _) => {
  const cart = await getCart(req.user._id);
  res.status(200).json(new apiResponse(200, cart, 'user cart fetched successfully'));
});

const deleteItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new apiError(404, 'item does not exists'));

  const updatedCart = await Cart.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $pull: {
        items: { productId },
      },
    },
    {
      new: true,
    }
  );

  const cart = await getCart(req.user._id);

  res.status(200).json(new apiResponse(200, cart, 'cart item removed successfully'));
});
const clearCart = asyncHandler(async (req, res, _) => {
  await Cart.findOneAndUpdate(
    { owner: req.user._id },
    {
      $set: {
        items: [],
      },
    },
    {
        new: true
    }
  );

  const cart = await getCart(req.user._id);

  res.status(200)
  .json(new apiResponse(200, cart, 'cart has been cleared'))
});

export { addItemOrUpdateItemQuantity, deleteItemFromCart, clearCart, getUserCart };
