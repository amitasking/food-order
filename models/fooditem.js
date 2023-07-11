const {Sequelize} = require('sequelize');
const seq = require('../util/database');
const moment = require('moment-timezone');

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
    },
    servedOn : {
        type : Sequelize.INTEGER
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
}, {
    //timestamps: false, // Disable timestamps if not needed
    timezone: '+05:30', // Set the desired time zone here
});
module.exports = FoodItem