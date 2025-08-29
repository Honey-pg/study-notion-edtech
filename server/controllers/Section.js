const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        Success: "false",
        message: "All fields are required",
      });
    }

    const newSection = await Section.create({ sectionName });
    const updateCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection", // nested populate
      },
    });

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updateCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Section not created..Error!",
    });
  }
};

exports.updateSection=async(req,res)=>{
    try {
        const {sectionName,sectionId,courseId} = req.body;
        if (!sectionName || !sectionId) {
            return res.status(400).json({
              Success: "false",
              message: "All fields are required",
            });
          }
          const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
          const course = await Course.findById(courseId)
          .populate({
            path:"courseContent",
            populate:{
              path:"subSection",
            },
          })
          .exec();

          return res.status(200).json({
            success: true,
            message: "Section Updated successfully",
            data:course,
          });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Section not Updated..Error!",
          error:error.message,
        });
    }
}

exports.deleteSection= async (req,res)=>{
    try {
        const {sectionId,courseId}=req.body;
        await Course.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          }
        })
        await SubSection.deleteMany({_id: {$in: sectionId.subSection}});

        await Section.findByIdAndDelete(sectionId);
    
        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
          path:"courseContent",
          populate: {
            path: "subSection"
          }
        })
        .exec(); 
        return res.status(200).json({
            success:true,
            message:"Section Deleted success",
            data:course,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Section not Deleted..Error!",
          error:error.message,
        });  
    }
}