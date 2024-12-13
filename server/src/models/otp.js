module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define("OTP", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    return OTP;
  };
  