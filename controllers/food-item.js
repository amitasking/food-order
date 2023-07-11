const { where } = require("sequelize");
const FoodItem = require("../models/fooditem");
const moment = require('moment');

exports.getfoodItems = (req, res, next) => {
    //res.send(req.user);
    const user = req.user
    const domain = user.split("@")[1] ? user.split("@")[1] : "";
    
    if (req.query.date) {
        const lunchFoods = FoodItem.findAll({
            where: {
                date: req.query.date,
                OrganizationDomain: domain,
                menuType: "lunch"
            },
          });
          
        const dinnerFoods = FoodItem.findAll({
            where: {
                date: req.query.date,
                OrganizationDomain: domain,
                menuType: "dinner"
            },
        });
        
        Promise.all([lunchFoods, dinnerFoods])
            .then(results => {
                const [lunch, dinner] = results;
                return res.send({lunch, dinner});
            })
            .catch(error => {
                console.error(error);
            }
        );
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
            //result.date = moment(date).local();
            return res.send(result);
        })
    }
}

exports.addFoodItem = (req, res, next) => {
    const user = req.user
    const domain = user.split("@")[1] ? user.split("@")[1] : "";
    const date = moment(req.body.date).local().date();
    const currentDate = moment().local().date();
    if(date < currentDate){
        return res.status(400).send("Food addition window is closed for this time. Please try for some other time");
    }

    foodItem = FoodItem.create({
        OrganizationDomain: req.body.domain,
        name: req.body.name,
        menuType: req.body.menuType,
        calories: req.body.calories,
        protein: req.body.protein,
        carbs: req.body.carbs,
        image: req.body.image,
        description: req.body.description,
        servedOn: req.body.servedOn,
        date: moment(req.body.date)
    }).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err)
    })
}


