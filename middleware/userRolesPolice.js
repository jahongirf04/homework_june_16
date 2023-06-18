const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (Uemail) {
  return (req, res, next) => {
    if (req.method == "OPTIONS") {
      next();
    }
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).json({
          message: "User not registered",
        });
      }

      console.log(authorization);
      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res.status(403).json({
          message: "User not registered (token berilmagan)",
        });
      }

      const { name, email } = jwt.verify(token, config.get("secret"));
      let isEmail = false;
      if (Uemail == email) {
        isEmail = true;
      }

      if (isEmail) {
        next();
      } else {
        return res.status(403).json({
          message: "Email noto'g'ri",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "Server error",
      });
    }
  };
};
