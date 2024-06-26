
import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router()

router.route('/register-user').post(upload.single('avatar'), registerUser)
router.route('/login').post(loginUser)

export default router