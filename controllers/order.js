const Order = require("../models/order");
const Organization = require("../models/organization");
const FoodItem = require("../models/fooditem");
const QRCode = require('qrcode');
const fs = require('fs');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const excelExporter = require("../services/exportToExcel");

const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} = require('@aws-sdk/client-s3');
const PassThrough = require('stream');
const { Blob } = require("buffer");

/**
 * 
 * later add logic to get the cutoff time 
 * from organization and remove the hardcoded value
 */
module.exports.saveOrder = (req, res, next) => {
    const user = req.user;
    const domain = user.split("@")[1] ? user.split("@")[1] : "";
    const result = Organization.findOne({
        where: {
            domain: domain
        },
        include : {
            all : true
        }
    }).then(result => {
        console.log(result);
        return result;
    })

    const currentDateTime = new Date();
    const currentHour = currentDateTime.getHours();
    const foodItem = FoodItem.findOne({
        where: {
            id: req.body.FoodItemId
        }
    }).then(result => {
        return result;
    })
    if (req.body.FoodItemId && foodItem.servedOn == new Date().getDay()) {
      if ((foodItem.menuType == 'lunch' && currentHour < result.lunch_cutoff) || 
      (foodItem.menuType == 'dinner' && currentHour < result.dinner_cutoff)){
        console.log(req.body);
        Order.create({
            FoodItemId : req.body.FoodItemId,
            name: foodItem.name,
            date: new Date(),
            empId: user
        }).then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
      }
        
     
      return false;
    }
    return true;
  

    

}

module.exports.fetchOrdersForUser = (req, res, next) => {
    username = req.query.username
    Order.findAll({
        where: {
            empId: req.query.username
        },
        include : {
            all : true
        }
    }).then(result => {
        console.log(result);
        return res.send(result);
    })

}

const workSheetColumnNames = [
    "Employee Id",
    "Name"
];
const filePath = './orders.xlsx';

module.exports.getAllOrders = (req, res, next) => {
    Order.findAll({
        include : {
            all : true
        }
    }).then(result => {
        console.log(result);
        return res.send(excelExporter.exportOrdersToExcel(result, workSheetColumnNames, filePath));
       // return res.send(result);
    });
 }

module.exports.book = (req,res) => {
   const otpGenerator = require('otp-generator')
   const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
   res.send(otp)
}

module.exports.qrcode = async (req, res, next) => {
    let name = Math.random() + 'qr.png'
    QRCode.toFile(name, 'www.google.com', {
        errorCorrectionLevel: 'H',
    }, async function(err, url) {
        console.log(url)

        const f = fs.readFileSync(name)
        const command = new PutObjectCommand({
            Bucket: "food-order-orders",
            Body: Buffer.from(buffer, 'base64'),
            Key: name,
        });

        try {
            const response = await client.send(command);

            // const url = await getSignedUrl(client, command, { expiresIn: 3600 });
             res.send(response);
        } catch (err) {
            console.error(err);
        }

    })
}


module.exports.getQr = async(req,res,next) => {
   
   const params = {
      Bucket: "testbucketamitt",
      Key: "download.png",
      ResponseContentType: 'image/png'
  };

  const readcommand = new GetObjectCommand(params);
  try {
   const response = await client.send(readcommand);
   console.log("phunhc gya");
   // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
   const str = await response.Body
   const base64Data = btoa(String.fromCharCode(...new Uint8Array(response.Body)));
   return res.send(base64Data);
 } catch (err) {
   console.error(err);
 }
 
}