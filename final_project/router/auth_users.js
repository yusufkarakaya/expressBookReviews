const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password,
  )
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here

  if (!authenticatedUser(req.body.username, req.body.password)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const accessToken = jwt.sign({ data: req.body.username }, 'access', {
    expiresIn: 60 * 60,
  })
  req.session.authorization = { accessToken, username: req.body.username }
  return res.status(200).json({ message: 'User logged in successfully' })
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.query.review || (req.body && req.body.review)
  const username = req.session.authorization.username

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }
  if (!review) {
    return res.status(400).json({ message: 'Review is required' })
  }

  books[isbn].reviews[username] = review
  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been added/updated`,
    reviews: books[isbn].reviews,
  })
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found for this user' })
  }

  delete books[isbn].reviews[username]
  return res.status(200).json({
    message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted`,
    reviews: books[isbn].reviews,
  })
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
