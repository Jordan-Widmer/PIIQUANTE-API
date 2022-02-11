const express = require("express");
const router = express.Router();

// Importation du parametre
const userCtrl = require("../controllers/user");

// Chemin de routes 
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
