const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);

router.get("/refresh_token", userController.refreshToken);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/verify", auth, userController.getUser);

router.patch('/addCart',auth,userController.addCart)

router.get('/history',auth,userController.history)

module.exports = router;
