import jwt from 'jsonwebtoken'
export const generateToken = ({payload , secretKey = process.env.SECRET_KEY})=>{
    return jwt.sign(payload ,secretKey)
}
export const verifyToken = ({token, secretKey = process.env.SECRET_KEY})=>{
    try {
        return jwt.verify(token,secretKey)
    } catch (error) {
        // console.log(error);
        return {message : error.message}
        
    }
}