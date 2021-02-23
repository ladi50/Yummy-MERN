const jwt = require("jsonwebtoken");

const jwtToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = await req.get("authorization").split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const accessToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.userId = accessToken.userId;
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  next();
};

module.exports = jwtToken;
