const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse } = require("../utils/responseHandler");
const { generateJWT } = require("../utils/jwt");

const signUp = async (req, res = response) => {
  const { email, password, name, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(res, false, 400, "The user is already registered.");
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();

    sendResponse(res, true, 201, "User successfully registered.", {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, false, 500, "Error registering the user.", {}, error);
  }
};

const signIn = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("role"); 

    if (!user) {
      return sendResponse(res, false, 400, "User does not exist.");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return sendResponse(res, false, 400, "Incorrect password.");
    }

    const token = await generateJWT(user._id, user.name, user.role.name);

    sendResponse(res, true, 201, "Login successfully.", {
      id: user.id,
      name: user.name,
      role: user.role.name,
      token,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, false, 500, "Error login the user.", {}, error);
  }
};

const renew = async (req, res = response) => {
  const { uid, name, role } = req;

  const token = await generateJWT(uid, name, role);

  sendResponse(res, true, 200, "Succesfully", { id: uid, name, role, token });
};

module.exports = {
  signIn,
  signUp,
  renew,
};
