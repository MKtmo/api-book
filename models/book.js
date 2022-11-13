// Import mongoose
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Set the book data model
const bookSchema = mongoose.Schema({
  ISBN: { type: mongoose.Types.ObjectId, autoIncrement: true },
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  prix: { type: Number, required: true },
  nombre_de_pages: { type: Number, required: true },
  categorie: { type: String, required: true },
  stocked: { type: Number, required: true },
  annee: { type: Number, required: true },
});

bookSchema.plugin(uniqueValidator);

// Export the model

module.exports = mongoose.model("Book", bookSchema);
