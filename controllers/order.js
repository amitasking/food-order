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

// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: 'us-east-1'
});




// module.exports.saveOrder = (req, res, next) => {
   
//     console.log(req.body)
//     Order.create({
//         date: new Date(),
//         FoodItemId : req.body.foodItemId,
//         empId : req.body.empId,
//         type : req.body.type,
//     }).then(result => {
//         res.send(result);
//     }).catch(err => {

//     })

// }

module.exports.saveOrder = (req, res, next) => {
    console.log(req.body);
    Order.create({
        FoodItemId : req.body.foodItemId,
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
    // Order.findAll().then(result => {
    //     where: {
    //         menuType: req.query.type
    //     }
    //     return res.send(result);
    // })
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
        excelExporter.exportOrdersToExcel(result, workSheetColumnNames, filePath);
        return res.send(result);
    });
 }

//  const s3 = new S3({
//    accessKeyId: 'AKIAZDF6IK5WXADBBQGS',
//    secretAccessKey: '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',
//  })

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
            Bucket: "testbucketamitt",
            Key: name,
            Body: f
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