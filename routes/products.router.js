import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import { activarProducto, createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from '../controllers/product.controller.js'

const productRouter = express.Router()

/* productRouter.use(verifyApiKeyMiddleware) */

productRouter.get('/', /* verifyTokenMiddleware() */ getAllProductsController)

productRouter.get('/:product_id', verifyTokenMiddleware(), getProductByIdController)

productRouter.post('/', verifyTokenMiddleware(['seller', 'admin']), createProductController)

productRouter.put('/:product_id', verifyTokenMiddleware(['seller', 'admin']), updateProductController)

productRouter.delete('/:product_id', verifyTokenMiddleware(['seller', 'admin']), deleteProductController)
productRouter.put('/activar/:product_id', activarProducto)

export default productRouter