const { where } = require("sequelize");
const FoodItem = require("../models/fooditem");

exports.getfoodItems = (req, res, next) => {
    //res.send(req.user);
    const user = req.user
    const domain = user.split("@")[1] ? user.split("@")[1] : "";
    
    if (req.query.day && req.query.type) {
        console.log("sendind data for day " + req.query.day);
        FoodItem.findAll({
            where: {
                servedOn: req.query.day,
                menuType: req.query.type,
                OrganizationDomain: domain
            }
        }).then(result => {
            return res.send(result);
        })
    }
    else if (req.query.type) {
        FoodItem.findAll({
            where: {
                menuType: req.query.type,
                OrganizationDomain: domain
            }
        }).then(result => {
            return res.send(result);
        })
    }
    else if (req.query.day) {
        // console.log("sendind data for day " + req.query.day);
        FoodItem.findAll({
            where: {
                servedOn: req.query.day,
                OrganizationDomain: domain
            }
        }).then(result => {
            return res.send(result);
        })
    }
    else if (req.query.all) {
        FoodItem.findAll({
            where: {
                OrganizationDomain: domain
            }
        }).then(result => {
            return res.send(result);
        })
    }
    else if (req.query.id){
        FoodItem.findOne({
            where: {
                id: req.query.id
            }
        }).then(result => {
            return res.send(result);
        })
    }
}

exports.addFoodItem = (req, res, next) => {
    const user = req.user
    const domain = user.split("@")[1] ? user.split("@")[1] : "";

    foodItem = FoodItem.create({
        OrganizationDomain: domain,
        name: req.body.name,
        menuType: req.body.menuType,
        calories: req.body.calories,
        protein: req.body.protein,
        carbs: req.body.carbs,
        image: req.body.image,
        description: req.body.description,
        servedOn: req.body.servedOn
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err)
    })
}


