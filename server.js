const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const usersController = require("./api/users/users.controller");
const articleRouter = require('./api/articles/articles.router');
const authMiddleware = require("./middlewares/auth");
require("./api/articles/articles.schema"); // temporaire
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});




app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.get("/api/users/:userid/articles", usersController.getArticles); // route avant le middleware d'auth pour la garder publique
app.use("/api/users", authMiddleware, userRouter);
app.post("/login", usersController.login);

app.use("/api/articles", authMiddleware, articleRouter);

app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

module.exports = {
  app,
  server,
};
