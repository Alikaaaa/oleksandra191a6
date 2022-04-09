const sequelize = require('../config/database')
const User = require('../models/userModel')
const Plan = require('../models/planModel')

const upload = require('../config/diskStorage')

class PlanController{
    async adminPlanMenu(req, res, next){
        try{
            if(!req.session.user)
                return res.redirect('/auth/login')
            
            if(!req.session.user.is_admin)
                return res.render("admin_plans_menu",{
                    error: "Permission denied!",
                    layout: false
                })

            sequelize.sync().then(function () {
                Plan.findAll().then(function(data){  
                    for(let i of data){
                        i.features = i.features.split('\r\n')
                    }
                    
                    res.render("admin_plans_menu",{
                        plans: data, 
                        layout: false,
                        helpers: {
                            edit_button_action: function (name) {
                                console.log(name);
                            }
                        }
                    });
                });
            });
        }catch(e){
            next(e);
        }
    }

    async getAllPlans(req, res, next){
        try{
            let authorized = true;
            
            if(!req.session.user)
                authorized = false;


            sequelize.sync().then(function () {
                Plan.findAll().then(function(data){  
                    for(let i of data){
                        i.features = i.features.split('\r\n')
                    }
                    
                    res.render("cwh",{
                        authorized,
                        plans: data, 
                        layout: false
                    });
                });
            });        
        }catch(e){
            next(e);
        }
    }
    
    async createPlanGet(req, res, next){
        try{
            res.render("create_plan",{
                msg:"", 
                layout: false
            });
        }catch(e){
            next(e);
        }
    }

    async createPlanPost(req, res, next){
        try{
            res.render("create_plan",{
                msg:"", 
                layout: false
            });
        }catch(e){
            next(e);
        }
    }

    async newPlan(req, res, next){
        try{
            upload(req, res, (err)=>{
                if(err){
                    res.render("create_plan",{
                        error: "Please, select correct icons file!", 
                        layout: false
                    });
                }else{
                    let information = {
                        name: req.body.name,
                        price: req.body.price,
                        description: req.body.description,
                        features: req.body.features,
                        icon_path: ''
                    }
        
                    if(req.file && req.file.filename)
                        information.icon_path = req.file.filename
        
                
                    let error = ''
                
                    if(information.name.length == 0){
                        error += 'Name is empty\n'
                    }
                
                    if(information.price.length == 0){
                        error += 'Price is empty\n'
                    }
                
                    if(information.description.length == 0){
                        error += 'Description is empty\n'
                    }
                
                    if(error != ''){
                        return res.render("create_plan",{
                            error: error, 
                            layout: false
                        });
                    }
                
                    console.log(information)
                
                    sequelize.sync().then(function () {
                        Plan.create(information).then(function (plan) {
                            res.redirect("/plans/admin_plans_menu")
                        }).catch(function (error) {
                            res.render("create_plan",{
                                error: "something went wrong!", 
                                layout: false
                            });
                            console.log("something went wrong!");
                        });
                    });
                
                }
                
            })
            
        }catch(e){
            next(e);
        }
    }

    async editPlanSubmit(req, res, next){
        try{
            let {plan_name} = req.params;

            let information = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                features: req.body.features,
            }

            sequelize.sync().then(function () {
                Plan.update(information, { where: {name: plan_name}}).then(function(data){  
                    res.redirect("/plans/admin_plans_menu")
                });
            });
        }catch(e){
            next(e);
        }
    }

    async editPlan(req, res, next){
        try{
            let {plan_name} = req.params;
            console.log("Name: " + plan_name)

            sequelize.sync().then(function () {
                Plan.findAll({ where: {name: plan_name}}).then(function(data){  
                    
                    console.log(data)
                    console.log(data[0])

                    res.render("edit_plan",{
                        data: data, 
                        layout: false
                    });
                });
            });
        }catch(e){
            next(e);
        }
    }

    async deletePlan(req, res, next){
        try{
            let {plan_name} = req.params;
            console.log("Name: " + plan_name)

            sequelize.sync().then(function () {
                Plan.destroy({ where: {name: plan_name}}).then(function(data){  
                    res.redirect("/plans/admin_plans_menu")
                });
            });
        }catch(e){
            next(e);
        }
    }

    async setPopular(req, res, next){
        try{
            let {plan_name} = req.params;
            console.log("Name: " + plan_name)

            sequelize.sync().then(function () {
                Plan.update({is_most_popular: false},{ where: {is_most_popular: true}}).then(function(data){  
                    Plan.update({is_most_popular: true},{ where: {name: plan_name}}).then(function(data){  
                        res.redirect("/plans/admin_plans_menu")
                    });
                });
            });
        }catch(e){
            next(e);
        }
    }

    async addToCard(req, res, next){
        try{
            if(!req.session.user)
                return res.redirect('/auth/login')

            let {plan_name} = req.params;

            sequelize.sync().then(function () {
                Plan.findAll({ where: {name: plan_name}}).then(function(data){
                    req.session.user.selectedPlan = data[0]

                    let price1 = data[0].price;
                    
                    let price2 = Math.floor((data[0].price - (data[0].price * 0.37)) * 100) / 100; 
                    let price3 = Math.floor((data[0].price - (data[0].price * 0.4)) * 100) / 100; 
                    let price4 = Math.floor((data[0].price - (data[0].price * 0.43)) * 100) / 100; 
                    

                    const info = {
                        plan_name: plan_name,
                        card1: {
                            price: price1,
                        }, 

                        card2: {
                            price: price2,
                            save: 37
                        },

                        card3: {
                            price: price3,
                            save: 40
                        },

                        card4: {
                            price: price4,
                            save: 43
                        }
                    }

                    res.render("shopping_cart",{
                        authorized: true,
                        info: info, 
                        layout: false
                    });
                });
            });


        }catch(e){
            next(e);
        }
    }

    async calculateSummary(req, res, next){
        try{
            const {plan_name, month_count} = req.body;
            
            sequelize.sync().then(function () {
                Plan.findAll({ where: {name: plan_name}}).then(function(data){
                    
                    console.log(plan_name + "\n\n")

                    let result = {
                        plan_name,
                        month_count,
                        full_price: data[0].price * month_count,
                        promo: 0,
                        total: data[0].price * month_count
                    }
        
                    if(month_count == 12){
                        result.promo = (Math.floor(result.full_price * 0.37 * 100) / 100)
                    } else if(month_count == 24){
                        result.promo = (Math.floor(result.full_price * 0.4 * 100) / 100)
                    } else if(month_count == 36){
                        result.promo = (Math.floor(result.full_price * 0.43 * 100) / 100)
                    } 

                    result.total = result.full_price - result.promo
                    
                    return res.json(result)
                });
            });
        }catch(e){
            next(e);
        }
    }
}

module.exports = new PlanController()