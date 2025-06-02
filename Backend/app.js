import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/connection.js";
import { errorMiddleware } from './middlewares/error.js';
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";
import timelineRouter from "./routes/timelineRouter.js";
import softwareApplicationRouter from "./routes/softwareApplicationRouter.js";
import skillRouter from "./routes/skillRouter.js";
import projectRouter from "./routes/projectRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });
app.set('trust proxy', true);

app.use(
    cors({
        origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL, "http://localhost:5173/", "http://localhost:5174/"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);


app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

dbConnection();
app.use(errorMiddleware);

export default app;
