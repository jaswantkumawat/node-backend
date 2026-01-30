// validate.middleware.js
import { validationResult } from "express-validator";
import { ApiError } from "../../utils/ApiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const fieldErrors = {};
    errors.array().forEach((err) => {
      fieldErrors[err.path] = err.msg;
    });

    throw new ApiError(422, "Validation failed", fieldErrors);
  }

  next();
};
