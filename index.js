process.on('unhandledRejection',(err)=>{
    console.log('error',err);
    
})
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { dbconnection } from "./Database/dbconnection.js";
import { initApp } from "./src/initApp.js";
import { deletePendingUser } from "./src/utils/schedule.js";
const app = express();
const port =3000;
console.log(port);

dotenv.config({ path: path.resolve("./config/.env") });
// console.log(process.env.DB_URL);
app.use(cors('*'))
dbconnection();

//cron job
deletePendingUser()

initApp(app, express);
process.on('unhandledRejection',(err)=>{
    console.log('error',err);
    
})
app.get("/", (req, res) => res.send("Hello World! gg"));

//6Lf9RrAqAAAAAJ8FNI8DVqvNHYw_UbS0lXmPLgL9