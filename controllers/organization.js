const Organization = require("../models/organization");


module.exports.fetchOrganizations = (req, res, next) => {
    Organization.findAll().then(result => {
        return res.send(result);
    })
}

module.exports.saveOrganization = (req, res, next) => {
    const user = req.user;
    const domain = user.split("@")[1] ? user.split("@")[1] : "";
    Organization.create({
        domain : req.body.domain,
        lunch_cutoff: req.body.lunch_cutoff,
        dinner_cutoff: req.body.dinner_cutoff,
        food_admin : req.body.food_admin
    }).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
    })
}

