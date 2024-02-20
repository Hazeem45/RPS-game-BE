const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const {authorization} = req.headers;

  try {
    if (authorization === undefined) {
      res.statusCode = 401;
      return res.json({message: "unauthorized, token not provided"});
    } else {
      const splitedToken = authorization.split(" ")[1];
      const token = jwt.verify(splitedToken, process.env.SECRET_KEY);
      req.token = token;
    }
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.statusCode = 401;
      return res.json({
        name: error.name,
        message: error.message,
      });
    } else if (error.name === "TokenExpiredError") {
      res.statusCode = 401;
      return res.json({
        name: error.name,
        message: error.message,
      });
    }
    return res.status(500).send({error});
  }
};

module.exports = authorization;
