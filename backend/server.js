
import app from "./src/app.js" ;
 import connectDB from "./src/config/db.js" 

import dotenv from "dotenv" ;
dotenv.config()

const PORT = process.env.PORT ;


const StartServer = async () =>{

    try{
        
        await connectDB() ;
         
        app.listen(PORT , () =>{
             console.log(`server is running on port ${PORT}`)
        });
    } catch (error) {
        console.log("failed to start  server :" , error) ;

        process.exit(1) ;
    }
};


 StartServer() ;