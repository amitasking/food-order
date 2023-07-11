
const { Sequelize } = require('sequelize');
// const seq = new Sequelize('foodorder','root','423Raja@@', {
//     host: 'localhost:3306',
//     dialect: 'mysql',
//     // ssl: 'Amazon RDS'
// })

const seq = new Sequelize('foodorder', 'root', '423Raja@@', {
    host: 'localhost',
    dialect: 'mysql',
    logging : false,
    dialectOptions: {
      dateStrings: true,
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    timezone: '+05:30'
    //useUTC: false
  });
  


module.exports = seq;