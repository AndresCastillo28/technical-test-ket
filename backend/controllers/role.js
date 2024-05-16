const { response } = require("express");
const Role = require("../models/Role");
const { sendResponse } = require("../utils/responseHandler");


const findAllRoles = async(req, res = response) => {
    try {
      const roles = await Role.find();
      sendResponse(res, true, 200, "Successfully fetched roles", roles);
    } catch (error) {
      console.error(error);
      sendResponse(res, false, 500, "Server error", {}, error);
    }
  }
  

module.exports = {
  findAllRoles
};
