const {Sequelize} = require('sequelize');
const seq = require('../util/database')

const Order = seq.define('Order', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    // name : {
    //    type : Sequelize.STRING
    // },

    date : {
        type : Sequelize.DATE
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