const Router = require('express');
const authController = require("../controllers/authController"); 

const router = new Router();

router.get('/login', authController.loginPage);
router.post('/login_submit', authController.submitLogin);
router.get('/registration', authController.registrationPage);
router.post('/registration', authController.submitRegistration);
router.get('/logout', authController.logout);

module.exports = router;