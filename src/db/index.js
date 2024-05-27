import mongoose from "mongoose";

import {DB_NAME} from '../constants.js'

export const connectDB = async () => {
try {
        const db = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD).replace('<DB_NAME>', DB_NAME)
        const connInstance = await mongoose.connect(db)
        console.log(`\n MongoDB connected at host ${connInstance.connection.host}`)

} catch (error) {
    console.log('MongoDB connection Error', error)
}}