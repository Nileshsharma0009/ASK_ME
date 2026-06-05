import express from "express" ;
import cors from "cors" ;
 import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js";
import systemRoutes from "./routes/system.routes.js"; // ◄ FIXED: Imported system routes

import dotenv, { configDotenv } from "dotenv" ;

dotenv.config(); 
const app = express() ;
 
//  TODO : after deployment  dont forget to add  funtion  for cold start on render 




const baseUrl = process.env.FRONTEND_URL; //  YEH SAHI HAI 
// todo cors 
app.use(cors({
  origin: baseUrl?.trim() || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
// app.use (cookieParser()) ;


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/system", systemRoutes);

app.get("/api/health" ,  (req , res) => {
     res.json({ok :true}) ;
})


export default app ;
