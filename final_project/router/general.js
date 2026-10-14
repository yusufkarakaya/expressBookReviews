const express = require('express')
const axios = require('axios')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  //Write your code here
  const { username, password } = req.body
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: 'Username already exists' })
  }
  users.push({ username, password })
  return res.status(200).json({ message: 'User registered successfully' })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (books[isbn]) {
    return res.status(200).json(books[isbn])
  } else {
    return res.status(404).json({ message: 'Book not found' })
  }
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author
  const bookdetails = Object.values(books).filter(
    (book) => book.author === author,
  )
  if (bookdetails.length > 0) {
    return res.status(200).json(bookdetails)
  } else {
    return res.status(404).json({ message: 'Books by this author not found' })
  }
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title
  const bookdetails = Object.values(books).filter(
    (book) => book.title === title,
  )
  if (bookdetails.length > 0) {
    return res.status(200).json(bookdetails)
  } else {
    return res.status(404).json({ message: 'Books with this title not found' })
  }
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews)
  } else {
    return res.status(404).json({ message: 'Book not found' })
  }
})

// Tasks 10-13: same functionality as Tasks 1-4 using async-await with Axios
const BASE_URL = 'http://localhost:4000'

// Task 10: Get the book list available in the shop
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`)
    return res.status(200).json(response.data)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' })
  }
})

// Task 11: Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(
      `${BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`,
    )
    return res.status(200).json(response.data)
  } catch (error) {
    const status = error.response ? error.response.status : 500
    return res.status(status).json({ message: 'Book not found' })
  }
})

// Task 12: Get book details based on author
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(req.params.author)}`,
    )
    return res.status(200).json(response.data)
  } catch (error) {
    const status = error.response ? error.response.status : 500
    return res.status(status).json({ message: 'Books by this author not found' })
  }
})

// Task 13: Get book details based on title
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(req.params.title)}`,
    )
    return res.status(200).json(response.data)
  } catch (error) {
    const status = error.response ? error.response.status : 500
    return res.status(status).json({ message: 'Books with this title not found' })
  }
})

module.exports.general = public_users
