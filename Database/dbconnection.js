import mongoose from "mongoose";
export const dbconnection = () => {
    return mongoose.connect("mongodb+srv://abdelrahman:eIL88lAvbWXO2eK9@cluster0.ozsvg.mongodb.net/e-commerce").then(() => {
        console.log(`db connected successfully `);
    }).catch((err) => {
        console.log('field to connect to db');
    })
}