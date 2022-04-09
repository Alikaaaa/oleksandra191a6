const sequelize = require('../config/database')
const Sequelize = require('sequelize');

var User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    phone: Sequelize.STRING,
    state: Sequelize.TEXT,
    city: Sequelize.TEXT,
    password: Sequelize.STRING,
    is_admin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},{
    createdAt: false, 
    updatedAt: false 
})

User.sync();

module.exports = User;