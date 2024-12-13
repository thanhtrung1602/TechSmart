const axios = require("axios");
module.exports = {
  async portOrder(userId, name, phone, address, quantity, price, product) {
    const post_url = process.env.GHN_URL;
    const accessToken = process.env.API_TOKEN_GHN;
    console.log("Post URL: ", post_url);
    console.log("Access Token: ", accessToken);

    const data = {
      payment_type_id: 1,
      note: "Tintest 123",
      required_note: "KHONGCHOXEMHANG",
      from_name: "techSmart",
      from_phone: "0987654321",
      from_address: "",
      from_ward_name: "",
      from_district_name: "",
      from_province_name: "HCM",
      return_phone: "0987654321",
      return_address: "",
      return_district_id: "",
      return_ward_code: "",
      client_order_code: `${userId}`,
      to_name: name,
      to_phone: `${phone}`,
      to_address: `${address.street}, ${address.ward}, ${address.district}, ${address.province}`,
      to_ward_name: `${address.ward}`,
      to_district_name: `${address.district}`,
      to_province_name: `${address.province}`,
      cod_amount: 50000000,
      content: "Theo New York Times",
      weight: 200,
      length: 1,
      width: 19,
      height: 10,
      pick_station_id: 1444,
      deliver_station_id: null,
      insurance_value: 5000000,
      service_id: 0,
      service_type_id: 2,
      coupon: null,
      pick_shift: [2],
      items: [
        {
          name: `${product.name}`,
          code: `${product.id}`,
          quantity: quantity,
          price: price,
          length: 12,
          width: 12,
          height: 12,
          image: `${product.img}`,
          weight: 1200,
        },
      ],
    };
    try {
      const response = await axios.post(`${post_url}/create`, data, {
        headers: {
          "Content-Type": "application/json",
          Token: `${accessToken}`,
        },
      });
      console.log("Response ghtk_______:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  },

  async getOrderGHN(id) {},
};
