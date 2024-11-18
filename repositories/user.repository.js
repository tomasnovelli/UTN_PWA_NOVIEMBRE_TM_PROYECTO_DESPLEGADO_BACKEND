import User from "../models/user.model.js"

class UserRepositoriy {
    static async obtenerPorId(id){
        const existUser = await User.findOne({_id: id})
        return existUser
    }
    static async obtenerPorEmail(email){
        const existUser = await User.findOne({email})
        return existUser
    }
    static async guardarUsuario (user){
        return await User.save()
    }
    static async setEmailVerify(value, user_id){
        const user = await UserRepositoriy.obtenerPorEmail(user_id)
        user.emailVerified = value
        return await UserRepositoriy.guardarUsuario(user)
    }
}

//los estaticos me permiten trabajar con los metodos sin tener que insanciar a la clase

export default UserRepositoriy
