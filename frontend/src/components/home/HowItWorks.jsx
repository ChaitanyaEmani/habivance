import React from 'react'
import TitleCard from './TitleCard'

const HowItWorks = () => {
  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TitleCard title=" How Habivance Works" subTitle="Get started in 4 simple steps" titleColor="text-gray-900" subTitleColor="text-gray-700"/>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Profile", desc: "Enter your age, height, weight, and health conditions" },
              { step: "2", title: "Get Recommendations", desc: "Receive personalized habit suggestions based on your profile" },
              { step: "3", title: "Build Your Plan", desc: "Add habits to your daily schedule and set timers" },
              { step: "4", title: "Track & Improve", desc: "Complete habits, track streaks, and analyze your progress" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
  )
}

export default HowItWorks