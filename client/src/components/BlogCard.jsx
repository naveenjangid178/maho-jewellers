import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ title, index, image, heading, id }) => {
    const navigate = useNavigate()

    return (
        <div key={index} className="text-start flex flex-col gap-2 shadow-xs shadow-gray-500 bg-[#F6F3EE] p-4 pb-2 rounded justify-between">
            <img src={image} alt={heading} className="w-full h-52 rounded object-cover mb-2" />
            <p className='text-[#9C1137] text-start py-3 font-medium'>{String(heading).toUpperCase()}</p>
            <p className='text-[#383434] opacity-60'>{title}</p>
            <span className='flex justify-end items-end flex-col gap-1 pt-4'>
                <button 
                className='text-end text-white bg-[#9C1137] w-fit py-1 mr-1 px-4 cursor-pointer'
                onClick={() => navigate(`/blog/${id}`)}
                >Read more</button>
                <p className='w-20 h-[1px] bg-[#9C1137]'></p>
            </span>
        </div>
    )
}

export default BlogCard