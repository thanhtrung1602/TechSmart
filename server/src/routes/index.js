const authRouter = require("../app/auth/auth.router");
const cartRouter = require("../app/cart/cart.router");
const usersRouter = require("../app/user/user.router");
const orderRouter = require("../app/order/order.router");
const commentRouter = require("../app/comment/comment.router");
const productsRouter = require("../app/product/product.router");
const attributeRouter = require("../app/attribute/attribute.router");
const categoriesRouter = require("../app/category/category.router");
const orderdetailRouter = require("../app/orderDetail/orderdetail.router");
const productImgsRouter = require("../app/productImg/productimg.router");
const manufacturerRouter = require("../app/manufacturer/manufacturer.router");
const valueAttributeRouter = require("../app/attributeValue/valueattribute.router");
const contactRouter = require("../app/contact/contact.router");
const addressRouter = require("../app/address/address.router");
const storeRouter = require("../app/store/store.router");
const stockRouter = require("../app/stock/stock.router");
const paymentMethodRouter = require("../app/paymentMethod/paymentMethod.router");
const statusOrderRouter = require("../app/statusOrder/statusOrder.router");
const statusPaymentRouter = require("../app/statusPayment/statusPayment.router");
const categoryAttributeRouter = require("../app/categoryAttribute/categoryAttribute.router");
const staffRouter = require("../app/staff/staff.router");

function route(app) {
  app.use("/auth", authRouter);
  app.use("/cart", cartRouter);
  app.use("/contact", contactRouter);
  app.use("/users", usersRouter);
  app.use("/orders", orderRouter);
  app.use("/address", addressRouter);
  app.use("/comments", commentRouter);
  app.use("/products", productsRouter);
  app.use("/attribute", attributeRouter);
  app.use("/categories", categoriesRouter);
  app.use("/productimgs", productImgsRouter);
  app.use("/orderdetails", orderdetailRouter);
  app.use("/manufacturer", manufacturerRouter);
  app.use("/valueAttribute", valueAttributeRouter);
  app.use("/address", addressRouter);
  app.use("/contact", contactRouter);
  app.use("/store", storeRouter);
  app.use("/stock", stockRouter);
  app.use("/paymentMethod", paymentMethodRouter);
  app.use("/status", statusOrderRouter);
  app.use("/statusPayment", statusPaymentRouter);
  app.use("/categoryAttribute", categoryAttributeRouter);
  app.use("/staff", staffRouter);
}
module.exports = route;
