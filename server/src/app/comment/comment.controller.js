const asyncWrapper = require("../../middleware/async");
const CommentService = require("./comment.service");
const socket = require("../../module/socket");
class CommentsController {
  getAllComment = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const limit = size;
    const offSet = (page - 1) * size;
    const commentData = await CommentService.getAllComment(limit, offSet);
    if (!commentData) {
      return res.status(400).json({ message: "Khong tim thay san pham" });
    }

    return res.status(200).json(commentData);

  });


  getOneCommentByProductId = asyncWrapper(async (req, res) => {
    const productId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
  
    const limit = size;
    const offset = (page - 1) * size;
    
    const commentData = await CommentService.getOneCommentByProductId(productId, limit, offset);
  
    if (!commentData.comments) {
      return res.status(400).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
    }
  
    return res.status(200).json(commentData);
  });
  

  createComment = asyncWrapper(async (req, res) => {
    const { userId, comment } = req.body;
    if (!userId || !comment) {
      return res.status(400).json("invalid value");
    }
    const Comment = await CommentService.createComment(req.body);

    const io = socket.getIo();
    io.emit("newComment", Comment);

    return res.status(200).json(Comment);
  });

  updateComment = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const { comment, userId } = req.body;

    console.log(id, req.body);

    if (!comment || !userId) {
      return res.status(400).json("invalid value");
    }

    const commentUpdate = await CommentService.updateComment(id, req.body);
    return res.status(200).json(commentUpdate);
  });

  deleteComment = asyncWrapper(async (req, res) => {
    const id = parseInt(req.params.id);
    const comment = await CommentService.deleteComment(id);
    return res.status(200).json(comment);
  });

  findOne = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
  
    const limit = size;
    const offset = (page - 1) * size;
    const commentData = await CommentService.findOne(id, limit, offset);
    if (!commentData.comments) {
      return res.status(400).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
    }
    return res.status(200).json(commentData);
  });
  getCommentsByProduct = asyncWrapper(async (req, res) => {
    const productId = req.params.productId;
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const comment = await CommentService.getCommentsByProduct(productId);
    return res.status(200).json(comment);
  });
  getComment = asyncWrapper(async (req, res) => {
    const comment = await CommentService.getComment();
    return res.status(200).json(comment);
  });
}

module.exports = new CommentsController();