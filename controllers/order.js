const Order = require("../models/order");
const Organization = require("../models/organization");
const FoodItem = require("../models/fooditem");
// const QRCode = require('qrcode');
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const excelExporter = require("../services/exportToExcel");
const moment = require("moment-timezone");
const orderStatus = require("../services/orderStatus");
//const moment = require('moment');

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const PassThrough = require("stream");
const { Blob } = require("buffer");
const { sendRawMail } = require("../util/ses");
const { Op } = require("sequelize");
const { log } = require("console");
const { formatWithOptions } = require("util");

module.exports.saveOrder = (req, res, next) => {
  const user = req.user;
  const domain = user.split("@")[1] ? user.split("@")[1] : "";
  let lunchCutOff;
  let dinnerCutOff;
  let name;
  let type;

  const currentDate = moment().tz("Asia/Kolkata");
  const currentHour = currentDate.hours();
  const currentMinutes = currentDate.minutes();
  currentDate.startOf("day");
    
FoodItem.findOne({
    where: {
    id: req.body.foodItemId,
    },
    include : Organization
}).then((foodItem) => {
    lunchCutOff = foodItem.Organization.lunch_cutoff.split(":");
    dinnerCutOff = foodItem.Organization.dinner_cutoff.split(":");
    name = foodItem.name;
    type = foodItem.menuType;
    if (foodItem && domain === foodItem.OrganizationDomain) {
        if (
            isTimeValid(currentDate, foodItem, currentHour, lunchCutOff, currentMinutes, dinnerCutOff)
        ) {
            const otp = book();
            Order.create({
            FoodItemId: req.body.foodItemId,
            name: foodItem.name,
            date: foodItem.date,
            empId: user,
            otp: otp,
            status: orderStatus.PENDING,
            OrganizationDomain: domain,
            type: type
            })
            .then((result) => {
                console.log(result);
                return res.send({ otp: result.otp, 
                    status: result.status,
                    name: name,
                    type: type,
                    empId: result.empId
                });
            })
            .catch((err) => {
                return res.send(err);
            });
        } 
        else {
            return res
            .status(403)
            .send("Booking time for this food item is over now");
        }
    } else {
        return res.status(404).send("Food item not available");
    }
  });
};

module.exports.fetchOrdersForUser = (req, res, next) => {
  const user = req.user;
  Order.findAll({
    where: {
      empId: user,
    },
    include: {
      all: true,
    },
    order: [
        ['date', 'DESC'],
    ],
  }).then((result) => {
    console.log(result);
    return res.send(result);
  });
};

const workSheetColumnNames = ["User ", "Name"];
// const filePath = './orders.xlsx';

module.exports.getAllOrders = (req, res, next) => {
  menuType = req.query.type;
  domain = req.query.org;
  toMail = req.query.toMail;
  currentDate = new Date();
  Order.findAll({
    // where: {
    //     date: {
    //         [Op.like]:  `%${currentDate.split(",")[0]}%`
    //     }
    // },
    include: [
      {
        model: FoodItem,
        where: {
          menuType: menuType,
          OrganizationDomain: domain,
        },
        right: true, // has no effect, will create an inner join
      },
    ],
  }).then((result) => {
    if (result.length == 0) {
      res.status(203).send("No orders found.");
    }

    const date = new Date().getDate() + "-" + (new Date().getMonth() + 1);
    const fileName = `${date}_${menuType}_${domain}_orders.xlsx`;
    const filePath = `./${fileName}`;
    excelExporter.exportOrdersToExcel(result, workSheetColumnNames, filePath);
    sendRawMail(filePath, fileName, toMail)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        return res.send(err);
      });
  });
};

function book() {
  const otpGenerator = require("otp-generator");
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  });
  return otp;
};


function isTimeValid(currentDate, foodItem, currentHour, lunchCutOff, currentMinutes, dinnerCutOff) {
    return (currentDate.isSame(foodItem.date) &&
        foodItem.menuType == "lunch" &&
        (currentHour < lunchCutOff[0] ||
            (currentHour === lunchCutOff[0] &&
                currentMinutes <= lunchCutOff[1]))) ||
        (currentDate.isSame(foodItem.date) &&
            foodItem.menuType == "dinner" &&
            (currentHour < dinnerCutOff[0] ||
                (currentHour === dinnerCutOff[0] &&
                    currentMinutes <= dinnerCutOff[1]))) ||
        currentDate.isBefore(foodItem.date);
}
// module.exports.qrcode = async (req, res, next) => {
//     let name = Math.random() + 'qr.png'
//     QRCode.toFile(name, 'www.google.com', {
//         errorCorrectionLevel: 'H',
//     }, async function(err, url) {
//         console.log(url)

//         const f = fs.readFileSync(name)
//         const command = new PutObjectCommand({
//             Bucket: "food-order-orders",
//             Body: Buffer.from(buffer, 'base64'),
//             Key: name,
//         });

//         try {
//             const response = await client.send(command);

//             // const url = await getSignedUrl(client, command, { expiresIn: 3600 });
//              res.send(response);
//         } catch (err) {
//             console.error(err);
//         }

//     })
// }

// module.exports.getQr = async(req,res,next) => {

//    const params = {
//       Bucket: "testbucketamitt",
//       Key: "download.png",
//       ResponseContentType: 'image/png'
//   };

//   const readcommand = new GetObjectCommand(params);
//   try {
//    const response = await client.send(readcommand);
//    console.log("phunhc gya");
//    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
//    const str = await response.Body
//    const base64Data = btoa(String.fromCharCode(...new Uint8Array(response.Body)));
//    return res.send(base64Data);
//  } catch (err) {
//    console.error(err);
//  }

//}
