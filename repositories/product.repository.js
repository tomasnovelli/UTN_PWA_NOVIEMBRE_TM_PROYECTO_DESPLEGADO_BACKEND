import database_pool from "../db/configMysql.js";
import Product from "../models/product.model.js";

/* class ProductRepository {
    static async getProducts(){
        //obtener lista productos activos
        return Product.find({active: true})
    }

    static async getProductById(id){
        return Product.findById(id)
    }

    static async createProduct(product_data){
        const newProduct = new Product(product_data)
        return newProduct.save()
    }

    static async updateProduct(id, newProductData){
        return Product.findByIdAndUpdate(id, newProductData, {new: true}) //new: true devuelve el producto actualizado
    }

    static async deleteProduct(id){
        return Product.findByIdAndUpdate(id, {active: false}, {new: true})
    }

    static async activeProduct(id){
        return Product.findByIdAndUpdate(id, {active: true}, {new: true})
    }

} */

class ProductRepository{
        static async getProducts(){
            const query = 'SELECT * FROM PRODUCT WHERE active = true'
            const [registros, columnas] = await database_pool.execute(query)
            
            //esto devuelve un array con 2 valores
            //el primer resulado o las row /filas o /registros
            //El segundo valor son las columns
            
            return registros
        }

        static async getProductById(product_id){
            console.log(product_id)
            const query = `SELECT * FROM PRODUCT WHERE product_id = ?`
            //execute espera como segundo parametro un array con los valores que quieras reemplazar en la query
            const [registros] = await database_pool.execute(query, [product_id])
            return registros.length > 0 ? registros[0] : null
        }

        static async createProduct(product_data){
            const {title, stock, price, description, seller_id, image_base_64} = product_data
            const query = `INSERT INTO PRODUCT (title, stock, price, description, seller_id, image_base_64, active) 
            VALUES 
            (?, ?, ?, ?, ?, ?, true)`
            const [resultado] = await database_pool.execute(query, [
                title, stock, price, description, seller_id, image_base_64
            ])
            return{
                id: resultado.insertId,
                title, 
                stock, 
                price, 
                description, 
                seller_id, 
                image_base_64,
                active: true
            }
        }
    } 

export default ProductRepository
