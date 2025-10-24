import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import yaml from 'js-yaml';
import fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import swaggerUi from 'swagger-ui-express';
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
import { rootMutation, rootQuery} from "./src/graphqlTypes/index.js";

// Configurations
setupRelations();
await sequelize.sync({ force: false, alter: false });
const app = express();
const port = 3000;

// CORS
app.use(cors({
  origin: "*",
  methods: "*",
  allowedHeaders: '*',
}));

// Middleware
app.use(bodyParser.json());

// WebSocket
new MyChat(3001);

// Documentation
const swaggerFile = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerData = yaml.load(swaggerFile);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerData));

// Routes API REST
app.use("/api/auth", authRouter);
app.use("/api/user", auth, userRouter);
app.use("/api/article", auth, articleRouter);
app.use("/api/comment", auth, commentRouter);
app.use("/api/subscription", auth, subscriptionRouter);
app.use("/api/room", auth, RoomRouter);
app.use("/api/message", auth, MessageRouter);

// Routes GraphQL
const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}))

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// test