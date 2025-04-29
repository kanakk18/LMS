import React from 'react'
import Hero from '../../components/students/Hero'
import Companies from '../../components/students/Companies'
import CourseSection from '../../components/students/CourseSection'
import TestimonialSections from '../../components/students/testimonialsections'
import Calltoaction from '../../components/students/calltoaction'
import Footer from '../../components/educator/footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Companies />
      <CourseSection />
      <TestimonialSections />
      <Calltoaction />
      <Footer/>
    
    </div >
  )
}

export default Home
