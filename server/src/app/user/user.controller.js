const userService = require("./user.service");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { checkEmail, checkPhone } = require("../../validators");
const asyncWrapper = require("../../middleware/async");
const { saveUsersToElasticsearch } = require("../../helpers/handleElastic");
const { client } = require("../../db/init.elastic");
const socket = require("../../module/socket");
dotenv.config();
class UsersController {
  //Get all users

  getUser = asyncWrapper(async (req, res) => {
    const getUser = await userService.getUser();
    return res.status(200).json(getUser);
  });

  //Get one user

  async getMe(req, res) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token not provided" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userService.getOneUserById(decoded.userId);

    return res.status(200).json(user);
  }

  //Get one user by id

  getOneUserById = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const getOneUserById = await userService.getOneUserById(id);
    return res.status(200).json(getOneUserById);
  });

  //Update user

  updateUser = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const { phone, email, name, bom, ban } = req.body;
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }

    if (phone) {
      checkPhone(phone, res);
    }
    const updateUser = await userService.updateUser(req.body, id);

    console.log("ádasdassssdadsassaa", updateUser.dataValues);

    const io = socket.getIo();
    io.emit("updateUser", updateUser.dataValues);

    return res.status(200).json(updateUser);
  });

  //Update bom user

  updateBomUser = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const updateBomUser = await userService.updateBomUser(id);
    return res.status(200).json(updateBomUser);
  });

  //Update ban user

  BanUser = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const BanUser = await userService.BanUser(id);
    return res.status(200).json(BanUser);
  });
  //Delete user

  delUser = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(500).json({ error: "invalid id" });
    }
    const delUser = await userService.delUser(id);
    return res.status(200).json(delUser);
  });

  getTotalUsers = asyncWrapper(async (req, res) => {
    const getTotalUsers = await userService.getTotalUsers();
    return res.status(200).json(getTotalUsers);
  });

  searchUser = asyncWrapper(async (req, res) => {
    const { q } = req.query;
    const user = await client.search({
      index: "users",
      body: {
        query: {
          match: {
            phone: q,
          },
        },
      },
    });

    return res.status(200).json(user.body.hits.hits);
  });

  getAllUserRole = asyncWrapper(async (req, res) => {
    const { role } = req.params;
    const userRole = await userService.getAllUserRole(role);
    return res.status(200).json(userRole);
  });
}

module.exports = new UsersController();
