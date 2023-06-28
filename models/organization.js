const {Sequelize, DataTypes} = require('sequelize');
const seq = require('../util/database')

const Organization = seq.define('Organization', {

    domain : {
        type :  DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },

    lunch_cutoff : {
       type : DataTypes.STRING
    },

    dinner_cutoff : {
        type : DataTypes.STRING
    },

    food_admin : {
        type : DataTypes.STRING
    }
});
module.exports = Organization