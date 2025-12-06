import dotenv from 'dotenv';
 import path from 'path';


 dotenv.config({path:path.join(process.cwd(),".env")})

const config ={
    connection_srt:process.env.CONNECT_DATA,
    port:process.env.PORT,
    jswSecret:process.env.JWT_secret,
}

export default config