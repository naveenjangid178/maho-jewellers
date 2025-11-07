import React from 'react'

const ImageContainer = () => {
    return (
        <div className='md:px-12 px-4 flex flex-col gap-4'>
            <div className="flex flex-col md:flex-row gap-2 h-auto md:h-105">
                <div className="overflow-hidden w-full md:w-2/3 md:h-105">
                    <img
                        src="./vci4.jpg"
                        alt="Image 1"
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                </div>

                {/* Right column of two smaller images */}
                <div className="flex flex-col gap-2 w-full md:w-1/3">
                    <div className="overflow-hidden md:h-52">
                        <img
                            src="./vci1.jpg"
                            alt="Image 2"
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                    <div className="overflow-hidden md:h-52">
                        <img
                            src="./vci2.jpg"
                            alt="Image 3"
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageContainer