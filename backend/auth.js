const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secret");

const auth = (req, res, next) => {
  const token = req.headers.token;

  const { id } = jwt.verify(token, JWT_SECRET);

  if (id) {
    req.userId = id;
    next();
  } else {
    res.status(404).json({
      message: "You are not logged in",
    });
  }
};

module.exports = {
  auth,
};
