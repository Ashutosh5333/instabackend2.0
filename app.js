const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

 /** All routes  */
const user = require("./routes/user.route");
const insta = require("./routes/insta.route")
const comment = require("./routes/comment.route")
const chats = require("./routes/chat.route")

app.use("/user", user);
app.use("/insta",insta)
app.use("/insta",comment)
app.use("/chat",chats)



module.exports = app;
