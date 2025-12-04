import React from 'react'
import { Target,Clock,Bell,TrendingUp,BarChart3,CheckCircle } from 'lucide-react';
import TitleCard from './TitleCard';
const FeatureSection = () => {
    const features = [
    {
      icon: <Target className="w-12 h-12 text-blue-600" />,
      title: "Personalized Recommendations",
      description: "Get habit suggestions tailored to your age, health conditions, and fitness goals."
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: "Smart Timers & Tracking",
      description: "Track your habits with built-in timers and monitor actual time spent on each activity."
    },
    {
      icon: <Bell className="w-12 h-12 text-blue-600" />,
      title: "Timely Alerts",
      description: "Never miss a habit with intelligent reminders and notifications at the right time."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: "Streak Tracking",
      description: "Build momentum with streak counters that motivate you to maintain consistency."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
      title: "Progress Analytics",
      description: "Visualize your journey with detailed charts showing daily, weekly, and monthly progress."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-blue-600" />,
      title: "Daily Dashboard",
      description: "View all your habits in one place and mark them complete as you go through your day."
    }
  ];
  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TitleCard title="Everything You Need to Succeed" subTitle="Habivance combines smart technology with behavioral science to help you build lasting habits." titleColor="text-gray-900" subTitleColor="test-gray-600"/>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
  )
}

export default FeatureSection