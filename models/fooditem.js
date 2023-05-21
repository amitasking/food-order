const {Sequelize} = require('sequelize');
const seq = require('../util/database')

const FoodItem = seq.define('FoodItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    description : {
        type :  Sequelize.STRING
    },

    name : {
       type : Sequelize.STRING
    },

    menuType : {
        type : Sequelize.STRING
    },
    calories : {
        type : Sequelize.INTEGER
    },
    protein : {
        type : Sequelize.INTEGER
    },
    carbs : {
        type : Sequelize.INTEGER
    },

    image : {
        type : Sequelize.STRING
    }
});
module.exports = FoodItem