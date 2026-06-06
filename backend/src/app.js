import express from "express" ;
import cors from "cors" ;
 import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js";
import systemRoutes from "./routes/system.routes.js"; // ◄ FIXED: Imported system routes
import axios from "axios";

import dotenv, { configDotenv } from "dotenv" ;

dotenv.config(); 
const app = express() ;
 
//  TODO : after deployment  dont forget to add  funtion  for cold start on render 
const url = `https://ask-me-pndw.onrender.com`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      // console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);



const baseUrl = process.env.FRONTEND_URL; //  YEH SAHI HAI 
// todo cors 
// app.use(cors({
//   origin: "https://ask-me-red-xi.vercel.app/"|| "http://localhost:5173",
//   credentials: true,
// }));

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://ask-me-red-xi.vercel.app/",
//     ],
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ask-me-red-xi.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());
// app.use (cookieParser()) ;


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/system", systemRoutes);

app.get("/api/health" ,  (req , res) => {
     res.json({ok :true}) ;
})


export default app ;
