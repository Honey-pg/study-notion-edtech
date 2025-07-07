const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/courseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription,status, price, tag, whatYouWillLearn } = req.body;
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      // !tag ||
      !whatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "All fiels are required",
      });
    }
    const thumbnail = req.files.thumbnailImage;
    const userid= req.user.id;
    const instructorDetails= await User.findById(userid);
    if(!instructorDetails){
        return res.status(404).json({
         success:false,
         message:"Instructor Details Not Found",
        })
    }
    
    // const tagDetails = await Course.findOne( tag ); // Changed from findById to findOne
    // if(!tagDetails){
    //     return res.status(404).json({
    //      success:false,
    //      message:"Tag Details Not Found",
    //     })
    // }

    const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
    console.log(thumbnailImage)
    const newCourse= await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        price,
        status,
        whatYouWillLearn,
        // tag:tagDetails,
        thumbnail:thumbnailImage.secure_url,
    })

    await User.findByIdAndUpdate(
    {_id:instructorDetails._id,},{
       $push:{ Courses:newCourse._id}  
    },{new:true}
)
  //  // update tag 
  //  Course.push(newCourse._id);
  //  await Course.save();

   return res.status(200).json({
    success:true,
    message:"Course created success",
    data:newCourse,
   })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Course not Created!"
    })
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      // .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.showAllCourses = async(req,res)=>{
   try {
    // 
     const allCourses = await Course.find({})
    return res.status(200).json({
        success:true,
        message:"data for all course fetched success",
        data:allCourses,
    })

   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"error while showing courses!",
        error:error.message,
    })
   }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course and populate sections
    const courseDetails = await Course.find({
      _id: courseId,
    })
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSection', 
        },
      })
      .populate({path:"instructor", populate:{path:"additionalDetails"}}) 
      .populate('category') 
      .populate('ratingAndreview') 
      .exec();
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:"course fetched success",
      data: courseDetails,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      await Section.findByIdAndDelete(sectionId)
    }

    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.getAllCoursesData = async (req, res) => {
  try {
    const allCourses = await Course.find({})
    .populate({
      path: 'instructor',
      select: 'firstName lastName image email',
    })
    .populate({
      path: 'courseContent',
      populate: {
        path: 'subSection',
        model: 'SubSection',
      },
      model: 'Section',
    })
    .populate('studentsEnrolled') 
    .populate('category') 
    .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}