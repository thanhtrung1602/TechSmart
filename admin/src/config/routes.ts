

const routes = {
    home: "/",

    //Product
    products: "/products",
    addProduct: "/product/addProduct",
    editProduct: "/product/editProduct/:id",

    //Attributes
    attributes: "/attributes",
    attributeValues: "/attributeValues",

    //Categories
    categories: "/categories",
    addCategories: "/category/addCategory",
    updateCategories: "/category/updateCategory/:id",

    //manufacture
    manufacturer: "/manufacturers",
    addManufacturers: "/manufacturer/addManufacturer",
    updateManufacture: "/manufacturer/updateManufacturer/:id",

    //Users    
    login: "/login",
    register: "/register",
    contact: "/contact",
    manufacturers: "/manufacturers",
    comments: "/comments",
    user: "/users",

    //Orders    
    order: "/orders",
    orderdetail: "/orderdetails/:id",

    //Delivery
    delivery: "/delivery",

    //Statistical
    statistical: "/statistical",

    //store
    store: "/store",
    addStore: "/store/add",
    updateStore: "/store/update/:id",

    //staff
    staff: "/staff",
    addStaff: "/staff/add",
    updateStaff: "/staff/update/:id"

}

export { routes }