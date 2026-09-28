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
import aiRouter from "./routes/aiRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });
app.set('trust proxy', true);

const allowedOrigins = [
    process.env.PORTFOLIO_URL,
    process.env.DASHBOARD_URL,
    "https://kirat-portfolio.vercel.app",
    "https://admin-kirat-portfolio.vercel.app",
];
const localhostOriginPattern = /^http:\/\/localhost:\d+$/;

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (no Origin header) and any localhost
            // port, so a dev server that lands on a different port than usual
            // (e.g. 5173 already taken) doesn't silently get CORS-blocked.
            if (!origin || allowedOrigins.includes(origin) || localhostOriginPattern.test(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
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
app.use("/api/v1/ai", aiRouter);

app.get("/", (req, res) => {
  res.json({ message: "Backend is up and running" });
});


dbConnection();
app.use(errorMiddleware);

export default app;
