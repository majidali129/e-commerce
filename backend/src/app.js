import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'

import userRouter from '../src/routes/user.routes.js'
import productRouter from '../src/routes/products.routes.js'
import cartRouter from '../src/routes/cart.routes.js'
import categoryRouter from '../src/routes/category.routes.js'

export const app = express()


app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())


// routes mounting
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/categories', categoryRouter)
