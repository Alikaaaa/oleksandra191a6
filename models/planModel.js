const sequelize = require('../config/database')
const Sequelize = require('sequelize');

var Plan = sequelize.define('Plan', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    price: Sequelize.DECIMAL,
    description: Sequelize.TEXT,
    features: Sequelize.TEXT,
    icon_path: Sequelize.STRING,
    is_most_popular:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
})

Plan.sync();

module.exports = Plan;