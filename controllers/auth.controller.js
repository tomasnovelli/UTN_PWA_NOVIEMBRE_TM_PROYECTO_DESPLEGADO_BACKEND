import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"
import { validateEmail, validateName, validatePassword } from "../utils/validations/validations.js"
import jwt from 'jsonwebtoken'
import ENVIROMENT from "../config/enviroment.config.js"
import { sendEmail } from "../utils/mail.util.js"
import UserRepositoriy from "../repositories/user.repository.js"

const addNewUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name)
        if (!validateName(name)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload(
                    {
                        detail: 'Name not valid, must be more than 3 characters and no numbers'
                    }
                )
                .build()
            return res.json(response)
        }
        if (!validateEmail(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload(
                    {
                        detail: 'Email not valid, must be in correct format, ex: juan@gmail.com'
                    }
                )
                .build()
            return res.json(response)
        }
        if (!validatePassword(password)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload(
                    {
                        detail: 'Password not valid, must be between 5 and 12 characters'
                    }
                )
                .build()
            return res.json(response)
        }

        const existUser = await User.findOne({ email: email })
        if (existUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload(
                    {
                        detail: 'El email ya esta en uso'
                    }
                )
                .build()
            return res.json(response)
        }

        const hasedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign({ email: email }, ENVIROMENT.JWT_SECTRET, { expiresIn: '1d' })

        const url_verification = `http://localhost:${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Verifica tu mail',
            html: `
            <h1>Verificacion de mail</h1>
            <p>hola ${name} te pedimos por favor que verifiques tu mail haciendo click en el siguiente link</p>
            <a 
                style="'background-color': 'black'; 'color': 'white'; 'padding' 5px; 'border-radius': 5px;"
                href=${url_verification}
            >click de verificacion</a>
        `
        })
        const newUser = new User(
            {
                name,
                password: hasedPassword,
                email,
                verificationToken: verificationToken
            }
        )
        await newUser.save()
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('User Registered')
            .setPayload(
                {
                    data: {
                        name: newUser.name,
                        email: newUser.email,
                        password: newUser.password
                    }
                }
            )
            .build()
        res.json(response)
    }

    catch (error) {
        console.log('error adding user', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setPayload(
                {
                    detail: error.message
                }
            )
            .build()
        res.status(500).json(response)
    }
}
const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params
        if (!verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setPayload({
                    detail: 'Falta enviar token'
                })
                .build()
            return res.json(response)
        }
        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECTRET)
        const user = await User.findOne({ email: decoded.email })
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'User no found'
                })
                .build()
            return res.json(response)
            //logica de error de not found
        }
        if (user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(500)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'User already verified'
                })
                .build()
            return res.json(response)
            //logica de email ya verificado
        }
        user.emailVerified = true
        //user.verificationToken = undefined
        await user.save()
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Email verified')
            .setPayload({
                message: 'User Validated'
            })
            .build()
        res.json(response)
    }
    catch (error) {
        console.error(error)
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)
        const user = await User.findOne({ email })
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User Not Found')
                .setPayload({
                    detail: 'Email Not Registered'
                })
                .build()
            return res.json(response)
        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Email not verified')
                .setPayload({
                    detail: 'the email is not verified, please do it to continue'
                })
                .build()
            return res.json(response)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('incorrect credentials')
                .setPayload({
                    detail: 'The password is not valid, try again'
                })
                .build()
            return res.json(response)
        }
        const token = jwt.sign(
            { 
                email: user.email, 
                id: user._id, 
                role: user.role 
            }, 
            ENVIROMENT.JWT_SECTRET, 
            { expiresIn: '1d' })
            
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('User Logged')
            .setPayload({
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
            .build()
        res.json(response)
    }
    catch (error) {
        console.error(error.message)
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

const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        /* const validateEmail = validateEmail(email) */
        if (!email) {
            //respuesta de email invalido
        }
        /* const user = await UserRepositoriy.obtenerPorEmail(email) */
        const user = await User.findOne({ email: email })

        if (!user) {
            //logica de usuario no encontrado 404
        }
        const restetToken = jwt.sign({ email: user.email }, ENVIROMENT.JWT_SECTRET, {
            expiresIn: '1h'
        })
        const resetUrl = `${ENVIROMENT.URL_FRONT}/reset-password/${restetToken}`
        await sendEmail({
            to: user.email,
            subject: 'Restablecer Contraseña',
            html: `
                <div>
                    <h1>Has solicitado reestablecer contraseña</h1>
                    <p>Has click en el enlace de abajo para restablecer tu contraseña</p>
                    <a href=${resetUrl}>Restablecer contraseña</a>
                </div>
            `
        })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Se envio el correo')
            .setPayload({
                detail: 'se envio un correo electronico con las instrucciones para restablecer contraseña'
            })
            .build()
        return res.json(response)
    }
    catch (error) {
        console.error(error)
        //manejar logica de error
    }
}

const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params
        if (!password) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Contraseña Invalida')
                .setPayload({
                    detail: 'Error de contraseña, por favor ingresar un valor valido'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('token de reseteo invalido')
                .setPayload({
                    detail: 'El token de reseteo no existe'
                })
                .build()
            return res.status(400).json(response)
        }
        const decoded = jwt.verify(reset_token, ENVIROMENT.JWT_SECTRET)

        if (!decoded) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('token de reseteo invalido')
                .setPayload({
                    detail: 'El token de reseteo no es invalido'
                })
                .build()
            return res.status(400).json(response)
        }
        const { email } = decoded
        const user = await UserRepositoriy.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Usuario no encontrado')
                .setPayload({
                    detail: 'No se encontro registrado el usario con ese email'
                })
                .build()
            return res.status(400).json(response)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        await user.save()
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('contraseña actualizada')
            .setPayload({
                detail: 'La contraseña de actualizo correctamente'
            })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('internal server error')
            .setPayload({
                detail: error.message
            })
            .build()
        res.status(500).json(response)
    }

}



export { addNewUser, verifyMailValidationTokenController, loginController, forgotPasswordController, resetTokenController }