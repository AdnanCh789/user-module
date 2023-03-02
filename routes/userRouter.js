const express = require("express")
const router = express.Router()

const {
  userById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
} = require("../controllers/userController")

router.get("/allUsers", getAllUsers)
router.get("/:userId", getUserById)
router.put("/:userId", updateUserById)
router.delete("/:userId", deleteUserById)

router.param("userId", userById)

module.exports = router
