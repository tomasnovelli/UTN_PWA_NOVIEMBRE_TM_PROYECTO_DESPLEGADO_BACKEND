import express from 'express'
import {
    addNewUser, 
    forgotPasswordController, 
    loginController, 
    resetTokenController, 
    verifyMailValidationTokenController 
} from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/add-new-user', addNewUser)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)

authRouter.post('/login', loginController)
authRouter.post('/forgot-password', forgotPasswordController)

authRouter.put('/reset-password/:reset_token', resetTokenController )

export default authRouter