const {validationResult} = require("express-validator");

module.exports = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.statusCode = 400;
    return res.send({errors: result.errors});
  } else {
    next();
  }
};
