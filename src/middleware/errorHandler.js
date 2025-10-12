export default (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : "Internal Server Error";

  res.status(statusCode).json({
    code: statusCode,
    message,
  });
};
