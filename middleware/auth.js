// Importation du package jsonWebToken
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Utilisation de try car des erreurs possible
  try {
    const token = req.headers.authorization.split(" ")[1];            // Extraction du token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");    // Decodage du token
    const userId = decodedToken.userId;                               // Recuperation du user ID
    if (req.body.userId && req.body.userId !== userId) {              // Si ID différent obtient Erreur
      throw "Invalid user ID";
    } else {                                                          // Si correct envoie au prochain middleware
      next();
    }
    // Si une erreur possible attrape l'erreur
  } catch {
    res.status(401).json({ error: new Error("Invalid request!") });
  }
};
