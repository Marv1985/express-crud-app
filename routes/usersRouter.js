// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.getUsernames);
usersRouter.get("/create", usersController.createUsernameGet);
usersRouter.post("/create", usersController.createUsernamePost);
usersRouter.get("/:id/update", usersController.getUsernameFromDatabase);
usersRouter.get("/search", (req, res) => res.render("search", {title: "Search for a user", user: []}));
usersRouter.get("/searchUsers", usersController.usersSearchGet);
usersRouter.post("/:id/update", usersController.updateUsernamePost);
usersRouter.post("/:id/delete", usersController.deleteUsernameFromDatabase);


module.exports = usersRouter;
