import React from 'react'

const Footer = () => {
  return (
    <div className='mt-auto'>
    <footer className="bg-gray-800 text-white py-8 mt-20">
      <div className="container mx-auto flex flex-col items-center gap-4">
        <p className="text-center">&copy; Copyright 2024 Smart-Insure</p>
        <nav className="flex gap-4">
          <a href="/home" className="hover:text-gray-300">Home</a>
          <a href="/" className="hover:text-gray-300">Dashboard</a>
          <a href="/my-profile" className="hover:text-gray-300">Profile</a>

        </nav>
        
      </div>
    </footer>
    </div>
  )
}

export default Footer
