import dotenv from 'dotenv'

dotenv.config()

const ENVIROMENT = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    JWT_SECTRET: process.env.JWT_SECTRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_EMAIL: process.env.GMAIL_EMAIL,
    URL_FRONT: process.env.URL_FRONT,
    API_KEY_INTERN: process.env.API_KEY_INTERN,
    MYSQL: {
        HOST: process.env.MYSQL_HOST,
        USERNAME: process.env.MYSQL_USERNAME,
        PASSWORD: process.env.MYSQL_PASSWORD,
        DATABASE: process.env.MYSQL_DATABASE
    }
}

export default ENVIROMENT