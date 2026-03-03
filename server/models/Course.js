const mongoose=require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName:{
    type:String,
    required:true,
    trim:true,
  },
  courseDescription:{
    type:String,
    required:true,
    trim:true,
  },
  instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  whatYouWillLearn:{
   type:String,
  },
  courseContent:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section",
  }],
  price:{
    type:Number,
  },
  studentsEnrolled:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  thumbnail:{
   type:String,
  },
  ratingAndReviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview",
  }],
  tag:{
    type:[String],
    
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
  },
  status:{
    type:String,
    enum:["Draft","Published"],
  },
  createdAt:{
    type:Date,
    default:Date.now(),
  },
  
})

module.exports= mongoose.model("Course",CourseSchema);