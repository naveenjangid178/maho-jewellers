import { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import { getBlog } from '../utils/blog'
import Navbar from '../components/Navbar'

const Blog = () => {
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
        <>
        <Navbar />
        <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 justify-between'>
                {blogs.slice(0, 3).map((items, i) => <BlogCard heading={items.title} image={items.image} index={i} title={`${items.content.slice(0, 150)}.....`} id={items._id} />)}
            </div>
        </section>
        </>
    )
}

export default Blog