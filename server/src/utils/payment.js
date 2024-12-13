const moment = require("moment/moment");
const sortObject = require("./softObject");
const querystring = require("qs");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  payment(id, bankSelect, contentPayment, total) {
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const date = new Date();

    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = process.env.VNPAY_TMN_CODE;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = id;
    vnp_Params["vnp_OrderInfo"] = contentPayment;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = total * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankSelect !== null && bankSelect !== "") {
      vnp_Params["vnp_BankCode"] = bankSelect;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNPAY_SECURE_SECRET);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  },
};
