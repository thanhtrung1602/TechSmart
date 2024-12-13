const validator = require("validator");
const checkPass = (password, res) => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Mật khẩu phải có ít nhất 6 ký tự và tối đa 10 ký tự, bao gồm ít nhất một ký tự chữ và một ký tự số",
    });
  }
};

const checkEmail = (email, res) => {
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email không hợp lệ" });
  }
};

const checkPhone = (phone, res) => {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: "số điện thoại phải có 10 số",
    });
  }
};

module.exports = {
  checkEmail,
  checkPass,
  checkPhone,
};
