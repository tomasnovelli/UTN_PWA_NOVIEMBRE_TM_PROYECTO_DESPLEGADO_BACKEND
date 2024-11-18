import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            require: true,
            default: true
        },
        //modificar el nombres a image_base_64
        image_base_64:{
            type: String
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,//debe ser el mismo tipo que el id de la coleccion de Users
            ref: 'User',
            require: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        }
    }
)

const Product = mongoose.model('Product', productSchema)

export default Product