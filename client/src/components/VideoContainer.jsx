import React from 'react'

const VideoContainer = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 md:px-12 px-4 my-8'>
        <video className='min-h-[400px] object-cover' src='./home1.mp4' autoPlay muted loop />
        <video className='min-h-[400px] object-cover' src='./home1.mp4' autoPlay muted loop />
        <video className='min-h-[400px] object-cover' src='./home1.mp4' autoPlay muted loop />
        <video className='min-h-[400px] object-cover' src='./home1.mp4' autoPlay muted loop />
    </div>
  )
}

export default VideoContainer