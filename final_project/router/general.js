const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});


// TASK 11: Get the book list available in the shop using async/await and Promises
public_users.get('/', async (req, res) => {
  try {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// TASK 11: Get book details based on ISBN using async/await and Promises
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    const book = await getBookByIsbn;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});
  
// TASK 11: Get book details based on author using async/await and Promises
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        for (let key in books) {
            if (books[key].author === author) {
                booksByAuthor.push(books[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("Author not found");
        }
    });
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// TASK 11: Get all books based on title using async/await and Promises
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let booksByTitle = [];
        for (let key in books) {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        }
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("Title not found");
        }
    });
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
