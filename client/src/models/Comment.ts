import Products from "./Products";

interface IComment {
  id: number;
  userId: number;
  productId: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  productData: Products;
  status: string;
  replies: Comments[];
  isAdmin: boolean;
  commentId: number;
  userData: {
    id: number;
    fullname: string;
    phone: string;
    bom: number;
    ban: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

class Comments implements IComment {
  id: number;
  userId: number;
  productId: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  productData: Products;
  status: string;
  replies: IComment[];
  isAdmin: boolean;
  commentId: number;
  userData: {
    id: number;
    fullname: string;
    phone: string;
    bom: number;
    ban: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };

  constructor(
    id: number,
    userId: number,
    productId: number,
    comment: string,
    createdAt: Date,
    updatedAt: Date,
    productData: Products,
    status: string,
    replies: IComment[],
    isAdmin: boolean,
    commentId: number,
    userData: {
      id: number;
      fullname: string;
      phone: string;
      bom: number;
      ban: boolean;
      role: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ) {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.productData = productData;
    this.status = status;
    this.replies = replies;
    this.userData = userData;
    this.isAdmin = isAdmin;
    this.commentId = commentId;
  }
}

export default Comments;
