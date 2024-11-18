import express from 'express'
import getPingController from '../controllers/status.controller.js'
import postUserController from '../controllers/postUser.controller.js'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'

const testRouter = express.Router()


testRouter.get('/ping', getPingController)

testRouter.get('/protected-route/ping', verifyTokenMiddleware(['user']), getPingController)

testRouter.post('/url-encoded',postUserController)

testRouter.post('/raw', (req, res) =>{
    try{
        const userPostTest = req.body
        if(userPostTest){
            res.json({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
        }
    }
    catch(error){
        console.error(error.message)
    }

})

export default testRouter