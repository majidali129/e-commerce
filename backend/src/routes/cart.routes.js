
import express from 'express'

import {verifyJWT} from '../middleware/verifyJWT.js'
import { addItemOrUpdateItemQuantity, deleteItemFromCart, clearCart,getUserCart } from '../controllers/cart.controller.js'

const router = express.Router()


router.use(verifyJWT)

router.route('/').get(getUserCart).delete(clearCart)
router.route('/item/:productId')
.post(addItemOrUpdateItemQuantity)
.delete(deleteItemFromCart)

export default router
