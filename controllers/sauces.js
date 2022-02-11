const Sauce = require("../models/sauce");
const fs = require("fs");

// Création d'un objet
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Sauce({...thingObject, imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`});
  thing.save()
    .then(() => res.status(201).json({ message: "Objet enregistré avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

// On inclus l'id dans la base de données
exports.getOneThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

// Modifier un objet
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,}
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Suppression d'un objet
exports.deleteThing = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Envoie dans la base de données
exports.getAllStuff = (req, res, next) => {
  Sauce.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Système de like
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {case 0: Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id },
              {$inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id,})
              .then(() => {
                res.status(201).json({ message: "Avis pris en compte!" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id,})
              .then(() => {
                res.status(201).json({ message: "Avis pris en compte!" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
      break;
      
    // Like Update
    case 1: Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id,})
        .then(() => {
          res.status(201).json({ message: "Like pris en compte!" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;

    // Dislike Update
    case -1: Sauce.updateOne({ _id: req.params.id }, {$inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId },_id: req.params.id,})
        .then(() => {
          res.status(201).json({ message: "Dislike pris en compte!" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;
    default: console.error("Mauvaise requête");
  }
};
