const { response } = require("express");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../utils/responseHandler");

const validateFields = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      false,
      400,
      "Validation errors",
      {},
      errors.mapped()
    );
  }
  next();
};
module.exports = {
  validateFields,
};
