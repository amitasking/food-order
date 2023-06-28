const {Sequelize} = require('sequelize');
const seq = require('../util/database')

const notification = seq.define('Notification', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    user : {
        type :  Sequelize.STRING
    },

    endpoint : {
       type : Sequelize.STRING
    },

    auth : {
        type : Sequelize.STRING
    },
    p256dh : {
        type : Sequelize.STRING
    },
});
module.exports = notification