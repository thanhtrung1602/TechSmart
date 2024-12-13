const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../models/index");
dotenv.config();
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  if (!token) {
    return res.status(401).json({ error: "Access token not provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired access token" });
    }
    req.user = user;
    next();
  });
};

const jwtMiddlewareRole = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ error: "Access token not provided" });
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { userId } = user;

    const userRole = await db.User.findOne({
      where: { id: userId },
    });

    console.log("Decoded user:", user);
    console.log("Fetched role from DB:", userRole?.dataValues?.role);

    if (!userRole) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userRole.dataValues.role !== "admin") {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    req.role = userRole.dataValues.role;
    next();
  } catch (error) {
    console.error(error); // Đảm bảo biến error được sử dụng
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
};

module.exports = { jwtMiddleware, jwtMiddlewareRole };
