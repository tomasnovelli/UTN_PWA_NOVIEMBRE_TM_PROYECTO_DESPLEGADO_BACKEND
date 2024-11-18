import express from 'express'
import authRouter from './routes/auth.route.js'
import testRouter from './routes/test.route.js'
import ENVIROMENT from './config/enviroment.config.js'
import configDB from './db/config.js'
import cors from 'cors'
import productRouter from './routes/products.router.js'
import database_pool from './db/configMysql.js'
import ProductRepository from './repositories/product.repository.js'
import { verifyApiKeyMiddleware } from './middlewares/auth.middleware.js'


const app = express()
const PORT = ENVIROMENT.PORT

app.use(cors())
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: true}))
app.use(verifyApiKeyMiddleware)

ProductRepository.getProducts()


app.use('/api/test', testRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)


/* sendEmail('que onda turro', 'tomasnovelli93@gmail.com') */
app.listen(PORT, ()=>{
    console.log(`Server Listened at port http://localhost:${PORT}`)
})