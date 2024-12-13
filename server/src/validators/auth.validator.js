const Joi = require("joi");

const registerVal = async (req, res, next) => {
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(new RegExp(/^\d{10}$/))
      .required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/))
      .trim()
      .min(6)
      .max(10),
    role: Joi.string().valid("admin", "user"),
  });

  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    console.log({ message: "validator successfully!" });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const loginVal = async (req, res, next) => {
  const userSchema = Joi.object({
    contact: Joi.alternatives()
      .try(
        Joi.string().email().required(),
        Joi.string()
          .pattern(new RegExp(/^\d{10}$/))
          .required()
      )
      .required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/))
      .trim()
      .min(6)
      .max(10),
  });

  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    console.log({ message: "validator successfully!" });
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: new Error(error).message,
    });
  }
};

const changePassVal = async (req, res, next) => {
  const userSchema = Joi.object({
    phone: Joi.string()
      .pattern(new RegExp(/^\d{10}$/))
      .required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/))
      .trim()
      .min(6)
      .max(10),
  });
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    console.log({ message: "validator successfully!" });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

module.exports = {
  registerVal,
  loginVal,
  changePassVal,
};
