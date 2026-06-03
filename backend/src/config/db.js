// MongoDB connection placeholder
import  mongoose from "mongoose" ;
import dotenv  from "dotenv" ;

let isConnected = false ;
dotenv.config();

 const connectDB = async () => {

    const uri = process.env.MONGODB_URL ;

    if(!uri){
        throw new Error(" Missing  MONGODB_URL enviroment variable ")
    }
 

 if( isConnected) {
    return ;
 }
 try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
 

//  isConnected = db.connection[0].readystate === 1 ;


    isConnected = db.connections[0].readyState === 1;

    // can also use  --->  isConnected = db.connection.readyState === 1;   <----

    console.log(" MongoDB connected ")


 } catch (error) {
    console.log(" MongDB Connection failed :" , error) ;


    throw error ;
 }
 }

export default connectDB ;