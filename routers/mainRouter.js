const Router = require('express');
const controler = require("../controllers/mainController"); 

const router = new Router();

router.get('/', controler.mainPage);
router.get('/home', controler.homePage);
router.get('/dashboard', controler.dashboardPage);
router.get('/admin_dashboard', controler.adminDashboardPage);
router.get('/shopping_cart', controler.shoppingCartPage);
router.get('/check_now', controler.cartCheckNow);

module.exports = router;