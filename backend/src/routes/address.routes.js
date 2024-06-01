import express from 'express';

import { validate } from '../validators/validate.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import {
  getAddressById,
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address.controller.js';
import { createAddrssValidator } from '../validators/address.validatiors.js';
import {
  mongoIdPathValidator,
  mongoIdRequestBodyValidator,
} from '../validators/mongodb.validators.js';

const router = express.Router();

router.use(verifyJWT);

router.route('/addAddress').post(createAddrssValidator(), validate, createAddress);
router.route('/').get(getAllAddresses);
router
  .route('/:addressId')
  .get(mongoIdPathValidator('addressId'), validate, getAddressById)
  .delete(mongoIdPathValidator('addressId'), validate, deleteAddress)
  .patch(mongoIdPathValidator('addressId'), validate, updateAddress);

export default router;
