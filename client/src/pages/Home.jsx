import React from 'react'
import Footer from '../components/Footer'
import BlogContainer from '../components/BlogContainer'
import NewArrivals from '../components/NewArrivals'
import TopProduct from '../components/TopProduct'
import ImageSlider from '../components/ImageSlider'
import {Testimonials} from '../components/Testimonials'
import Navbar from '../components/Navbar'
import Popup from '../components/Popup'
import Featured from '../components/Featured'
import CatalogueContainer from '../components/CatalogueContainer'
import VideoContainer from '../components/VideoContainer'

const Home = () => {
  return (
    <div>
      <Popup />
      <Navbar />
      <ImageSlider />
      <TopProduct />
      <NewArrivals />
      <CatalogueContainer />
      <Featured />
      <BlogContainer />
      <VideoContainer />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home