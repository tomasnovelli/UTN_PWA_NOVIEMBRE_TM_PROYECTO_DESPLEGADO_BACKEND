import transporter from "../config/transporter.config.js"

const sendEmail = async (options) =>{
    try{
        await transporter.sendMail(options)
        console.log('email enviado')
    }
    catch(error){
        console.error('Error al enviar mail:', error)
        throw error
    }
    
}

export {sendEmail}