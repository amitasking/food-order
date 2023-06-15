const {Sequelize} = require('sequelize');
const seq = require('../util/database')

const FoodType = seq.define('FoodType', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    type : {
        type :  Sequelize.STRING
    },

   
    cutoff : {
        type : Sequelize.DATE
    }
});
module.exports = FoodType