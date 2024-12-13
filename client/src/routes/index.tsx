import config from "~/config";
import { AccountLayout, MainLayout } from "~/layouts";
import Account from "~/pages/Account";
import AddressUser from "~/pages/Account/AddressUser";
import Orders from "~/pages/Account/Orders";
import Blog from "~/pages/Blog";
import Cart from "~/pages/Cart";
import Contact from "~/pages/Contact";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import ForgotPass from "~/pages/ForgotPass";
import CheckOTP from "~/pages/CheckOTP";
import NewPass from "~/pages/NewPass";
import Payment from "~/pages/Payment";
import Product from "~/pages/Product";

import Register from "~/pages/Register";
import Category from "~/pages/Category";
import { Route } from "~/types/routeType";
import CheckOut from "~/pages/CheckOut";
import OrderComplete from "~/pages/OrderComplete";
import Brand from "~/pages/Brand";
import BlogDetail from "~/pages/Blog/BlogDetail";
import ChangePassword from "~/pages/Account/ChangePassword";
import OrderTracking from "~/components/OrderDetail";
import SearchResults from "~/pages/SearchResults";

const publicRoutes: Route[] = [
  { path: config.routes.login, component: Login, layout: MainLayout },
  { path: config.routes.forgotpass, component: ForgotPass, layout: MainLayout },
  { path: config.routes.checkotp, component: CheckOTP, layout: MainLayout },
  { path: config.routes.newpass, component: NewPass, layout: MainLayout },
  { path: config.routes.register, component: Register, layout: MainLayout },

  { path: config.routes.home, component: Home, layout: MainLayout },
  { path: config.routes.cate, component: Category, layout: MainLayout },
  { path: config.routes.brand, component: Brand, layout: MainLayout },
  { path: config.routes.contact, component: Contact, layout: MainLayout },
  { path: config.routes.blog, component: Blog, layout: MainLayout },
  { path: config.routes.blogDetail, component: BlogDetail, layout: MainLayout },
  { path: config.routes.searchresults, component: SearchResults, layout: MainLayout },

  { path: config.routes.product, component: Product, layout: MainLayout },
  { path: config.routes.payment, component: Payment, layout: MainLayout },
  { path: config.routes.cart, component: Cart, layout: MainLayout },
  { path: config.routes.checkout, component: CheckOut, layout: MainLayout },
  {
    path: config.routes.ordercomplete,
    component: OrderComplete,
    layout: MainLayout,
  },

  { path: config.routes.account, component: Account, layout: AccountLayout },
  {
    path: config.routes.addressuser,
    component: AddressUser,
    layout: AccountLayout,
  },
  {
    path: config.routes.changepassword,
    component: ChangePassword,
    layout: AccountLayout,
  },
  { path: config.routes.orders, component: Orders, layout: AccountLayout },
  {
    path: config.routes.orderDetails,
    component: OrderTracking,
    layout: AccountLayout,
  },
];

export { publicRoutes };
