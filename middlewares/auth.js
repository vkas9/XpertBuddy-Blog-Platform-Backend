const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = async (req, res, next) => {
    try {
      const token = req.cookies?.usr;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Session Expired",
        });
      }
      try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decodedToken;
        next();
      } catch (error) {
        console.log(error);
        if (error.name == "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Session Expired",
          });
        } else {
          return res.status(501).json({
            success: false,
            message: "Invalid Token",
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while verifing auth/jwt",
        error: error,
      });
    }
  };