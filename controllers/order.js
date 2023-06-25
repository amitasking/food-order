const Order = require("../models/order");
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


module.exports.saveOrder = (req, res, next) => {
    // const currentDateTime = new Date();
    // const currentHour = currentDateTime.getHours();
    // const currentMinutes = currentDateTime.getMinutes();
    // if (this.foodItem && this.foodItem.servedOn == new Date().getDay()) {
    //   if (this.foodItem.menuType == 'lunch' && (currentHour < 10 || (currentHour === 10 && currentMinutes === 0)))
    //     return true;
    //   if (this.foodItem.menuType == 'dinner' && (currentHour < 16 || (currentHour === 16 && currentMinutes === 0)))
    //     return true;
    //   return false;
    // }
    // return true;
  

    console.log(req.body);
    Order.create({
        FoodItemId : req.body.FoodItemId,
        name: req.body.name,
        date: new Date(),
        empId: req.body.empId
    }).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
    })

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