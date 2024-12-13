// const express = require("express");
// const app = express();
// const path = require("path");

// // Cấu hình thư mục tĩnh
// app.use("/static", express.static(path.join(__dirname, "assets")));

const otpEmailTemplate = (userName, otp) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #eb3e32; padding: 10px; text-align: center;">
      <h1 style="color: white; font-size: 30px; margin: 0;">TechSmart</h1>
    </div>
    <div style="padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #eb3e32; font-size: 18px; margin: 0 0 20px;">XÁC THỰC OTP</h2>
      <p style="text-align: center; color: #333;">Bạn đang thực hiện xin cấp lại mật khẩu đăng nhập cửa hàng công nghệ của chúng tôi.</p>
      <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #fef9e7; border: 1px solid #ffe58f; border-radius: 5px; display: inline-block; margin:0 auto">
        <strong style="color: #f39c12; font-size: 24px;">OTP - ${otp}</strong>
      </div>
      <p style="color: #888; font-size: 14px; text-align: center;">
        <strong style="color: red;">(*)</strong> Lưu ý: Mã OTP chỉ có giá trị trong vòng 5 phút.
      </p>
    </div>
  </div>
`;

module.exports = otpEmailTemplate;
