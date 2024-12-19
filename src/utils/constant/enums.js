export const discountTypes = {
    FIXED_AMOUNT : 'fixedAmount',
    PERCENTAGE : 'percentage'
}
Object.freeze(discountTypes)
export const roles ={
    USER : 'user',
    ADMIN:'admin',
    SELLER : 'seller'
}
Object.freeze(roles)
export const statues = {
    PENDING:'pending',
    VERIFIED:'verified',
    BLOCKED :'block',
    DELETED:"deleted"
}
Object.freeze(statues)
export const paymentStatus={
    VISA:'visa',
    CASH:'cash'
}
Object.freeze(paymentStatus)
export const orderStatus ={
    PLACED: "placed",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELED: "canceled",
    REFUNDED: "refunded"
}
Object.freeze(orderStatus)