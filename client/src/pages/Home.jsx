import React from 'react'
import Footer from '../components/Footer'
import BlogContainer from '../components/BlogContainer'
import NewArrivals from '../components/NewArrivals'
import TopProduct from '../components/TopProduct'
import ImageSlider from '../components/ImageSlider'
import {Testimonials} from '../components/Testimonials'
import Navbar from '../components/Navbar'
import Popup from '../components/Popup'

const Home = () => {
  return (
    <div>
      <Popup />
      <Navbar />
      <ImageSlider />
      <TopProduct />
      <NewArrivals />
      <BlogContainer />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home