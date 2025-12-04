import React from 'react'
import { Link } from 'react-router-dom'
import TitleCard from './TitleCard'
const CTASection = ({token}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TitleCard titleColor="text-white" subTitleColor="text-blue-100" title="Ready to Transform Your Life?" subTitle=" Join thousands of users who are building better habits with Habivance" />
          <Link 
            to={token ? "/routine":"/register"}
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
          >
            Start Your Journey Today
          </Link>
        </div>
  )
}

export default CTASection