
const { Sequelize } = require('sequelize');
// const seq = new Sequelize('foodorder','root','423Raja@@', {
//     host: 'localhost:3306',
//     dialect: 'mysql',
//     // ssl: 'Amazon RDS'
// })

const seq = new Sequelize('foodorder', 'root', '423Raja@@', {
    host: 'localhost',
    dialect: 'mysql',
    logging : false
  });
  


module.exports = seq;