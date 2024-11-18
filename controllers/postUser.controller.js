import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const postUserController = (req, res) =>{
    const {name, email, password} = req.body
    try{
        if(!name){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(200)
            .setMessage('Bad Request')
            .setPayload({
                detail: 'Invalid Name'
            })
            .build()
            return res.json(response)
        }
        if(!email){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(200)
            .setMessage('Bad Request')
            .setPayload({
                detail: 'Invalid Email'
            })
            .build()
            return res.json(response)
        }
        if(!password){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(200)
            .setMessage('Bad Request')
            .setPayload({
                detail: 'Invalid Password'
            })
            .build()
            return res.json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Bad Request')
            .setPayload({
                message: 'User Registration Succeded',
                data: {
                    name: name,
                    email: email,
                    password: password
                }
            })
            .build()
        res.json(response)
    }

    catch(error){
        console.error(error.message)
    }
}

export default postUserController