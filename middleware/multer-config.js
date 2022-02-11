// Importation du module multer
const multer = require("multer");

// Va gerer les fichier de ces type
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de multer
// Enregistrement 
const storage = multer.diskStorage({ 
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  // Utilisation du nom d'origine 
  // Remplace les espace par underscore
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    
    // Timestamp
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
