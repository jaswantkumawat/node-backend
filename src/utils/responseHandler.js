// utils/responseHandler.js
export const successResponse = (
  res,
  { statusCode = 200, message = "SUCCESS", data = null, meta = null },
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};
