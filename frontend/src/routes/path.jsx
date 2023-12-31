const adminURL = "/admin";

const path = {
    home: "/",
    logIn: "/dang-nhap",
    register: "/dang-ky",
    aboutUs: "/gioi-thieu",
    cart: "/gio-hang",
    userProfile: "/thong-tin-tai-khoan",
    admin: adminURL,
    booksManagement: `${adminURL}/books`,
    usersManagement: `${adminURL}/users`,
    ordersManagemennt: `${adminURL}/orders`,
    changePhone: "/doi-so-dien-thoai",
    changePassword: "/doi-mat-khau",
    bookDetails: "/thong-tin-sach",
    purchase: "/thanh-toan",
    search: "/tim-kiem",
    orderHistory: "/lich-su-dat-hang"
}

export default path;