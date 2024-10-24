import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import { sequelize } from "./src/data/index.js";
import { setupRelations } from "./src/models/Relation.js";
import { auth } from "./src/middlewares/auth.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import authRouter from "./src/router/AuthRouter.js";
import userRouter from "./src/router/UserRouter.js";
import articleRouter from "./src/router/ArticleRouter.js";
import commentRouter from "./src/router/CommentRouter.js";
import subscriptionRouter from "./src/router/SubscriptionRouter.js";
import RoomRouter from "./src/router/RoomRouter.js";
import MessageRouter from "./src/router/MessageRouter.js";
import { MyChat } from "./src/wss/MyChat.js";

// Configurations
setupRelations();
await sequelize.sync({ force: false });
const app = express();
const port = 3000;
const io = new MyChat(3001);

// CORS
app.use(cors());

// Socket.io
io.Init();

// Middleware
app.use(errorMiddleware);
app.use(bodyParser.json());

// Routes API
app.use("/api/auth", authRouter);
app.use("/api/user", auth, userRouter);
app.use("/api/article", auth, articleRouter);
app.use("/api/comment", auth, commentRouter);
app.use("/api/subscription", auth, subscriptionRouter);
app.use("/api/room", auth, RoomRouter);
app.use("/api/message", auth, MessageRouter);

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
