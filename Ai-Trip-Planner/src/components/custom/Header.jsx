import React from 'react'

function Header() {
  return (
    <div className='p-4 shadow-md flex justify-between items-center '>
      <img src="/logo.svg " alt="" />
      <button className='text-white'>Sign in</button>
    </div>
  )
}

export default Header
