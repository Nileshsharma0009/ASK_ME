// ============================================
// AUTH CONTROLLER - Staff Login & Registration
// ============================================
import User from "../models/UserModel.js"
import bcrypt from "bcryptjs" ;
import genToken from "../config/token.js"
// @POST /api/auth/register
// Expected body: { name, email, password }
// TODO: Hash password with bcryptjs, save to MongoDB
 


  export const register = async (req , res ) => {

    try{
   //  1 
      const { name , email , password } = req.body ;

      
   // 2    
      if(!name || !email || !password ){
        return res.status(400).json({message : "all field ar e required"}) ;
        
        
      }
// 3 
      const userExists = await User.findOne({email}) ;

       if( userExists){
         return res.status(400) .json({
           message: "email already registedred"
         })
       }


// 4
       const hashpassword = await bcrypt.hash(password , 10 ) ;

// 5 
       const user = await User.create({
        name ,
        email ,
        password : hashpassword ,
       }) ;

       
// 6

       res.status(201).json({
          message : "Registration successful " ,
           user:{
            id : user._id ,
            name :user.name ,
            email : user.email ,
           },
       });
    } 
    catch(errr){
      console.log(errr)
       return res.status(500).json({ message: "Registration failed" });
    }
}

// @POST /api/auth/login
// Expected body: { username (or email), password }
// TODO: Find user, validate password, generate JWT token


export const login = async ( req , res) => {

  try {
    const {email , password} = req.body  ;

    if( !email || !password) {
      return res.status(400).json({message : " invalid credentials"}) 
    }

    const user = await User.findOne({email}) ;

    if(!user){
       return res.status (401) .json({message : "invalid credtials"})
    }


    const  valid = await bcrypt.compare( password ,user.password) ;

    if(!valid ){
       return res.status (401) .json({message : "invalid credtials"})
    }

      const isProd = process.env.NODE_ENV === "production";

    const token = await genToken(user._id) ;

    res.cookie( "token" ,token , {  // <-- dont make  unneccssary spaces  it will be counted as a character 
      httpOnly: true ,
      secure : isProd ,
      sameSite : isProd ? "node " : "lax" ,
       maxAge: 7 * 24 * 60 * 60 * 1000
    })


    //     const token = await genToken(user._id);
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: isProd,
    //   sameSite: isProd ? "none" : "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000
    // })


    return res.status(200).json({
        user: { id: user._id, name: user.name, email: user.email }
    })
  }
  catch(err){
     console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }



}

// @POST /api/auth/logout

export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENVIRONMENT === 'production';
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax"
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: "Logout failed" });
  }
};


