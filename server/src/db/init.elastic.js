const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({
  nodes: process.env.ELASTICSEARCH_ENDPOINT,
  auth: {
    username: process.env.USERNAME_ELASTIC,
    password: process.env.PASSWORD_ELASTIC,
  },
});

async function testConnection() {
  try {
    const response = await client.ping();
    console.log("Elasticsearch connection is successful:", response);
  } catch (error) {
    console.error("Elasticsearch connection failed:", error);
  }
}

testConnection();

module.exports = { client };
