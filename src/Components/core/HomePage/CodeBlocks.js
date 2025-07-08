import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./Button"

import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, imgPos, backgroudGradient, codeColor
}) => {
  return (
    <div className={`flex flex-row ${position} my-14 max-w-[1200px] mx-auto px-5 relative justify-between gap-14 lg:pl-16 lg:pr-4 lg:gap-10`}>
             <div className='w-[100%] lg:w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold '>
                {subheading}
            </div>

            <div className='flex flex-row gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                        {ctabtn2.btnText}
                </CTAButton>
            </div>
            </div>
            <div className="h-fit code-border flex flex-row py-3 ml-12 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative  w-[100%] lg:w-[55%]">   
            {backgroudGradient}
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                <p>12</p>

            </div>

            <div className={`w-[70%] flex flex-col gap-2 font-bold  font-mono pr-2`}>
                <TypeAnimation
                    sequence={[codeblock[0], 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                            color: `yellow`,                  
                        }
                    }
                    omitDeletionAnimation={true}
                />
                <TypeAnimation
                    sequence={[codeblock[1], 1000, ""]}
                    repeat={Infinity}
                    cursor={true}
                
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                            color: `white`,                  
                        }
                    }
                    omitDeletionAnimation={true}
                />
                <TypeAnimation
                    sequence={[codeblock[2], 200, ""]}
                    repeat={Infinity}
                    cursor={true}
                
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                            color: `#D43D63`,                  
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
            

        </div>
        </div>
      
    
  )
}

export default CodeBlocks
