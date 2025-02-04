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


// Get all users
async function getUsernames(req, res) {
  const usernames = await db.getAllUsernames();
  res.render("index", {
      title: "Create user",
      users: usernames
    });
}

// Render create page
async function createUsernameGet(req, res) {
  res.render("createUser", {
      title: "Create user",
      user: []
    });
}

// Create a user
async function createUsernamePost(req, res) {
  const { firstName, lastName, email } = req.body;
  await db.insertUsername(firstName, lastName, email);
  res.redirect("/");
}

// Delete a user
async function deleteUsernameFromDatabase(req, res) {
  await db.deleteUsername(req.params.id);
  res.redirect("/");
}

// Get a user
async function getUsernameFromDatabase(req, res) {
  const username = await db.getUsername(req.params.id);

  if (!username || username.length === 0) {
    return res.status(404).send("User not found");
  }

  const user = username[0]
  res.render("createUser", {
    title: "Edit user",
    user
  });
}

// Update a user
async function updateUsernamePost(req, res) {
  const { firstName, lastName, email } = req.body;
  await db.updateUsername(req.params.id, { firstName, lastName, email });
  res.redirect("/");
}

// Update a user
async function usersSearchGet(req, res) {
  const users = await db.searchUser(req.query.searchName);
  console.log(users)
  res.render("search", {
      title: "Search for a user",
      users: users,
    });
}


// exports.usersSearchGet = [
//   searchQueryValidation,
//   asyncHandler((req, res) => {
//     const user = usersStorage.searchUser(req.query.searchName);
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).render("search", {
//         title: "Search for a user",
//         errors: errors.array(),
//         user: user
//       });
//     }

//     res.render("search", {
//       title: "Search for a user",
//       user: user,
//     });
//   })
// ];


module.exports = {
  getUsernames,
  createUsernameGet,
  createUsernamePost,
  deleteUsernameFromDatabase,
  getUsernameFromDatabase,
  updateUsernamePost,
  usersSearchGet
};

