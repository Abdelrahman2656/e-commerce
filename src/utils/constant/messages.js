const generateMessage = (entity) => ({
  alreadyExist: `${entity} Already Exist `,
  notFound: `${entity} Not Found`,
  failToCreate: `Fail To Create ${entity}`,
  failToUpdate: `Fail To Update ${entity}`,
  failToDelete: `Fail To Delete ${entity}`,
  createdSuccessfully: `${entity} Created Successfully`,
  updateSuccessfully: `${entity} Updated Successfully`,
  deleteSuccessfully: `${entity} Deleted Successfully`,
  notAllowed: `${entity} Not Authorized To Access This Api`,
  verifiedSuccessfully: `${entity} Verified Successfully`,
});
export const messages = {
  category: generateMessage("Category"),
  subcategory: generateMessage("SubCategory"),
  brand: generateMessage("Brand"),
  product: { ...generateMessage("Product"), outStock: "Out Of Stock",lessThan: "Must Be Less Than 100" },
  user: {
    ...generateMessage("User"),
    verified: "User Verified Successfully",
    notAuthorized: "not authorized to access this api",
    invalidCredential: "Something Wrong In Password",
    changePassword: "Password Changed Successfully",
    AlreadyHasOtp: "You Already Has OTP",
    checkEmail:"Check Your email",
    invalidOTP:"Invalid OTP"
  },
  review: generateMessage("Review"),
  coupon: { ...generateMessage("Coupon"), lessThan: "Must Be Less Than 100" ,InValid:"Coupon InValid"},
  wishlist: generateMessage("WishList"),
  cart: {
    ...generateMessage("Cart"),
    outStock: "Out Of Stock",
    deleteAllSuccessfully: "All Cart Are Deleted Successfully",
    empty:"Cart Is Empty"
  },
  order:{...generateMessage('Order')}
};
