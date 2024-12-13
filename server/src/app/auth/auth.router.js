const express = require("express");
const router = express.Router();
const AuthController = require("./auth.controller");
const { jwtMiddleware } = require("../../middleware");
const {
  loginVal,
  registerVal,
  changePassVal,
} = require("../../validators/auth.validator");

router.post("/register", registerVal, AuthController.register);
router.post("/registerEmployee", AuthController.registerEmployee);
router.post("/login", loginVal, AuthController.login);
router.post(
  "/changePass",
  jwtMiddleware,
  changePassVal,
  AuthController.changePass
);
router.get("/getAccessToken", AuthController.getAccessToken);
router.post("/logout", jwtMiddleware, AuthController.logout);
router.get("/verify", AuthController.verifyCation);

// API gửi OTP qua email
router.post("/forgot-password", AuthController.forgotPassword);

// API thay đổi mật khẩu
router.post("/verifyotp", AuthController.verifyOtp);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
