const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const userService = require('./../api/users/users.service');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const jwtInfos = jwt.verify(token, config.secretJwtToken);
    req.user = jwtInfos.user;

    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
