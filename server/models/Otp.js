const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/template/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email:{
    type:String,
    trim:true,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expired: 5*60,
  },
  otp:{
    type:String,
    required:true,
  }
})
async function sendVerificationEmail(email,otp){
  try{
    
    const mailResponse = await mailSender(email,
         "Verification EMAIL from StudyNotion by-Dhruv",
         emailTemplate(otp));
    console.log("Email sended Successfully!! => ", mailResponse);
} catch(error) {
    // console.error(error);
    console.log("error while SENDING.. EMAIL", error);
    throw error;
}
}
otpSchema.pre("save", async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})

module.exports= mongoose.model("Otp",otpSchema);