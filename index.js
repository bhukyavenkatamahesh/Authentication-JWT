const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const routes = require("./routes/route");
const PORT = 3000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/route", routes);

app.get("/", (req, res) => {
  res.send("Hello");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/JWT")
  .then((e) => console.log("MongoDB Connected"));

app.listen(PORT, (e) => console.log(`Server running at ${PORT}`));
