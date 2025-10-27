import React from 'react'

const VideoContainer = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 md:px-12 px-4 my-8'>
        <video className='min-h-[500px] max-h-[500px] object-cover rounded shadow' src='./VID-1.mp4' autoPlay muted loop />
        <video className='min-h-[500px] max-h-[500px] object-cover rounded shadow' src='./VID-3.mp4' autoPlay muted loop />
        <video className='min-h-[500px] max-h-[500px] object-cover rounded shadow' src='./VID-2.mp4' autoPlay muted loop />
        <video className='min-h-[500px] max-h-[500px] object-cover rounded shadow' src='./VID-5.mp4' autoPlay muted loop />
    </div>
  )
}

export default VideoContainer