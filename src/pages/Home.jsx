import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHighlighter } from "react-icons/fa";
import HighlightText from "../Components/core/HomePage/HighlightText";
import CTAButton from "../Components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"
import elipseImage1 from "../assets/Images/Ellipse 1.png";
import elipseImage2 from "../assets/Images/Ellipse 2.png";
import elipseImage3 from "../assets/Images/Ellipse 3.png";
import "./Home.css";
import CodeBlocks from "../Components/core/HomePage/CodeBlocks";


const Home=()=>{
  return (
    <div className="">
      <div className='relative mx-auto flex flex-col w-11/12  items-center max-w-maxContent text-white'>
        <Link to={"SignUp"}>
        <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 w-fit shadow-md shadow-pure-greys-600">
          <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration-200 group-hover:bg-richblack-900">
            <p>Become an Instructor</p>
            <FaArrowRight/>
          </div>
        </div>
        </Link>
        <div className="text-center text-4xl font-400 mt-7">
          Empower Your Future With
          <HighlightText text={"Coding Skills"}/>
          </div>
          <div className="mt-4 w-[80%] text-lg text-center font-bold leading-6 text-richblack-300">
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 

          </div>
          <div className='flex flex-col relative items-center gap-7  mt-32 mb-10'>
                <div className='flex flex-row gap-7 mt-10 absolute lg:z-50 bottom-[100%]'>
                    <CTAButton active={true} linkto={"/signup"}> 
                        Learn More
                    </CTAButton>

                    <CTAButton active={false} linkto={"/login"}> 
                        Book a Demo
                    </CTAButton>
                </div>

                <div className='mx-3 my-12 shadow-blue-400  -z-10s relative vid1'>
                    <div > 
                        <img src = {elipseImage2} width={"100%"}
                        className='absolute bottom-[1%] -z-10 ' 
                        alt='elipse ' />
                        <img src = {elipseImage1} width={"100%"}
                        className='absolute right-[12%] top-[2%] -z-10'
                        alt='elipse ' />
                        
                    </div>
                    <video muted loop autoPlay className="h-[600px]">
                        <source  src={Banner} type="video/mp4" />
                    </video> 
                    
                </div>
            </div>

          <div>
            <CodeBlocks   position={"lg:flex-row"}
                    // imgPos = {"-top-[40%] right-[8%]"}
                    heading={
                        <div className='text-3xl font-semibold'>
                            Unlock Your
                            <HighlightText text={"coding potential"}/>
                            {" "} with our online courses
                        </div>
                    }
                    subheading = {
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            btnText: "Try it Yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={[`<!DOCTYPE html>`,`<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>`,`h1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`]}
                    codeColor={"text-yellow-25"}
                    // backgroudGradient={elipseImage3}
                    backgroudGradient={<div className="codeblock1 absolute"></div>}/>
          </div>
                      {/* CODE-SECTION-2 */}
                      <div className="mr-8"> 
                <CodeBlocks 
                    position={"lg:flex-row-reverse"}
                    // imgPos = {"-top-[40%] right-[66%]"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Start 
                            <HighlightText text={`coding`}/>
                            <br />
                            <HighlightText text={` in seconds`}/>
                        </div>
                    }
                    subheading = {
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                        {
                            btnText: "Continue Lesson",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }

                    codeblock={[`<!DOCTYPE html>`,`<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>`,`h1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`]}
                    codeColor={"text-yellow-25"}
                    // backgroudGradient={elipseImage2}
                    backgroudGradient={<div className="codeblock2 absolute"></div>}
                />
            </div>
      </div>
    </div>
  );
}

export default Home;
