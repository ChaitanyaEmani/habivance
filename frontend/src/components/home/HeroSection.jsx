import React from 'react'
import { Link } from 'react-router-dom'
const HeroSection = ({token}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Build Better Habits,<br />Transform Your Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Track your daily habits, set timers, receive alerts, and watch your progress with personalized recommendations based on your health profile.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={token?"/routine":"/register"} 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
              >
                {token ?"Start your journey":"Get Started Free"}
              </Link>
              {!token && <Link 
                to="/login" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg transition"
              >
                Login
              </Link>} 
            </div>
          </div>
        </div>
  )
}

export default HeroSection