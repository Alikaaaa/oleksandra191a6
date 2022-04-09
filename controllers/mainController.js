class MainController{
    async mainPage(req, res, next){
        try{
            let authorized = true, is_admin = false;
            
            if(!req.session.user)
                authorized = false;
            else
                is_admin = req.session.user.is_admin
            

            res.render("home", {is_admin, authorized ,msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async homePage(req, res, next){
        try{
            let authorized = true, is_admin = false;
            
            if(!req.session.user)
                authorized = false;
            else
                is_admin = req.session.user.is_admin

            res.render("home", {is_admin, authorized ,msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async dashboardPage(req, res, next){
        try{
            let authorized = true, is_admin = false;
            
            if(!req.session.user)
                authorized = false;
            else
                is_admin = req.session.user.is_admin

            res.render("dashboard", {is_admin, authorized ,msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async adminDashboardPage(req, res, next){
        try{
            let authorized = true, is_admin = false;
            
            if(!req.session.user)
                authorized = false;
            else
                is_admin = req.session.user.is_admin

            res.render("admin_dashboard", {is_admin, authorized ,msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async shoppingCartPage(req, res, next){
        try{
            if(!req.session.user)
                return res.redirect("/auth/login");

            if(!req.session.user.selectedPlan)
                return res.render("shopping_cart", {error: "Cart is empty!", authorized: true ,msg: "",layout: false});

                let data = req.session.user.selectedPlan
                let price1 = data.price;
                    
                    let price2 = Math.floor((data.price - (data.price * 0.37)) * 100) / 100; 
                    let price3 = Math.floor((data.price - (data.price * 0.4)) * 100) / 100; 
                    let price4 = Math.floor((data.price - (data.price * 0.43)) * 100) / 100; 
                    

                    const info = {
                        plan_name: data.name,
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
        }catch(e){
            next(e);
        }
    }

    async cartCheckNow(req, res, next){
        try{
            req.session.user.selectedPlan = undefined;

            res.redirect('/home')
        }catch(e){
            next(e);
        }
    }
}

module.exports = new MainController();