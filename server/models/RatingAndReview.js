const mongoose=require("mongoose");

const ratingAndreviewSchema= new mongoose.Schema({
 User:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 rating:{
    type:Number,
    required:true,
 },
 review:{
    type:String,
    required:true,
    trim:true,
 }
})

module.exports= mongoose.model("RatingAndReview",ratingAndreviewSchema)