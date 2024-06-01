import express from 'express'

import {validate} from '../validators/validate.js'
import { verifyJWT } from '../middleware/verifyJWT.js'
import {getAddressById, getAllAddresses, createAddress, updateAddress, deleteAddress} from '../controllers/address.controller.js'
import { addrssValidator } from '../validators/address.validatiors.js'
import { mongoIdRequestBodyValidator } from '../validators/mongodb.validators.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/addAddress').post(addrssValidator(), validate, createAddress)
router.route('/').get(getAllAddresses)
router.route('/:addressId')
.get(mongoIdRequestBodyValidator('addressId'), validate, getAddressById)
.delete(mongoIdRequestBodyValidator('addressId'),validate, deleteAddress)
.patch(mongoIdRequestBodyValidator('addressId'),validate, updateAddress)


export default router;