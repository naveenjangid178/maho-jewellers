import React from 'react'
import { blogs } from '../details'
import BlogCard from './BlogCard'

const BlogContainer = () => {
    return (
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl font-medium py-4'>Blogs</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 justify-between'>
                {blogs.map((items, i) => <BlogCard heading={items.heading} image={items.image} index={i} title={items.title} />)}
            </div>
            <button className='text-[#9C1137] py-1 border border-[#9C1137] text-center w-fit m-auto px-8 font-normal cursor-pointer hover:font-medium transform duration-100 ease-in-out'>View All</button>
        </section>
    )
}

export default BlogContainer