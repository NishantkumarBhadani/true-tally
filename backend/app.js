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
export {app};