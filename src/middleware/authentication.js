import { User } from "../../Database/model/user.model.js"
import { AppError } from "../utils/appError.js"
import { statues } from "../utils/constant/enums.js"
import { messages } from "../utils/constant/messages.js"
import { verifyToken } from "../utils/token.js"

export const isAuthentication = ()=>{
    return async(req ,res , next)=>{
        // get token 
        let {token } = req.headers
        if(!token){
            return next(new AppError('token required' , 401))
        }
        // decode token 
        const payload = verifyToken({token})
        if(payload.message){
            return next (new AppError(payload.message , 401))
        }
        //check user 
        let authUser = await User.findOne({_id:payload._id , status : statues.VERIFIED})
        if (!authUser){
            return next (new AppError(messages.user.notFound, 404))
        }
        req.authUser = authUser
        next()
    }
}