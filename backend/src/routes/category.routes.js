import express from 'express'

import {verifyJWT} from '../middleware/verifyJWT.js'
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory} from '../controllers/category.controller.js'


const router = express()

router.use(verifyJWT)  // only allow for admins

router.route('/').get(getAllCategories)
router.route('/:id').patch(updateCategory).delete(deleteCategory).get(getCategory)
router.route('/addCategory').post(addCategory)


export default router