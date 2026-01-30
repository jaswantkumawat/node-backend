// middlewares/error.middleware.js
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert unknown errors to ApiError
  if (!(error instanceof ApiError)) {
    error = new ApiError(500, error.message || "Internal Server Error");
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors ?? null,
  });
};
