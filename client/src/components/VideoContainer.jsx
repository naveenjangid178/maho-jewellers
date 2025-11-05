import React from 'react'

const VideoContainer = () => {
  return (
    <section className='md:px-12 px-4 my-8 flex flex-col gap-4'>
      <div className="flex flex-col md:flex-row gap-2 h-auto md:h-105">
        <div className="overflow-hidden w-full md:w-2/3 md:h-105">
          <img
            src="./f1.jpg"
            alt="Image 1"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>

        {/* Right column of two smaller images */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <div className="overflow-hidden md:h-52">
            <img
              src="./f2.jpg"
              alt="Image 2"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
          <div className="overflow-hidden md:h-52">
            <img
              src="./f3.jpg"
              alt="Image 3"
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </div>
      </div>


      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#F6F3EE] p-2 rounded'>
        <video className='min-h-[450px] max-h-[450px] min-w-full object-cover rounded shadow' src='./Video-72.mp4' autoPlay muted loop />
        <video className='min-h-[450px] max-h-[450px] min-w-full object-cover rounded shadow' src='./Video-415.mp4' autoPlay muted loop />
        <video className='min-h-[450px] max-h-[450px] min-w-full object-cover rounded shadow' src='./Video-737.mp4' autoPlay muted loop />
        <video className='min-h-[450px] max-h-[450px] min-w-full object-cover rounded shadow' src='./Video-487.mp4' autoPlay muted loop />
      </div>
    </section>
  )
}

export default VideoContainer