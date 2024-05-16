const express = require("express");
const { check, body } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { signIn, signUp, renew } = require("../controllers/auth");
const { validateJWT } = require("../middlewares/validateJWT");
const Role = require("../models/Role");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name", "Name is required.").not().isEmpty(),
    check("email", "Email is required.").isEmail(),
    check(
      "password",
      "The password must have at least six characters"
    ).isLength({ min: 6 }),
    body("role")
      .not()
      .isEmpty()
      .withMessage("Role is required")
      .custom(async (value) => {
        const role = await Role.findById(value);
        if (!role) {
          throw new Error("Invalid role ID.");
        }
      }),
    validateFields,
  ],
  signUp
);

router.post(
  "/signin",
  [
    check("email", "Email is required.").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  signIn
);

router.get("/renew", validateJWT, renew);

module.exports = router;
