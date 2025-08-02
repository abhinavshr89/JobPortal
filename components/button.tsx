import React from 'react'

function CustomButton({content}) {
  return (
    <button className='bg-blue-600 p-2 rounded-md'>
        {content}
    </button>
  )
}

export default CustomButton