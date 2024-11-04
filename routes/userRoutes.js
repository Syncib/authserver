const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {
  login,
  signup,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
router.post("/signup", signup);
router.post("/login", login);
router.put("/edit/:id", requireAuth, updateUser);
router.delete("/edit/:id", requireAuth, deleteUser);
module.exports = router;
