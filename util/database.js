
const { Sequelize } = require('sequelize');
const seq = new Sequelize('foodorder','admin','3WviEtDNq*31', {
    host: 'foodorder.csk8n63h5v4p.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    ssl: 'Amazon RDS'
})


module.exports = seq;