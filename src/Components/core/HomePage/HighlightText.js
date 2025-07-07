import { specialCharMap } from '@testing-library/user-event/dist/keyboard'
import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent'>
        {" "}
        {text}
    </span>
  )
}

export default HighlightText; 
