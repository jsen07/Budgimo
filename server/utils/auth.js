const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_PASSWORD
const expiration = "48h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
      console.log('Token received:', token);
    }

    if (!token) {
      console.log('No token provided');
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('User verified:', data);
    } catch (error) {
      console.log('Invalid token:', error);
    }

    return req;
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    // console.log("login payload", payload);
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};