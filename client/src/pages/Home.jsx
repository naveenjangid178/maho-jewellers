import React from 'react'
import Footer from '../components/Footer'
import BlogContainer from '../components/BlogContainer'
import NewArrivals from '../components/NewArrivals'
import TopProduct from '../components/TopProduct'
import ImageSlider from '../components/ImageSlider'
import { Testimonials } from '../components/Testimonials'
import Navbar from '../components/Navbar'
import Popup from '../components/Popup'
import Featured from '../components/Featured'
import CatalogueContainer from '../components/CatalogueContainer'
import VideoContainer from '../components/VideoContainer'
import { MessageCircleCode } from 'lucide-react'
import AnimatedImages from '../components/AnimatedImages'
import About from '../components/About'
import ImageContainer from '../components/ImageContainer'

const Home = () => {
  return (
    <div>
      {/* <Popup /> */}
      <Navbar />
      <ImageSlider />
      <TopProduct />
      <NewArrivals />
      <CatalogueContainer />
      <Featured />
      <BlogContainer />
      <AnimatedImages />
      <ImageContainer />
      <About />
      <VideoContainer />
      <Testimonials />
      <Footer />
      <a
        href="https://wa.me/918824891530"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 font-[Platypi] bg-green-500 p-2 rounded font-thin text-sm text-green-900 flex items-center gap-1 cursor-pointer"
      >
        <MessageCircleCode />
        Chat on WhatsApp
      </a>

    </div>
  )
}

export default Home