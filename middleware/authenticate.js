const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const user = mongoose.model("user");

const authenticate = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (token) {
    const decoded = jwt.verify(token, "hush");
    if (decoded) {
      const userId = decoded.userId;
      req.body.userId = userId;
      //  console.log(decoded)
      console.log(userId);

      next();
    } else {
      res.send({ msg: "you are not authenticated login please" });
    }
  } else {
    res.send({ msg: "you are not authenticated" });
  }
};

module.exports = { authenticate };
