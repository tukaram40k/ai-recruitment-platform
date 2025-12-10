import React from 'react'
import myGif from '../assets/amogus.gif'

const Placeholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <img src={myGif} alt="Placeholder" />
    </div>
  )
}

export default Placeholder
