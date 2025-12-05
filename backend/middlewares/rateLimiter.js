import rateLimit from "express-rate-limit";

// Global limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests. Try again later."
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                    // 5 registrations per hour
  message: "Too many accounts created. Try again later."
});

export const habitLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 5, // max 5 actions in 5 seconds
  message: "Too many habit actions. Please slow down."
});


// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many login attempts."
});

// ML API limiter
export const mlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many ML predictions."
});

// Rate limit specifically for timer actions
export const timerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Allow 20 timer actions per minute
  message: {
    success: false,
    message: "Too many timer requests. Please wait a moment."
  }
});

// Rate limiter: GET profile
export const getProfileLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // allow up to 30 profile fetches per minute
  message: {
    success: false,
    message: "Too many requests. Please slow down."
  }
});

// Rate limiter: UPDATE profile
export const updateProfileLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // prevent spam updates
  message: {
    success: false,
    message: "Too many update attempts. Please try again later."
  }
});

// Rate limiter: DELETE profile
export const deleteProfileLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // extremely sensitive
  message: {
    success: false,
    message: "Too many delete attempts. Try again after an hour."
  }
});


// Fetch all notifications
export const getNotificationsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many notification requests. Please wait a moment."
});

// Fetch unread count
export const unreadCountLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many unread count requests. Slow down."
});

// Mark all read
export const markAllReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many attempts to mark all read. Try later."
});

// Mark single read
export const markAsReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  message: "Too many attempts to mark notifications. Try later."
});

// Delete all read
export const deleteAllReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  message: "Too many delete-all actions. Try after some time."
});

// Delete one notification
export const deleteNotificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many delete attempts. Try later."
});