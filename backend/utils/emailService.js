// Purpose: Send email notifications

import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendReminderEmail = async (userEmail, habitName, scheduledTime) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Reminder: ${habitName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🔔 Habit Reminder</h2>
          <p>Hi there!</p>
          <p>This is a friendly reminder about your habit: <strong>${habitName}</strong></p>
          <p>Scheduled time: <strong>${scheduledTime}</strong></p>
          <p>Keep up the great work! 💪</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Habivance - Smart Habit Tracker</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

export const sendStreakEmail = async (userEmail, habitName, streak) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎉 ${streak} Day Streak on ${habitName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <h2>🎉 Congratulations!</h2>
          <p>You've maintained a <strong>${streak}-day streak</strong> on:</p>
          <h3>${habitName}</h3>
          <p>Keep the momentum going! You're doing amazing! 🚀</p>
          <hr style="border-color: rgba(255,255,255,0.3);">
          <p style="font-size: 12px;">Habivance - Smart Habit Tracker</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Streak email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending streak email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Habivance!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Habivance, ${userName}! 👋</h2>
          <p>We're excited to have you on board!</p>
          <p>Start building better habits today and track your progress effortlessly.</p>
          <h3>Getting Started:</h3>
          <ul>
            <li>Complete your profile with health information</li>
            <li>Get personalized habit recommendations</li>
            <li>Add habits to your daily plan</li>
            <li>Track your progress and build streaks</li>
          </ul>
          <p>Here's to a healthier, happier you! 💪</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Habivance - Smart Habit Tracker</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};