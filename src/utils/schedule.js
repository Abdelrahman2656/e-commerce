import schedule from "node-schedule";
import { User } from "../../Database/index.js";
import { statues } from "./constant/enums.js";
export const deletePendingUser = () => {
  let jobs = schedule.scheduleJob("1 1 1 * * *", async () => {
    // get users
    let users = await User.find({
      status: statues.PENDING,
      createdAt: { $lte: Date.now() - 1 * 30 * 24 * 60 * 60 * 1000 },
    }).lean(); //[{}],[]
    // map user id
    let userIds = users.map((user) => {
      return user._id;
    });
    
    //delete user
    if (userIds.length > 0) {
      await User.deleteMany({ _id: { $in: userIds } });
    }
  });
  return jobs;
};
