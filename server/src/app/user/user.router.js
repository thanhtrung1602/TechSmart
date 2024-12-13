const express = require("express");
const router = express.Router();
const UsersController = require("./user.controller");
const { jwtMiddleware, jwtMiddlewareRole } = require("../../middleware");

router.get("/getAllUser", jwtMiddlewareRole, UsersController.getUser);
router.get(
  "/getAllUserRole/:role",
  jwtMiddlewareRole,
  UsersController.getAllUserRole
);
router.get("/searchUser", jwtMiddlewareRole, UsersController.searchUser);
router.get("/getMe", jwtMiddleware, UsersController.getMe);
router.get("/getTotalUsers", jwtMiddlewareRole, UsersController.getTotalUsers);
router.get("/getOneUserById/:id", UsersController.getOneUserById);
router.patch("/updateUser/:id", jwtMiddleware, UsersController.updateUser);
router.patch(
  "/updateBomUser/:id",
  jwtMiddlewareRole,
  UsersController.updateBomUser
);
router.patch("/BanUser/:id", jwtMiddlewareRole, UsersController.BanUser);
router.delete("/delUser/:id", jwtMiddlewareRole, UsersController.delUser);

module.exports = router;
