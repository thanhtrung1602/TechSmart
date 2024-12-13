const AuthService = require("./auth.service");
const jwt = require("jsonwebtoken");
const { checkEmail, checkPass, checkPhone } = require("../../validators");
const asyncWrapper = require("../../middleware/async");
const { saveUsersToElasticsearch } = require("../../helpers/handleElastic");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const otpEmailTemplate = require("./otpEmailTemplate");

class AuthController {
  login = asyncWrapper(async (req, res) => {
    const { contact, password } = req.body;
    if (!contact || !password) {
      return res.status(400).json({
        error: "số điện thoại, email hoặc mật khẩu không được để trống",
      });
    }

    const login = await AuthService.login(req.body);

    if (login.errors) {
      return res.status(login.status).json({ errors: login.errors });
    }

    await saveUsersToElasticsearch(login.users);

    const { accessToken, ...users } = login;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(login);
  });

  register = asyncWrapper(async (req, res) => {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({
        error: "Họ và tên, mật khẩu, số điện thoại không được để trống",
      });
    }

    const splitEmail = email.split("@");
    const fullName = splitEmail[0];

    const register = await AuthService.register(req.body, fullName);

    if (register.errors) {
      return res.status(register.status).json({ errors: register.errors });
    }

    return res.status(200).json(register);
  });

  getAccessToken = (req, res) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json("not found token!");
    }

    return res.status(200).json(accessToken);
  };

  logout = asyncWrapper(async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token not provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.clearCookie("accessToken", { httpOnly: true, secure: true });

    const logout = await AuthService.logout(decoded);
    return res.status(200).json(logout);
  });

  changePass = asyncWrapper(async (req, res) => {
    const change = await AuthService.changePass(req.body);
    if (change.error) {
      return res.status(400).json({ error: change.error });
    } else {
      return res.status(200).json({ message: change.message });
    }
  });

  registerEmployee = asyncWrapper(async (req, res) => {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({
        error: "Họ và tên, mật khẩu, số điện thoại không được để trống",
      });
    }

    const splitEmail = email.split("@");
    const fullName = splitEmail[0];

    const employee = await AuthService.registerEmployee(req.body, fullName);

    if (employee.errors) {
      return res.status(employee.status).json({ errors: employee.errors });
    }

    return res.status(200).json(employee);
  });

  verifyCation = asyncWrapper(async (req, res) => {
    const { token } = req.query;

    console.log("Received token:", token);

    if (!token) {
      return res.status(400).json({ message: "Token không được cung cấp!" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const verify = await AuthService.verifyCation(decoded.id);

    if (verify.success === true) {
      return res.redirect(`${process.env.URL_CLIENT}/login`);
    } else {
      console.error(verify.message);
    }
  });

  forgotPassword = asyncWrapper(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email không được để trống" });
    }

    const user = await AuthService.getUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy người dùng với email này" });
    }

    // Tạo mã OTP ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999); // Mã OTP 6 chữ số
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    // Lưu OTP và thời hạn vào cơ sở dữ liệu
    await AuthService.updateUserOtp(user.id, { otp, otpExpiration });

    // Gửi email chứa OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Mã OTP xác nhận",
      html: otpEmailTemplate(user.fullname, otp),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Gửi email thất bại" });
      }

      return res
        .status(200)
        .json({ message: "OTP đã được gửi đến email của bạn" });
    });
  });

  verifyOtp = asyncWrapper(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: "Email và OTP không được để trống" });
    }

    const user = await AuthService.getUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy người dùng với email này" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Mã OTP không chính xác" });
    }

    if (new Date() > new Date(user.otp_expiration)) {
      return res.status(400).json({ error: "Mã OTP đã hết hạn" });
    }

    // Xác nhận OTP thành công, có thể xóa OTP sau khi xác nhận
    await AuthService.updateUserOtp(user.id, {
      otp: null,
      otpExpiration: null,
    });

    await AuthService.clearOtp(user.id); // Xóa OTP sau khi xác nhận
    return res
      .status(200)
      .json({ message: "Mã OTP đã được xác nhận thành công" });
  });

  resetPassword = asyncWrapper(async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Thiếu thông tin yêu cầu" });
    }

    // Kiểm tra trạng thái OTP đã được xác nhận
    const isOTPVerified = await AuthService.checkOTPStatus(email);

    if (!isOTPVerified) {
      return res.status(400).json({ error: "OTP chưa được xác nhận" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const updatedUser = await AuthService.changePassword(
        email,
        hashedPassword
      );

      if (!updatedUser) {
        return res.status(400).json({ error: "Không tìm thấy người dùng" });
      }

      return res
        .status(200)
        .json({ message: "Mật khẩu đã được thay đổi thành công" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Lỗi trong quá trình thay đổi mật khẩu" });
    }
  });
}

module.exports = new AuthController();
