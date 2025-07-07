const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"]
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    image:{
        type:String,
        required:true,
    },
    token:{
        type: String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    Courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"
    }],
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress",
    }]
},
{ timestamps: true }
);


module.exports = mongoose.model("User",userSchema);