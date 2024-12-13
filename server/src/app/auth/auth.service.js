const db = require("../../models/index");
const dotenv = require("dotenv");
dotenv.config();
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const ejs = require("ejs");
const path = require("path");
const { transporter } = require("../../utils/nodemailer");
class AuthService {
  //Login

  async login(body) {
    try {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [{ phone: body.contact }, { email: body.contact }],
        },
      });

      if (!user) {
        return {
          status: 400,
          errors: { contact: "Không tìm thấy số điện thoại hoặc email" },
        };
      }

      const verify = await compare(body.password, user.password);
      if (!verify) {
        return { status: 400, errors: { password: "Mật khẩu không đúng" } };
      }

      const { password, ...users } = user.dataValues;

      const payload = {
        userId: user.id,
        role: user.role,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      return { accessToken, users };
    } catch (error) {
      return { status: 500, errors: "Đã xảy ra lỗi, vui lòng thử lại sau" };
    }
  }

  //Register

  async register({ email, password, phone, role }, fullName) {
    try {
      const saltRounds = 10;
      const hashPassword = await hash(password, saltRounds);
      const user = await db.User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (user) {
        const errors = {};
        if (user.email === email) {
          errors.email = "Email đã tồn tại";
        }
        if (user.phone === phone) {
          errors.phone = "Số điện thoại đã tồn tại";
        }
        return { status: 400, errors };
      }

      // Tạo user nếu không bị trùng lặp
      const register = await db.User.create({
        fullname: fullName,
        email,
        phone,
        password: hashPassword,
        role,
      });

      await this.sendVerifyEmail(register);
      return register;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendVerifyEmail(user) {
    try {
      const token = jwt.sign(
        { id: user.dataValues.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const verificationUrl = `${process.env.URL_BACKEND}/auth/verify?token=${token}`;

      const emailHTML = await ejs.renderFile(
        path.resolve(__dirname, "../../view/registerTemplate.ejs"),
        {
          fullname: user.dataValues.fullname,
          verificationUrl: verificationUrl,
        }
      );

      const mailOptions = {
        to: `${user.dataValues.email}`,
        subject: "Xác nhận Email",
        html: emailHTML,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  //Logout

  async logout(id) {
    try {
      const userId = id.userId;

      const logout = await db.RefreshToken.destroy({
        where: {
          userId: userId,
        },
      });

      if (logout) {
        return { message: "Logout successful" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Token refresh

  async refresh(refreshToken) {
    try {
      if (!refreshToken) {
        return { error: "Refresh token is required" };
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!decoded) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      console.log("đây là của token", decoded);

      const tokenRecord = await db.RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!tokenRecord) {
        return res.status(404).json({ error: "Refresh token not found" });
      }

      const expiresIn = tokenRecord.dataValues.expiresIn;
      if (new Date(expiresIn) <= new Date()) {
        return res.status(401).json({ error: "Refresh token has expired" });
      }

      console.log("teabshgdjasdghjasgdhjhgs: ", tokenRecord);

      const newPayload = {
        userId: tokenRecord.dataValues.userId,
        role: tokenRecord.dataValues.role,
      };
      const newAccessToken = jwt.sign(
        newPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: expiresIn,
        }
      );

      return newAccessToken;
    } catch (error) {
      console.error("Error during token refresh:", error);
      return { error: "Internal server error" };
    }
  }

  //Change Password

  async changePass({ phone, oldPassword, newPassword }) {
    const saltRounds = 10;
    const hashNewPassword = await hash(newPassword, saltRounds);
    try {
      const checkUser = await db.User.findOne({
        where: { phone: phone },
      });

      if (!checkUser) {
        return {
          error:
            "Không tìm thấy người dùng với số điện thoại này. Vui lòng nhập số điện thoại khác",
        };
      }

      const passwordMatch = await compare(oldPassword, checkUser.password); // So sánh mật khẩu cũ

      if (!passwordMatch) {
        return { error: "Mật khẩu cũ không đúng" };
      }

      const changePass = await db.User.update(
        { password: hashNewPassword },
        { where: { phone } }
      );

      if (changePass) {
        return { message: "Đổi mật khẩu thành công" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //Register Employee

  async registerEmployee({ fullname, password, phone }) {
    try {
      const saltRounds = 10;
      const hashPassword = await hash(password, saltRounds);
      const existingUser = await db.User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (existingUser) {
        const errors = {};
        if (existingUser.email === email) {
          errors.email = "Email đã tồn tại";
        }
        if (existingUser.phone === phone) {
          errors.phone = "Số điện thoại đã tồn tại";
        }
        return { status: 400, errors };
      }

      const employee = await db.User.create({
        fullname,
        email,
        phone,
        password: hashPassword,
        role: "admin",
      });

      await this.sendVerifyEmail(employee);

      return employee;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyCation(id) {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        return { success: false, message: "Người dùng không tồn tại." };
      }

      user.isVerified = true;
      const isVerify = await user.save();
      if (isVerify.isVerified) {
        return { success: true, message: "Xác nhận thành công!" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Đã xảy ra lỗi khi xác nhận email." };
    }
  }

  async getUserByEmail(email) {
    try {
      // Tìm kiếm người dùng trong cơ sở dữ liệu theo email
      const user = await db.User.findOne({
        where: {
          email: email, // Điều kiện tìm kiếm theo email
        },
      });

      // Nếu không tìm thấy người dùng, trả về null hoặc thông báo lỗi
      if (!user) {
        return null;
      }

      // Trả về thông tin người dùng dưới dạng JSON
      return user.toJSON();
    } catch (error) {
      // Ném lỗi nếu có vấn đề xảy ra khi truy vấn cơ sở dữ liệu
      throw new Error(error.message);
    }
  }

  async updateUserOtp(userId, otpData) {
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update(otpData);
    return user;
  }

  async clearOtp(userId) {
    return db.User.update(
      { otp: 0, otp_expiration: null },
      { where: { id: userId } }
    );
  }

  async verifyOTP(email, otp) {
    try {
      const otpRecord = await db.OTP.findOne({
        where: { email, otp },
      });

      if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return false; // OTP không hợp lệ hoặc hết hạn
      }

      return true; // OTP hợp lệ
    } catch (error) {
      console.error("Error details:", error.message);
      throw new Error("Đã xảy ra lỗi khi kiểm tra OTP");
    }
  }

  // Lưu trạng thái OTP đã xác nhận
  async saveOTPStatus(email) {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      user.isOTPVerified = true; // Cập nhật trạng thái OTP đã xác nhận
      await user.save();
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái OTP:", error);
      throw new Error("Không thể lưu trạng thái OTP");
    }
  }

  async checkOTPStatus(email) {
    try {
      const user = await db.User.findOne({ where: { email } });

      if (!user || !user.otp) {
        return false; // OTP chưa xác nhận
      }

      return true; // OTP đã xác nhận
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái OTP:", error);
      throw new Error("Không thể kiểm tra trạng thái OTP");
    }
  }

  // Thay đổi mật khẩu
  async changePassword(email, newPassword) {
    try {
      // Tìm người dùng theo email
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        return { status: 404, error: "User not found" };
      }

      // Cập nhật mật khẩu mới (cần mã hóa mật khẩu nếu cần thiết)
      user.password = newPassword; // Mã hóa mật khẩu nếu cần
      await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

      // Trả về kết quả thành công
      return { status: 200, message: "Mật khẩu đã được thay đổi thành công" };
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      return { status: 500, error: "Đã xảy ra lỗi, vui lòng thử lại sau" };
    }
  }
}

module.exports = new AuthService();
