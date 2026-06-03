import express from "express" ;
import cors from "cors" ;
 import authRoutes from "./routes/auth.routes.js"

const app = express() ;
 
//  TODO : after deployment  dont forget to add  funtion  for cold start on render 


// todo cors 


app.use(express.json()) ;
// app.use (cookieParser()) ;


app.use("/api/auth", authRoutes);

app.get("/api/health" ,  (req , res) => {
     res.json({ok :true}) ;
})


export default app ;