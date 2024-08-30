import React from 'react'


function Hero() {
  return (
    <div className='flex justify-center items-center bg-color-turq px-5 space-x-10'>
      <img src='/HeroImage.svg' alt='Hero Image' className='hidden md:block'></img>
      <div className='flex flex-col'>
        <h1 className='text-3xl text-white font-light'>Welcome to</h1>
        <h1 className='text-2xl text-white mt-6'> <span className='font-semibold text-4xl'>Smart Insure</span> - Intelligent Medical Claim</h1>
      </div>
    </div>
  )
}

export default Hero