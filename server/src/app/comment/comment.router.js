const express = require("express");
const router = express.Router();
const commentsController = require("./comment.controller");
const { jwtMiddleware } = require("../../middleware");

router.get("/getAllComment", commentsController.getAllComment);
router.get("/getComment", commentsController.getComment);

router.get(
  "/getOneCommentByProductId/:id",
  commentsController.getOneCommentByProductId
);
router.get("/findOne/:id", commentsController.findOne);
router.post("/createComment", jwtMiddleware, commentsController.createComment);
router.delete(
  "/deleteComment/:id",
  jwtMiddleware,
  commentsController.deleteComment
);
router.patch(
  "/updateComment/:id",
  jwtMiddleware,
  commentsController.updateComment
);


module.exports = router;
