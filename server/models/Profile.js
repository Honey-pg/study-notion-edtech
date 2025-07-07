const { type } = require("express/lib/response");
const mongoose=require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateofbirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactnumber:{
        type:Number,
    }
})

module.exports= mongoose.model("Profile",profileSchema);