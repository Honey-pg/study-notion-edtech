const jwt=require("jsonwebtoken")
require("dotenv").config();

const user= require("../models/User")

exports.auth = async (req,res,next)=>{   
    try {
       
        const token=req.header("Authorization").replace("Bearer ","")||req.cookies.token||req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing",
            })
        }
        try {
            
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            // console.log("Token decoded successfully ✅:", decode);
            req.user=decode;
          
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"verify failure token"
            })
        };
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating token"
        })
    } 
}

exports.isStudent= async(req,res,next)=>{
   try {
     if(req.user.accountType!=="Student"){
        return res.status(401).json({
            success:false,
            message:"this route is for student only"
        })
     }
    next();
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"User role cannot be verified"
    })
}
}

exports.isInstructor= async(req,res,next)=>{
    try {
      if(req.user.accountType!=="Instructor"){
         return res.status(401).json({
             success:false,
             message:"this route is for Instructor only"
         })
      }
     next();
    } catch (error) {
     return res.status(500).json({
         success:false,
         message:"User role cannot be verified"
     })
 }
 }

 exports.isAdmin= async(req,res,next)=>{
    try {
      if(req.user.accountType!=="Admin"){
         return res.status(401).json({
             success:false,
             message:"this route is for Admin only"
         })
      }
     next();
    } catch (error) {
     return res.status(500).json({
         success:false,
         message:"User role cannot be verified"
     })
 }
 }

