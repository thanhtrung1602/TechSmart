import { Route } from "~/types/routeType";
import config from "~/config";
import AdminLayout from "~/layouts/AdminLayout";
import Home from "~/pages/Home";
import Statistical from "~/pages/Statistical";
import Users from "~/pages/Users";
import Store from "~/pages/store";
import LoginLayout from "~/pages/Login";
import Login from "~/pages/Login";

import Delivery from "~/pages/Delivery";
import Orders from "~/pages/Orders";
import Ordersdetail from "~/pages/Orders/Ordersdetail";

import Products from "~/pages/Products";
import AddProduct from "~/pages/Products/AddProduct";
import EditProduct from "~/pages/Products/EditProduct";
import Categories from "~/pages/Categories";
import AddCategories from "~/pages/Categories/addCategories";
import UpdateCategories from "~/pages/Categories/updateCategories";
import Manufacturers from "~/pages/manufacturers";
import AddManufacturer from "~/pages/manufacturers/addManufacturer";
import UpdateManufacture from "~/pages/manufacturers/updateManufacturer";

import Contact from "~/pages/Contact";
import Comment from "~/pages/Comment/index";
import AddStore from "~/pages/store/addstore";
import UpdateStore from "~/pages/store/updatestore";
import Register from "~/pages/Register";
import Staff from "~/pages/staff";
import AddStaff from "~/pages/staff/addstaff";
import UpdateStaff from "~/pages/staff/updatestaff";

const loginRoutes: Route[] = [
  { path: config.routes.login, component: Login, layout: LoginLayout },
];

const privateRoutes: Route[] = [
  { path: config.routes.home, component: Home, layout: AdminLayout },
  {
    path: config.routes.categories,
    component: Categories,
    layout: AdminLayout,
  },
  { path: config.routes.products, component: Products, layout: AdminLayout },
  {
    path: config.routes.addProduct,
    component: AddProduct,
    layout: AdminLayout,
  },
  {
    path: config.routes.editProduct,
    component: EditProduct,
    layout: AdminLayout,
  },
  {
    path: config.routes.statistical,
    component: Statistical,
    layout: AdminLayout,
  },
  {
    path: config.routes.manufacturer,
    component: Manufacturers,
    layout: AdminLayout,
  },
  {
    path: config.routes.addManufacturers,
    component: AddManufacturer,
    layout: AdminLayout,
  },
  {
    path: config.routes.updateManufacture,
    component: UpdateManufacture,
    layout: AdminLayout,
  },
  {
    path: config.routes.addCategories,
    component: AddCategories,
    layout: AdminLayout,
  },
  {
    path: config.routes.updateCategories,
    component: UpdateCategories,
    layout: AdminLayout,
  },
  { path: config.routes.user, component: Users, layout: AdminLayout },

  { path: config.routes.order, component: Orders, layout: AdminLayout },
  {
    path: config.routes.orderdetail,
    component: Ordersdetail,
    layout: AdminLayout,
  },

  { path: config.routes.delivery, component: Delivery, layout: AdminLayout },
  { path: config.routes.store, component: Store, layout: AdminLayout },
  { path: config.routes.addStore, component: AddStore, layout: AdminLayout },
  {
    path: config.routes.updateStore,
    component: UpdateStore,
    layout: AdminLayout,
  },
  {
    path: config.routes.register,
    component: Register,
    layout: AdminLayout,
  },
  { path: config.routes.contact, component: Contact, layout: AdminLayout },
  { path: config.routes.comments, component: Comment, layout: AdminLayout },

  //staff
  { path: config.routes.staff, component: Staff, layout: AdminLayout },
  { path: config.routes.addStaff, component: AddStaff, layout: AdminLayout },
  { path: config.routes.updateStaff, component: UpdateStaff, layout: AdminLayout },

];

export { privateRoutes, loginRoutes };
