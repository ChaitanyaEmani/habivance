import React, { use } from 'react';
import { Activity, Target, TrendingUp, Clock, Bell, BarChart3, Check, Zap, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description: "Get smart habit suggestions based on your age, health profile, and goals.",
      color: "bg-blue-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Built-in Timers",
      description: "Track time spent on each habit with intuitive timer controls.",
      color: "bg-purple-500"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Never miss a habit with timely notifications and reminders.",
      color: "bg-orange-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Streak Tracking",
      description: "Build momentum with consecutive day tracking and progress visualization.",
      color: "bg-green-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Visualize your progress with detailed charts and insights.",
      color: "bg-pink-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health-First Approach",
      description: "Recommendations tailored to your specific health conditions and BMI.",
      color: "bg-red-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: <Activity /> },
    { label: "Habits Tracked", value: "50K+", icon: <Target /> },
    { label: "Success Rate", value: "85%", icon: <TrendingUp /> },
    { label: "Daily Goals Met", value: "95%", icon: <Check /> }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Enter your health data, goals, and preferences to get started."
    },
    {
      step: "2",
      title: "Get Recommendations",
      description: "Receive personalized habit suggestions based on your profile."
    },
    {
      step: "3",
      title: "Build Your Plan",
      description: "Add habits to your daily schedule and set timelines."
    },
    {
      step: "4",
      title: "Track & Improve",
      description: "Complete habits, build streaks, and watch your progress grow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Better Habits,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Your Life
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personal habit tracker with smart recommendations, timers, alerts, and analytics. 
            Stay consistent, build streaks, and achieve your health goals.
          </p>
          {token ? (
            <div onClick={()=>navigate('/habits')} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition flex items-center gap-2">
              Track your habits 
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          ):(
            <div onClick={()=>navigate('/auth')} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition flex items-center gap-2">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          )}
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center">
              <div className="flex justify-center mb-3 text-blue-600">
                {React.cloneElement(stat.icon, { className: "w-8 h-8" })}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to build and maintain healthy habits</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <div className={`${feature.color} text-white rounded-lg p-3 inline-block mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in four simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Habivance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Habivance is a smart habit-building platform designed to help you
              create routines, develop discipline, and track your progress – powered
              by real data and personalization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To make habit-building simple, effective, and enjoyable for everyone—
                from beginners to lifestyle enthusiasts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Why We Built It</h3>
              <p className="text-gray-600">
                Most people fail habits not because of lack of motivation, but because
                tools don’t adapt to their life. We’re changing that.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-orange-500 text-white w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">What We Believe</h3>
              <p className="text-gray-600">
                Small daily changes compound into life-changing results. Every streak,
                every minute, every habit counts.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are building better habits and achieving their goals with Habivance.
          </p>
          {token ? (
            <div onClick={()=>navigate('/habits')} className="flex sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition">
              Track your habits 
            </button>
          </div>
          ):(
            <div onClick={()=>navigate('/auth')} className="flex sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition">
              Start Your Journey
            </button>
          </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Habivance</span>
              </div>
              <p className="text-sm">Building better habits, one day at a time.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2024 Habivance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;