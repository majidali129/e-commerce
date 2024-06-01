import { asyncHandler } from '../utils/asyncHandler';
import { Address } from '../models/address.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { getMongoosePaginationOptions } from '../utils/helpers.js';

const createAddress = asyncHandler(async (req, res, next) => {
  const { addressLine1, addressLine2, city, country, pincode, state } = req.body;
  const owner = req.user._id;

  const newAddress = await Address.create({
    addressLine1,
    addressLine2,
    city,
    country,
    pincode,
    state,
    owner,
  });

  res
    .status(201)
    .json(new apiResponse(201, newAddress, 'new address added successfully'));
});

const getAllAddresses = asyncHandler(async (req, res, _) => {
  const { limit, page } = req.query;
  const addressAggregation = Address.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
  ]);

  const addresses = await Address.aggregatePaginate(
    addressAggregation,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: 'totalAddresses',
        docs: 'addresses',
      },
    })
  );
  res.status(200).json(new apiResponse(200, addresses, 'addresses fetched successfully'));
});

const getAddressById = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  const address = await Address.findOne({
    _id: addressId,
    owner: req.user._id,
  });

  if (!address) return next(new apiError(400, 'address not found for that ID'));

  res.status(200).json(new apiResponse(200, address, 'address fetched successfully'));
});

const updateAddress = asyncHandler(async (req, res, next) => {
  const { addressLine1, addressLine2, city, country, state, pincode } = req.body;
  const { addressId } = req.params;

  const updatedAddress = await Address.findOneAndUpdate(
    {
      _id: addressId,
      owner: req.user._id,
    },
    {
      $set: {
        addressLine1,
        addressLine2,
        city,
        country,
        state,
        pincode,
      },
    },
    { new: true }
  );

  if (!updatedAddress) return next(new apiError(404, 'address not found'));

  res
    .status(200)
    .json(new apiResponse(200, updatedAddress, 'address updated successfully'));
});

const deleteAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    owner: req.user._id,
  });

  if (!address) return next(new apiError(404, 'address not exist'));

  res
    .status(200)
    .json(
      new apiResponse(200, { deletedAddress: address }, 'address deleted successfully')
    );
});

export { getAddressById, getAllAddresses, createAddress, updateAddress, deleteAddress };
