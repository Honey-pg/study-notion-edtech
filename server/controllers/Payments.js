const {instance}=require("razorpay")
const User=require("../models/User")
const Course=require("../models/Course")
const mailSender=require("../utils/mailSender")
const {courseEnrollmentmail} = require("../mail/template/courseEnrollmentemail")
const { default: mongoose } = require("mongoose")

exports.capturePayment=async (req,res)=>{
    try {
        const {courseId}=req.body;
        const userId= req.user.id;

        if(!courseId){
            return res.json({
                success:false,
                message:"CourseID Not Valid!!"
            })
        }

            let course;
            course=await Course.findById(courseId); //course aagya pura yha par
            if(!course){
                return res.json({
                    success:false,
                    message:"Course Not find!!"
                })
            }

            const uid= mongoose.Types.ObjectId(courseId);
            if(course.studendsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"student is already enrolled"
                })
            }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
          }); 
    }

     const amount= course.price;
     const currency="INR"
     const options= {
        amount:amount*100,
        currency,
        receiptId:Math.random(Date.now()).toString(),
        notes:{   //after signature verify it is must needed
            courseId:courseId,
            userId
        }
     }
     try {
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            message:"Order Initiated",
            courseName:course.courseName,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
            
        })
     } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"could not initiate order"
        })
     }
}

exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}


const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try{
            //find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true},
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false,message:"Course not Found"});
        }

        const courseProgress = await CourseProgress.create({
            courseID:courseId,
            userId:userId,
            completedVideos: [],
        })

        //find the student and add the course to their list of enrolledCOurses
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
                courses: courseId,
                courseProgress: courseProgress._id,
            }},{new:true})
            
        ///bachhe ko mail send kardo
        const emailResponse = await mailSender(
            enrollStudents.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        )    
        //console.log("Email Sent Successfully", emailResponse.response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}



