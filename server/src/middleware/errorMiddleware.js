const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    message = `Invalid ${err.path}`;
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
    message = `${duplicateField} already exists`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
