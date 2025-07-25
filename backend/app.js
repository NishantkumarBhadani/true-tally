import express from "express";
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io";

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:process.env.CLIENT_URL,
        methods :["GET","POST"],
        credentials:true,
    }
})

app.use(cors({
    origin:"*",
    credentials:true,
}))

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

//user route
// import userRouter from "./routes/user.routes.js";
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter);

app.post("/test", (req, res) => {
    res.json(req.body);
});
export {app};