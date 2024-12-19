import { User } from "../../../Database/index.js"
import { messages } from "../../utils/constant/messages.js"

//add to wishlist
export const addWishList = async(req,res,next)=>{
    //get data from req
    let{productId}=req.params
    let userId=req.authUser._id
    //update user
    const userUpdated = await User.findByIdAndUpdate(userId,{$addToSet:{wishlist:productId}},{new:true})
    //send response
    return res.status(201).json({message:messages.wishlist.updateSuccessfully,success:true,
        data:userUpdated.wishlist
    })
}
export const getWishlist = async (req, res, next) => {
    let userId =req.authUser._id
    const user = await User.findById(userId, { wishlist: 1 }, { populate: [{ path: "wishlist" }] })
    return res.status(200).json({ data: user })
}

export const deleteFromWishlist = async (req, res, next) => {
    // get data from req
    const { productId } = req.params
    const wishlist = await User.findByIdAndUpdate(req.authUser._id, { $pull: { wishlist: productId } }, { new: true }).select('wishlist')
    return res.status(200).json({ message: 'product remove successfully', data: wishlist })
}