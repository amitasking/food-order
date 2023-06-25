const {Sequelize, DataTypes} = require('sequelize');
const seq = require('../util/database')

const Organization = seq.define('Organization', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    domain : {
        type :  DataTypes.STRING
    },

    lunch_cutoff : {
       type : DataTypes.TIME
    },

    dinner_cutoff : {
        type : DataTypes.TIME
    },

    food_admin : {
        type : DataTypes.STRING
    }
});
module.exports = Organization