# 🎯 Habivance - Smart Habit Tracker

<div align="center">

**A comprehensive MERN stack backend for personalized habit tracking with smart recommendations, timers, alerts, and detailed analytics.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

</div>

---

## 🌟 About

**Habivance** is a smart habit tracking application that provides personalized health and fitness recommendations based on user profile data including age, height, weight, BMI, and health conditions. The system intelligently suggests habits tailored to individual needs and helps users build consistent routines through timers, streak tracking, and comprehensive analytics.

### Why Habivance?

- 🧠 **Smart Recommendations**: AI-powered habit suggestions based on your health profile
- ⏱️ **Built-in Timers**: Track actual time spent on each habit
- 🔔 **Smart Alerts**: Never miss a habit with customizable reminders
- 📊 **Detailed Analytics**: Visualize your progress with daily, weekly, and monthly stats
- 🏆 **Streak Tracking**: Stay motivated with consecutive completion tracking
- 📱 **RESTful API**: Easy integration with any frontend framework

## ✨ Key Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication
- Password encryption with bcrypt
- User profile with health metrics (age, height, weight, BMI)
- Health issue and goal tracking

### 🎯 Smart Habit System
- **Pre-defined Habit Database**: 15+ professionally curated habits
- **Smart Recommendations**: Personalized suggestions based on BMI, age, health conditions, and goals
- **Habit Categories**: Exercise, Diet, Health, Study, Mindfulness, Sleep, Hydration
- **Difficulty Levels**: Easy, Medium, Hard

### 📅 Daily Planning & Tracking
- Add habits to daily schedule with specific times
- View habits by day or date range
- Start/stop/pause timers for habits
- Track actual time spent vs planned time

### 📊 Analytics & Insights
- Daily, weekly, and monthly statistics
- Streak tracking (current and longest)
- Completion rates and time spent per habit
- Category-wise breakdown
- Historical progress data

### 🔔 Notification System
- Scheduled reminders before habit start time
- Streak milestone congratulations
- Email notifications (optional)

### 🧮 Health Calculations
- Automatic BMI calculation
- BMI category classification (Underweight, Normal, Overweight, Obese)
- Health risk assessment
- Personalized health insights

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: Bcrypt.js
- **Validation**: Express Validator
- **Email Service**: Nodemailer
- **Module System**: ES6 Modules (import/export)

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/habivance-backend.git
cd habivance

# frontend
cd frontend
npm install
npm run dev

# backend
cd backend
npm install
npm run dev

# ml
cd ml
python -m venv venv
venv/scripts/activate
python src/train.py
python app.py

# Create .env file (see Configuration section)
cd .env.example .env

# Start development server
npm run dev
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/habivance

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

> ⚠️ **Important**: Change `JWT_SECRET` to a strong, random string in production!

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGO_URI` | MongoDB connection string | **Yes** | - |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** | - |
| `JWT_EXPIRE` | JWT token expiration time | No | 30d |
| `EMAIL_USER` | Email account username | No | - |
| `EMAIL_PASSWORD` | Email account password | No | - |

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 💡 How It Works

### Smart Recommendation Engine

The system analyzes your profile and matches you with suitable habits:

**Example User Profile:**
- Age: 45
- BMI: 28.5 (Overweight)
- Health Issues: ["diabetes", "high blood pressure"]
- Goals: ["weight loss", "better health"]

**Recommended Habits:**
1. **Low sugar diet** - High match score (diabetes + overweight)
2. **30-minute cardio workout** - Weight loss + BMI range match
3. **Walk 2km** - General health + heart health
4. **Deep breathing exercises** - Helps with high blood pressure

Each recommendation includes a match score indicating relevance to your profile.

### Streak Tracking

- **Current Streak**: Consecutive days from today backwards
- **Longest Streak**: Best performance ever achieved
- **Completion Rate**: Percentage of completed habits over time

### Analytics Dashboard

Track your progress with:
- **Daily Stats**: Today's completion rate and time spent
- **Weekly Overview**: 7-day progress visualization
- **Monthly Report**: Category breakdown and achievements

## 🎮 Usage Flow

1. **Register** → Create account with email/password
2. **Update Profile** → Add age, height, weight, health issues, goals
3. **Get Recommendations** → Receive personalized habit suggestions
4. **Add to Daily Plan** → Select habits and set schedule times
5. **Track Progress** → Start timers, mark complete/skip
6. **View Analytics** → Monitor streaks, completion rates, insights


## 📊 Database Collections

### User
Stores user authentication, profile data, health metrics, and calculated BMI

### Habit
Pre-defined habits with categories, criteria, benefits, and difficulty levels

### DailyHabit
User's daily habit instances with status, timers, and streaks

### Notification
When completed or adding any habit.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with authentication middleware
- Input validation on all endpoints
- Error handling for secure error messages

## 🐛 Error Handling

The API uses centralized error handling:
- Consistent error response format
- Appropriate HTTP status codes
- MongoDB error handling (validation, duplicates, cast errors)
- Development vs production error details

## 🌐 Deployment

### Render

1. Connect your GitHub repository
2. Add environment variables 
3. Deploy automatically 

## 📝 License

ISC License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Built with Express.js and MongoDB
- JWT authentication
- RESTful API design principles
- MVC architecture pattern

## 📧 Contact

For questions or support, send an email: chaitanyaemani6@gmail.com

---

<div align="center">

**Built with ❤️ for healthy habit tracking**

⭐ Star this repo if you find it helpful!

</div>
