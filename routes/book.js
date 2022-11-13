const express = require("express");

// Import the book methods
const bookCtr = require("../controllers/book");

const router = express.Router();

// Create a book
router.post("/createBook", bookCtr.createBook);

// Fetch all Books
router.get("/getAllBooks", bookCtr.getAllBooks);

// Fetch one book
router.get("/getBook/", bookCtr.getBook);

// Fetch category
router.get("/getCategory/", bookCtr.getCategory);

// Modify a book
router.put("/updateBook", bookCtr.modifyBook);

// Delete a book
router.delete("/deleteBook", bookCtr.deleteBook);

module.exports = router;
