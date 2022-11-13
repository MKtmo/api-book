const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

// import book model
const Book = require("../models/book");

exports.createBook = (req, res, next) => {
  // Prepare the input data validation
  const ValidInput = new Validator(req.body, {
    titre: "required|length:100",
    auteur: "required|length:100",
    prix: "required",
    nombre_de_pages: "required",
    categorie: "required|length:100",
    stocked: "required",
    annee: "required",
  });

  // Check the input data from the frontend
  ValidInput.check()
    .then((matched) => {
      // If input is not safe, handle the error
      if (!matched) {
        res.status(400).send(ValidInput.errors);
      }
      // Else
      else {
        const newId = new mongoose.Types.ObjectId();
        // Format the book data for storage
        const book = new Book({
          ISBN: newId,
          titre: req.body.titre,
          auteur: req.body.auteur,
          nombre_de_pages: req.body.nombre_de_pages,
          prix: req.body.prix,
          categorie: req.body.categorie,
          stocked: req.body.stocked,
          annee: req.body.annee,
        });
        // Store the user data in the database
        book
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "New Book " + book.titre + " created !" })
          )
          // Catch mongoose error
          .catch(() =>
            res.status(500).json({ error: "Internal servor error" })
          );
      }
    })
    // Catch input validator error
    .catch(() => res.status(400).send(ValidInput.errors));
};

exports.getBook = (req, res, next) => {
  Book.findOne({ ISBN: req.body.ISBN }, function (err, book) {
    if (!err) {
      res.status(200).json(book);
    } else {
      res.status(400).message(err);
    }
  });
};

exports.getCategory = (req, res, next) => {
  Book.find({ categorie: req.body.categorie }, function (err, book) {
    if (!err) {
      res.status(200).json(book);
    } else {
      res.status(400).message(err);
    }
  });
};
exports.getAllBooks = (req, res, next) => {
  Book.find({}).then(function (books) {
    res.status(200).json(books);
  });
};

exports.modifyBook = (req, res, next) => {
  // Prepare the input data validation
  const ValidInput = new Validator(req.body, {
    titre: "required|length:100",
    auteur: "required|length:100",
    prix: "required",
    nombre_de_pages: "required",
    categorie: "required|length:100",
    stocked: "required",
    annee: "required",
  });
  // Check the input data from the frontend
  ValidInput.check().then((matched) => {
    // If input is not safe, handle the error
    if (!matched) {
      res.status(400).send(ValidInput.errors);
    }
    // Else
    else {
      // use findOneAndUpdate methode
      Book.findOneAndUpdate(
        req.params.ISBN,
        { $set: req.body },
        { new: true },
        function (err, book) {
          if (err) {
            return next(err);
          }
          Book.find({})
            .then(function (book) {
              res.send(book);
            })
            .catch(() =>
              res.status(500).json({ error: "Internal servor error" })
            )
            // Catch input validator error
            .catch(() => res.status(400).send(ValidInput.errors));
        }
      );
    }
  });
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ ISBN: req.body.ISBN }, function (err, book) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Book " + req.body.titre + " deleted !" });
    } else {
      console.log(req);
      res.status(400).message(err);
    }
  });
};
