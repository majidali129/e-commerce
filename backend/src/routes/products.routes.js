
import express from 'express'
import { addProduct, deleteProduct, deleteProducts, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js'

const router = express.Router()


/**
 * ! add new product, update, delete => ADMIN ROLE
 * ! only get is for both USER & ADMIN
*/
router.route('/').get(getProducts).delete(deleteProducts)
router.route('/addProduct').post(addProduct)
router.route('/:id').patch(updateProduct).delete(deleteProduct).get(getProduct)

export default router
