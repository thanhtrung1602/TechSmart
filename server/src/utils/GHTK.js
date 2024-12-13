const axios = require("axios");
const AddressService = require("../app/address/address.service");
const userService = require("../app/user/user.service");
const orderService = require("../app/order/order.service");
module.exports = {
  async portOrderGHTK(orderDetails, userId, orderId, addressId) {
    const post_url = process.env.GHTK_URL;
    const accessToken = process.env.API_TOKEN_GHTK;

    const allProductData = orderDetails.map((detail) => detail.productData);

    const username = await userService.getOneUserById(userId);
    const address = await AddressService.getAddressById(addressId);

    const products = allProductData.map((item, ind) => {
      const detail = orderDetails[ind];
      return {
        name: item.name,
        weight: 0.1,
        quantity: detail.quantity,
        product_code: `${item.id}`,
        price: detail.total,
      };
    });

    const data = {
      products,
      order: {
        id: `${orderId}`,
        pick_name: "Nguyễn Thành Trung",
        pick_address: "Tòa nhà QTSC9 (toà T), đường Tô Ký ",
        pick_province: "TP. Hồ Chí Minh",
        pick_district: "Quận 12",
        pick_ward: "phường Tân Chánh Hiệp",
        pick_tel: "0822930906",
        tel: `${address.phone}`,
        name: `${username.fullname}`,
        address: `${address.street},`,
        province: `${address.province.name}`,
        district: `${address.district.name}`,
        ward: `${address.ward}`,
        hamlet: "Khác",
        is_freeship: "1",
        pick_date: new Date().toISOString().slice(0, 10),
        pick_money: 0,
        note: "Khối lượng tính cước tối đa: 1.00 kg",
        value: 3000000,
        transport: "fly",
        pick_option: "cod",
      },
    };

    try {
      const response = await axios.post(`${post_url}/order`, data, {
        headers: {
          "Content-Type": "application/json",
          Token: `${accessToken}`,
        },
      });
      console.log("Response post ghtk_______:", response, response.data.order);
      const orderId = response.data.order.partner_id;
      const tracking_order = response.data.order.tracking_id;
      await orderService.updateOrder(orderId, { tracking_order });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  },

  async getOrderGHTK(id) {
    const post_url = process.env.GHTK_URL;
    const accessToken = process.env.API_TOKEN_GHTK;
    try {
      const response = await axios.get(`${post_url}/v2/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Token: `${accessToken}`,
        },
      });
      console.log("Response get ghtk_______:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  },

  async cancelOrderGHTK(id) {
    const post_url = process.env.GHTK_URL;
    const accessToken = process.env.API_TOKEN_GHTK;
    try {
      const response = await axios.post(
        `${post_url}/cancel/${id}`,
        {},
        {
          headers: {
            "X-Client-Source": id,
            "Content-Type": "application/json",
            Token: `${accessToken}`,
          },
        }
      );
      console.log("Huy ghtk_______:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  },

  async getPackageGHTK(id) {
    const post_url = process.env.URL_PACKAGE_GHTK;
    const accessToken = process.env.TOKEN_PACKAGE_GHTK;
    try {
      const response = await axios.get(`${post_url}=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Response get package ghtk_______:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  },
};
