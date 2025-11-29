import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Analytics from './pages/Analytics'
import Navbar from './components/Navbar'
const App = () => {
  return (
    <div className='text-lg text-green-800 font-medium'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/auth' element={<Auth/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/habits' element={<Habits/>} />
        <Route path='/analytics' element={<Analytics/>} />
      </Routes>
    </div>
  )
}

export default App