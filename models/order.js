const {Sequelize} = require('sequelize');
const seq = require('../util/database');
const moment = require('moment-timezone');

const Order = seq.define('Order', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    date : {
        type : Sequelize.DATE,
        allowNull: false,
        get() {
        const originalTime = this.getDataValue('date');
        if (originalTime) {
            const timeZone = 'Asia/Kolkata'; // Set the desired time zone here
            return moment(originalTime).tz(timeZone).format();
        }
        return null;
        },
    }
    ,

    empId : {
        type : Sequelize.STRING
    }
    ,
    type : {
        type : Sequelize.STRING
    },
    otp : {
        type : Sequelize.STRING
    },
    status : {
        type : Sequelize.STRING
    }
}, {
    //timestamps: false, // Disable timestamps if not needed
    timezone: '+05:30', // Set the desired time zone here
});
module.exports = Order