//mysql esta version se manejaba con callbacks


//mysql2/promise

import mysql from 'mysql2/promise'
import ENVIROMENT from '../config/enviroment.config.js'

const database_pool = mysql.createPool({
    host: ENVIROMENT.MYSQL.HOST,
    user: ENVIROMENT.MYSQL.USERNAME,
    password: ENVIROMENT.MYSQL.PASSWORD,
    database: ENVIROMENT.MYSQL.DATABASE,
    connectionLimit: 10,

})

const checkConnection = async() =>{
    try{
        const connection = await database_pool.getConnection()//devolver la conexion
        await connection.query('SELECT 1') //consulta simple de excusa para verificar la conexion
        //cuando la consulta falle dara un throw
        console.log('conexion exitosa con mysql')
        connection.release // matar la conexion de la pool
    }
    catch(error){
        console.error("error al conectar con la base de datos")
    }

}

checkConnection()
export default database_pool