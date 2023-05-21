const { where } = require("sequelize");
const FoodItem = require("../models/fooditem");
exports.getfoodItems = (req,res,next) => {
    if(!req.query.type){
        FoodItem.findAll().then(result => {
            return res.send(result);
        })
    }
    else {
        FoodItem.findAll({where : {
            menuType : req.query.type
        }}).then(result => {
            return res.send(result);
        })
    }
}

exports.addFoodItem = (req,res,next) => {
    
    foodItem = FoodItem.create({
        name: req.body.name,
        menuType: req.body.type,
        calories: req.body.calories,
        protein : req.body.protein,
        carbs : req.body.carbs,
        image : req.body.image,
        description : req.body.description
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err)
    })
}