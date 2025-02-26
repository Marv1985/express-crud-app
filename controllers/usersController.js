const asyncHandler = require('express-async-handler')
const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");

// Validation
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

// POST Validation (check body)
const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 15 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 15 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim().isEmail()
    .withMessage('A valid email is required')
];

// GET Validation (check query parameters)
const searchQueryValidation = [
  query('searchName')
    .trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 15 }).withMessage(`First name ${lengthErr}`),
];

// Get all users
const getUsernames = asyncHandler( async (req, res) => {
  const usernames = await db.getAllUsernames();
  res.render("index", {
      title: "List of all users",
      users: usernames
    });
});

// Render create page
const createUsernameGet = asyncHandler( async (req, res) => {
  res.render("createUser", {
      title: "Create a user",
      user: []
    });
});

// Create a user
const createUsernamePost = [
  validateUser,
  asyncHandler( async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        errors: errors.array(),
        title: "Create a user",
        user: []
      });
    }
    const { firstName, lastName, email } = req.body;
    await db.insertUsername(firstName, lastName, email);
    res.redirect("/");
  })
]

// Delete a user
const deleteUsernameFromDatabase = asyncHandler( async (req, res) => {
  await db.deleteUsername(req.params.id);
  res.redirect("/");
});

// Get a user
const getUsernameFromDatabase = asyncHandler( async (req, res) => {
  const username = await db.getUsername(req.params.id);
  if (!username || username.length === 0) {
    return res.status(400).send("User not found");
  }
  const user = username[0]
  res.render("updateUser", {
    title: "Update user",
    user
  });
});

// Update a user
const updateUsernamePost = [
  validateUser,
  asyncHandler( async (req, res) => {
     // Check for validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
        errors: errors.array(),
        title: "Update user",
        user: []
       });
     }
    const { firstName, lastName, email } = req.body;
    await db.updateUsername(req.params.id, firstName, lastName, email);
    res.redirect("/");
  })
]

// Update a user
const usersSearchGet = [
  searchQueryValidation,
  asyncHandler(async (req, res) => {
    const users = await db.searchUser(req.query.searchName);
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("search", {
        title: "Search for a user",
        errors: errors.array(),
        users: [],
        notFound: ''
      });
    }

    if (users.length === 0) { // Prefer `users.length === 0` instead of `users == ''`
      return res.render("search", {
        users: [],
        title: "Search for a user",
        notFound: 'User not found'
      });
    }
    
    return res.render("search", {
      users: users,
      title: "Search for a user",
      notFound: ''
    });
  })
];



module.exports = {
  getUsernames,
  createUsernameGet,
  createUsernamePost,
  deleteUsernameFromDatabase,
  getUsernameFromDatabase,
  updateUsernamePost,
  usersSearchGet
};

