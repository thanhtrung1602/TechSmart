const { client } = require("../db/init.elastic");

async function saveProductsToElasticsearch(product) {
  const { id, name, slug, img, price } = product;
  console.log("holy fuck: ", product);
  await client.index({
    index: "products",
    id: id.toString(),
    body: {
      name,
      slug,
      price,
      img,
    },
  });
}

async function saveUsersToElasticsearch(users) {
  const { id, phone } = users;

  await client.index({
    index: "users",
    id: id.toString(),
    body: {
      phone,
    },
  });
}

async function saveOrdersToElasticsearch(order) {
  const { id, order_code } = order.dataValues;

  await client.index({
    index: "orders",
    id: id.toString(),
    body: {
      order_code,
    },
  });
}

async function deleteProductFromElasticsearch(productId) {
  try {
    await client.delete({
      index: "products",
      id: productId.toString(),
    });
    console.log(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting product:", error.meta.body);
  }
}

async function deleteUserFromElasticsearch(userId) {
  try {
    await client.delete({
      index: "users",
      id: userId.toString(),
    });
  } catch (error) {
    console.error("Error deleting user:", error.meta.body);
  }
}

async function deleteOrderFromElasticsearch(orderId) {
  try {
    await client.delete({
      index: "orders",
      id: orderId.toString(),
    });
  } catch (error) {
    console.error("Error deleting user:", error.meta.body);
  }
}

module.exports = {
  saveProductsToElasticsearch,
  saveUsersToElasticsearch,
  saveOrdersToElasticsearch,
  deleteProductFromElasticsearch,
  deleteUserFromElasticsearch,
  deleteOrderFromElasticsearch,
};
