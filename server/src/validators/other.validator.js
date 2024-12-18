const Joi = require("joi");
const postCategoryVal = async (req, res, next) => {
  const categorySchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    img: Joi.any().required(),
    slug: Joi.string().min(5).max(200).required(),
  })
    .unknown(true)
    .options({ abortEarly: false });
  try {
    await categorySchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const brandVal = async (req, res, next) => {
  const brandSchema = Joi.object({
    categoryId: Joi.number().min(1).required(),
    name: Joi.string().min(3).max(100).required(),
  })
    .unknown(true)
    .options({ abortEarly: false });

  try {
    await brandSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const orderVal = async (req, res, next) => {
  const orderSchema = Joi.object({
    userId: Joi.number().min(1).required(),
    total: Joi.number().min(1).required(),
    phone: Joi.string()
      .pattern(new RegExp(/^\d{10}$/))
      .required(),
    statusId: Joi.number().min(1).required(),
    paymentMethodId: Joi.number().min(1).required(),
    bankSelect: Joi.string(),
  })
    .unknown(true)
    .options({ abortEarly: false });

  try {
    await orderSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const attributeVal = async (req, res, next) => {
  const attributeSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
  })
    .unknown(true)
    .options({ abortEarly: false });
  try {
    await attributeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const valueAttributeVal = async (req, res, next) => {
  const valueAttributeSchema = Joi.object({
    attributeId: Joi.number().min(1).required(),
    productSlug: Joi.string().min(5).max(100).trim().required(),
    value: Joi.string().min(5).max(100).required(),
  })
    .unknown(true)
    .options({ abortEarly: false });

  try {
    await valueAttributeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

const productVal = async (req, res, next) => {
  const productSchema = Joi.object({
    categoryId: Joi.number().min(1).required(),
    manufacturerId: Joi.number().min(1).required(),
    name: Joi.string().min(5).max(200).required(),
    price: Joi.number().min(1).required(),
    stock: Joi.number().min(1).required(),
    discount: Joi.number().min(1).required(),
    visible: Joi.boolean(),
  })
    .unknown(true)
    .options({ abortEarly: false });

  try {
    await productSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      errors: new Error(error).message,
    });
  }
};

module.exports = {
  postCategoryVal,
  brandVal,
  orderVal,
  attributeVal,
  valueAttributeVal,
  productVal,
};
