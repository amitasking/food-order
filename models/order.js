const {Sequelize} = require('sequelize');
const seq = require('../util/database')

const Order = seq.define('Order', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    date : {
        type : Sequelize.STRING
    }
    ,

    empId : {
        type : Sequelize.STRING
    }
    ,
    type : {
        type : Sequelize.STRING
    }
});
module.exports = Order