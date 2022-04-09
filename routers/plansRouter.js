const Router = require('express');
const controller = require("../controllers/planController"); 

const router = new Router();

router.get("/", controller.getAllPlans);
router.get("/admin_plans_menu", controller.adminPlanMenu);
router.get("/create_plan", controller.createPlanGet)
router.post("/create_plan", controller.createPlanPost)
router.post("/new_plan_submit", controller.newPlan)

router.post("/edit_plan_submit/:plan_name", controller.editPlanSubmit)
router.post("/edit_plan/:plan_name", controller.editPlan)
router.post("/delete_plan/:plan_name", controller.deletePlan)
router.post("/set_popular/:plan_name", controller.setPopular)

router.get("/add_to_card/:plan_name", controller.addToCard)
router.post("/calculate_summary", controller.calculateSummary)



module.exports = router;