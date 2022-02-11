// Importation des modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// Importation des routes
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

// Connexion à Atlas MongoDB
mongoose.connect("mongodb+srv://Shockwave:darlik@cluster0.pqzxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Autorise les requêtes 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

// Fonction middleware de gestion de fichier
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
