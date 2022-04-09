const sequelize = require('../config/database')
const User = require('../models/userModel')

const bcrypt = require('bcrypt');
const saltRounds = 10;

class AuthController{
    async registrationPage(req, res, next){
        try{
            res.render("registration", {msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async submitRegistration(req, res, next){
        try{
            const {username, password, email, phone, confirm, state, city} = req.body;

            let msgRes = {msg: ""}

            if (password && username && email && phone && confirm) {
                if(username.search(/[^a-zA-Z0-9]/g) !== -1)
                {
                    msgRes.msg = "Your username has special characters";
                }
                else if(password.length < 6)
                {
                    msgRes.msg = "Password must be at least 6 characters long";
                }
                else if(password !== confirm)
                {
                    msgRes.msg = "The passwords did not match. Try again.";
                }
                else if(phone.search(/[^0-9\-+]/g) !== -1)
                {
                    msgRes.msg = "The phone number you entered is not correct. Check that only numbers are present in the phone.";
                }
            } else{
                msgRes.msg = "One of the fields was not filled in. Please check again.";
            }

            if(msgRes.msg === ""){
                sequelize.sync().then(function () {
                    User.findAll().then(function (users) {
                        let is_exists = false;

                        for(let i of users){
                            if(i.email === email){
                                msgRes.msg = 'The email already exists!'
                                is_exists = true
                                break
                            }else if(i.username === username){
                                msgRes.msg = 'The username already exists!'
                                is_exists = true
                                break
                            }
                        }

                        if(!is_exists){
                            const hash = bcrypt.hashSync(password, saltRounds);

                            User.create({username, email, phone, state, city, password: hash})
                                .then(function (plan) {
                                    const info = {username, email, phone, state, city, is_admin: false}
                                    req.session.user = info;
                                    return res.redirect("/dashboard");
                                }).catch(function(err){
                                    msgRes.msg = err
                                    return res.render("registration",{msgRes:msgRes, layout:false});
                                });
                        }else{
                            res.render("registration",{msgRes:msgRes, layout:false});
                        }
                    });
                });
            }
            else{
                res.render("registration",{msgRes:msgRes, layout:false});
            }
        }catch(e){
            next(e);
        }
    }

    async loginPage(req, res, next){
        try{
            res.render("login", {msg: "",layout: false});
        }catch(e){
            next(e);
        }
    }

    async submitLogin(req, res, next){
        try{
            const {username, password} = req.body

            let msgRes = { msg: "" };

            sequelize.sync().then(function () {
                User.findAll().then(function (users) {
                    for(let i of users){
                        if(i.username === username && bcrypt.compareSync(password, i.password)){
                            const info = {
                                username: i.username, 
                                email: i.email,
                                state: i.state,
                                city: i.city,
                                phone: i.phone,
                                is_admin: i.is_admin
                            }
                            
                            req.session.user = info;

                            if(i.is_admin)
                                return res.redirect("/admin_dashboard" );
                            return res.redirect("/dashboard");
                        }
                    }

                    msgRes.msg = "Invalid login or/and password!";
                    res.render("login",{msgRes:msgRes, layout:false});
                })
            })
        }catch(e){
            next(e);
        }
    }

    async logout(req, res, next){
        try{
            req.session.reset()
            res.redirect('/auth/login')
        }catch(e){
            next(e);
        }
    }
}

module.exports = new AuthController()