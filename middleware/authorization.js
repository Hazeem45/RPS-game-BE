const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const {authorization} = req.headers;

  try {
    if (authorization === undefined) {
      res.statusCode = 401;
      return res.json({message: "unauthorized, token not provided"});
    } else {
      const token = jwt.verify(authorization, process.env.SECRET_KEY);
      req.token = token;
    }
    next();
  } catch (error) {
    return res.status(500).send({message: `${error}`});
  }
};

module.exports = authorization;
