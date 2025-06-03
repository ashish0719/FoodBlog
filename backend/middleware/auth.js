const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" ")[1]; // Remove "Bearer"
    jwt.verify(token, process.env.SECERET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next(); // ✅ Call next here, inside the success block
      }
    });
  } else {
    return res.status(401).json({ message: "Token missing" });
  }
};

module.exports = verifyToken;
