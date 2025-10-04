// imporing express and router library to manage api routing
const express = require("express")
const router = express.Router()

const registerController = require("../../controller/UserRegister")
const adminregisterController = require("../../controller/adminRegister")
const loginController = require("../../controller/Login")
const logoutController = require("../../controller/logout")
const authMiddleware = require("../../middleware/Auth")

router.post("/adminregister", adminregisterController.Register)
router.post("/register", registerController.Register)
router.post("/login", loginController.Login)
router.get("/logout",authMiddleware.Auth, logoutController.logout)

module.exports = router
