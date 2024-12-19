import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createOrder, getAllOrders, myOrders } from "./order.controller.js";

const orderRouter=Router()
//create order
orderRouter.post('/order',isAuthentication(),
isAuthorized(Object.values(roles)),asyncHandler(createOrder))
//get my order
orderRouter.get('/my-order',isAuthentication(),asyncHandler(myOrders))
//get all user order
orderRouter.get('/all-orders',isAuthentication(),isAuthorized([roles.ADMIN]),asyncHandler(getAllOrders))
export default orderRouter
//QYrw5EJAZVF8-nP