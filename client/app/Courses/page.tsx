'use client'
import Courses from '@/components/Home/Courses/Courses'
import PremiumCourses from '@/components/Home/Premium/Premium'
import KnowledgeTest from '@/components/Home/TestYour/TestYour'
import React from 'react'

const Home = () => {
  return (
    <div>
        <KnowledgeTest/>
        <Courses/>
        {/* <PremiumCourses/> */}
    </div>
  )
}

export default Home