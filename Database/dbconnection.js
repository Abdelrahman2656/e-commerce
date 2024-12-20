import mongoose from "mongoose";
export const dbconnection = () => {
    return mongoose.connect(process.env.DB_URL).then(() => {
        console.log(`db connected successfully ${process.env.DB_URL}`);
    }).catch((err) => {
        console.log('field to connect to db');
    })
}