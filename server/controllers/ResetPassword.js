const User=require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto")

exports.resetPasswordToken=async(req,res)=>{
    try {
        const {email}= req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"your email is not found"
            })
        }
        const token = crypto.randomBytes(20).toString("hex"); //for making url more secure

        const updateDetails = await User.findOneAndUpdate(
                                             {email:email},
                                             {
                                                token:token,
                                                resetPasswordExpires:Date.now()+5*60*1000,
                                             },
                                            {new:true})

        const url = `http://localhost:3000/update-password/${token}` 
        console.log(updateDetails)
        await  mailSender(email,"Password Reset link",`Password Reset link: ${url}`);

        return res.json({
            success:true,
            message:"email sent successfully,change password",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"email sent failed",
        }) 
    }
}


exports.resetPassword=async(req,res)=>{
    try {
        const {password,confirmPassword,token} = req.body; // frontend push this to body
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password Not Matching"
            })
        }

        const userDetails = await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is Invalid"
            })
        }

        if( userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token expires Try again!"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
        {token:token},
        {password:hashpassword},
        {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"password reset successfull"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}