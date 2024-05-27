
import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import { app } from './app.js'


dotenv.config({
    path: './config.env'
})

await connectDB().then(() => {
    app.on('error', (err) => {
        console.log('ERROR ::', err)
        throw err
    })
}).catch(err => console.log(err))

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
})