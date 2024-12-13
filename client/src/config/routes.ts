
const routes = {
  //Header
  home: "/",
  cate: "/:slug",
  brand: "/:slugCate/:slugManu",
  contact: "/contact",
  blog: "/blog",
  blogDetail: "/blog/:slug",
  searchresults: "/tim-kiem",

  //Product
  product: "/product/:slugCategory/:slugProduct",

  //Categories
  categories: "/categories",

  //Cart
  cart: "/cart",
  checkout: "/checkout",
  payment: "/payment",
  ordercomplete: "/ordercomplete",

  //Account
  account: "/account",
  addressuser: "/addressuser",
  orders: "/orders",
  orderDetails: "/orders/detail/:id",
  changepassword: "/changepassword",
  wishlist: "/wishlist",

  //Authentication
  login: "/login",
  forgotpass: "/forgotpass",
  checkotp: "/checkotp",
  newpass: "/newpass",
  register: "/register",
};

export { routes };
