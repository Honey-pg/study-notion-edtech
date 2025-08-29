const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")
const Profile=require("../models/Profile")

require('dotenv').config();

exports.sendOtp = async (req, res) => {
  try {
  
    const { email } = req.body

    const checkUserpresent = await User.findOne({ email });

    if (checkUserpresent) {
      return res.status(401).json({
        success: false,
        message: "user already registered",
      });
    }
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      const timeLeft = Math.ceil((existingOtp.expiresAt - Date.now()) / 1000);
      throw new Error(`Otp already sent. Try again in ${timeLeft} seconds.`);
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });
    console.log("otp generated:", otp);

    const result = await Otp.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        alphabets: false,
      });
      result = await Otp.findOne({ otp });
    }
    const otpPayload = {
      email: req.body.email,
      otp:otp
    };
    const Otpbody = await Otp.create(otpPayload);
    console.log(Otpbody);

    res.status(200).json({
      success: true,
      message: "otp sent success",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      contactnumber,
      otp,
    } = req.body;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      //in this we didnt pass accountType and contactnumber because bydefault accountType to kisi ek pr hi rhega vo to button h aur contact no. required true nhi h isliye nhi liya
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match Please try again later",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    const recentotp = await Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentotp);
    if (!recentotp) {
      return res.status(400).json({
        success: false,
        message: "OTP NOT FOUND",
      });
    } else if (otp !== recentotp.otp) {
      return res.status(400).json({
        success: false,
        message: "INVALID OTP",
      });
    }
    const profileDetails = await Profile.create({
      gender: null,
      contactnumber: null,
      dateofbirth: null,
      about: null,
    });

    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashpassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "user created success",
      user,
    });
  } catch (error) {
    console.log(error);
     return res.status(500).json({
        success:false,
        message:"user not registered Please try again!",
    })
  }
}

exports.login = async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All Fields are required,pls try again",
              });
        }
        const user= await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success: false,
                message: "user is not registered",
              });
        } 
        if(await bcrypt.compare(password,user.password)){

            const payload={
                email:user.email,
                accountType:user.accountType,
                id:user._id,
            }
          const token=jwt.sign(payload,process.env.JWT_SECRET,{
            // expiresIn:"2h",

          });
          user.token=token;

         const options = {
            expires:new Date( Date.now()+3*24*60*60*1000), // 3 days
            httpOnly:true,
         }
        res.cookie("token",token,options).json({
            success:true,
            token,
            user,
            message:"cookie created success"
        })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is wrong"
            })
        }
    } catch (error) {
         console.log(error);
         return res.status(500).json({
            success:false,
            message:"login failure",
         })
    }
}

exports.changePassword = async(req,res)=>{
    try{
      const {password,confirmPassword}=req.body;
      if(!password||!confirmPassword){
        return res.status(401).json({
          success:false,
          message:"Please enter Password"
        })
      }
      const user= await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      if (confirmPassword === password) {
        return res.status(400).json({ msg: 'New password must be different from current password' });
    }
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
    user.password=hashedPassword;
    await user.save();

    res.json({ msg: 'Password changed successfully' });
    } catch(error){
      return res.json({
        success:false,
        message:"password not changed",
      })
    }
}