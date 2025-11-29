// Purpose: Global error handler
// Function: errorHandler(err, req, res, next)
// Logic: Catch all errors, format response, return appropriate status codes

// middlewares/errorMiddleware.js
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    errors: err.errors || null,
  });
};
