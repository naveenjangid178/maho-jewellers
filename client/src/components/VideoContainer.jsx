import React from 'react'

const VideoContainer = () => {
  return (
    <section className='md:px-12 px-4 flex flex-col gap-4'>
      
      <div className='bg-[#F6F3EE] pt-12 pb-8 px-4 flex flex-col items-center gap-6 font-medium overflow-hidden rounded'>
        <h3 className='text-4xl text-center'>Explore & shop your favorites effortlessly!</h3>
        <span className='flex gap-4 overflow-x-auto scrollbar-hide'>
          <video className='min-h-[250px] max-h-[250px] object-cover rounded shadow' src='./Video-72.mp4' autoPlay muted loop />
          <video className='min-h-[250px] max-h-[250px] object-cover rounded shadow' src='./Video-415.mp4' autoPlay muted loop />
          <video className='min-h-[250px] max-h-[250px] object-cover rounded shadow' src='./Video-737.mp4' autoPlay muted loop />
          <video className='min-h-[250px] max-h-[250px] object-cover rounded shadow' src='./Video-487.mp4' autoPlay muted loop />
        </span>
      </div>
    </section>
  )
}

export default VideoContainer