const sendResponse = (
  res,
  success,
  statusCode,
  message,
  data = {},
  error = {}
) => {
  if (success) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      error: null
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message,
      data: null,
      error,
    });
  }
};

module.exports = { sendResponse };
