import Product from "../models/product.model.js"
import ProductRepository from "../repositories/product.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"



export const getAllProductsController = async (req, res) => {
    try {
        const productsFromDb = await ProductRepository.getProducts()
        
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Productos obtenidos')
            .setPayload({
                products: productsFromDb
            })
            .build()
        res.status(200).json(response)
    }
    catch (error) {

    }
}

//recibo
/* 
    params: id (el id del producto)

*/

//devuelvo
/* 
    Producto
*/
export const getProductByIdController = async (req, res) => {
    try {
        const { product_id } = req.params
        const productoBuscado = await ProductRepository.getProductById(product_id)
        if (!productoBuscado) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Product not Found')
                .setPayload({
                    detail: `El producto con id ${product_id} no existe`
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Producto obtenido')
            .setPayload({
                products: productoBuscado
            })
            .build()
        res.status(200).json(response)
    }
    catch (error) {
        console.error(error.Message)
    }
}

export const createProductController = async (req, res) => {
    try {
        const { title, price, stock, description, category, image } = req.body
        const seller_id = req.user.id
        if (!title) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de titulo')
                .setPayload({
                    detail: 'Titulo invalido o campo esta vacio'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!price && price < 1) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de precio')
                .setPayload({
                    detail: 'Precio invalido o campo vacio, solo valor numerico permitido mayor a 0'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!stock && isNaN(stock)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de stock')
                .setPayload({
                    detail: 'stock invalido o campo vacio, solo valor numerico permitido'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!description) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de descripcion')
                .setPayload({
                    detail: 'campo vacio, debe ingresar una descripcion'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!category) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de categoria')
                .setPayload({
                    detail: 'cateogria invalida o campo vacio'
                })
                .build()
            return res.status(400).json(response)
        }
        if(image && Buffer.byteLength(image, 'base64') > 2 * 1024 * 1024){
            console.error('Imagen muy grande')
            return res.sendStatus(400)
        }
/*         if (!seller_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Error de seller id')
                .setPayload({
                    detail: 'el id es incorrecto'
                })
                .build()
            return res.status(400).json(response)
        } */
        const newProduct = {
            title,
            price,
            stock,
            description,
            category,
            image_base_64: image,
            seller_id
        }
        const newProductSave = await ProductRepository.createProduct(newProduct)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Producto Creado')
            .setPayload(
                { 
                    data: {
                        title: newProductSave.title,
                        price: newProductSave.price,
                        stock: newProductSave.stock,
                        description: newProductSave.description,
                        category: newProductSave.category,
                        id: newProductSave._id
                    }
                }
            )
            .build()
        res.json(response)

    }
    catch (error) {
        console.log(error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setPayload({
                detail: error.message
            })
            .build()
        res.status(500).json(response)
    }

}

export const updateProductController = async (req, res) => {
    try { 
        const { product_id } = req.params
        const { title, price, stock, description, category } = req.body
        const seller_id = req.user.id
        if (!isNaN(title) && title.length > 5) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de titulo')
                .setPayload({
                    detail: 'Titulo invalido o campo esta vacio'
                })
                .build()
            return res.status(400).json(response)
        }
        if (isNaN(price) && price < 1) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de precio')
                .setPayload({
                    detail: 'Precio invalido o campo vacio, solo valor numerico permitido mayor a 0'
                })
                .build()
            return res.status(400).json(response)
        }
        if (isNaN(stock) && stock < 1) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de stock')
                .setPayload({
                    detail: 'stock invalido o campo vacio, solo valor numerico permitido'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!isNaN(description)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de descripcion')
                .setPayload({
                    detail: 'campo vacio, debe ingresar una descripcion'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!isNaN(category)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Error de categoria')
                .setPayload({
                    detail: 'cateogria invalida o campo vacio'
                })
                .build()
            return res.status(400).json(response)
        }
        const newProduct = {
            title,
            price,
            stock,
            description,
            category
        }
        const product_found = await ProductRepository.getProductById(product_id)
        if(seller_id !== product_found.seller_id.toString()){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Prohibido')
            .setPayload({
                detail: 'no tienes los permisos para modificar el producto'
            })
            .build()
            return res.status(403).json(response)
        } 
        const productoActualizado = await ProductRepository.updateProduct(product_id, newProduct)
        if (!productoActualizado) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Error al actualizar producto')
                .setPayload({
                    detail: 'Producto no encontrado'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Producto actualizado con exito!')
            .setPayload(
                {
                    data: {
                        title: newProduct.title,
                        price: newProduct.price,
                        stock: newProduct.stock,
                        description: newProduct.description,
                        category: newProduct.category
                    }
                }
            )
            .build()
        res.json(response)

    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setPayload({
                detail: error.message
            })
            .build()
        res.status(500).json(response)
    }

}

export const deleteProductController = async (req, res) => {
    try {
        const { product_id } = req.params
        //solo el creador puede eliminar por eso se piden el seller_id
        const seller_id = req.user.id
        const user_role = req.user.rol
        const product_found = await ProductRepository.getProductById(product_id)
        if(!product_found){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('product not found')
            .setPayload({
                detail: 'no se encontro el producto'
            })
            .build()
            return res.status(404).json(response)
        }
        if(req.user.role !== 'admin' && seller_id !== product_found.seller_id.toString()){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('prohibido')
            .setPayload({
                detail: 'no tenes los permisos para eliminar el producto'
            })
            .build()
            return res.status(403).json(response)
        }
        const productoEliminado = await ProductRepository.deleteProduct(product_id)
        if (!productoEliminado) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('La solicitud fallo')
                .setPayload({
                    detail: 'No se pudo eliminar el producto, no se encontro el producto'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Producto eliminado con exito!')
        .setPayload(
            {
                data: {
                    title: productoEliminado.title,
                    id: productoEliminado._id
                }
            }
        )
        .build()
    res.json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal Server Error')
        .setPayload({
            detail: error.message
        })
        .build()
    res.status(500).json(response)
    }
}

export const activarProducto = async (req, res) => {
    try {
        const { product_id } = req.params
        console.error(product_id)
        const productoBuscadoYActivado = await ProductRepository.activeProduct(product_id)
        if (!productoBuscadoYActivado) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('La solicitud fallo')
                .setPayload({
                    detail: 'No se pudo eliminar el producto, no se encontro el producto'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Producto activado con exito!')
        .setPayload(
            {
                data: {
                    title: productoBuscadoYActivado.title,
                }
            }
        )
        .build()
    res.json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal Server Error')
        .setPayload({
            detail: error.message
        })
        .build()
    res.status(500).json(response)
    }
}