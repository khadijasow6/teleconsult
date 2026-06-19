const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé : token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};
const authorizeRoles = (...allowedRoles) => {
return (req, res, next) => {
if (
!req.user ||
!allowedRoles.includes(req.user.role)
) {
return res.status(403).json({
success: false,
message:
"Accès refusé : vous n’avez pas l’autorisation nécessaire",
});
}


next();


};
};

module.exports = {
protect,
authorizeRoles,
};
