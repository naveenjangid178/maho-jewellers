import { useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import { useNavigate } from 'react-router-dom'
import { getBlog } from '../utils/blog'

const BlogContainer = () => {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getBlog();
                setBlogs(response);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl font-medium py-4'>Blogs</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 justify-between'>
                {blogs.slice(0, 3).map((items, i) => <BlogCard heading={items.title} image={items.image} index={i} title={`${items.content.slice(0, 150)}.....`} id={items._id} />)}
            </div>
            <span className='py-1 border border-[#9C1137] w-fit m-auto mt-8'>
                <button
                    className='text-[#9C1137] text-center hover:font-medium  px-8 font-normal cursor-pointer hover:scale-110 transform duration-100 ease-in-out'
                    onClick={() => navigate("/blog")}
                >View All</button>
            </span>
        </section>
    )
}

export default BlogContainer